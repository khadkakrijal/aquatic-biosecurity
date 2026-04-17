import * as XLSX from "xlsx";
import { createClient } from "@/utils/supabase/server";

type Row = Record<string, unknown>;

type ImportResult = {
  success: true;
  scenarioId: string;
  scenarioTitle: string;
};

function toText(value: unknown): string {
  return String(value ?? "").trim();
}

function toBool(value: unknown): boolean {
  const v = toText(value).toLowerCase();
  return v === "true" || v === "yes" || v === "1";
}

function toInt(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function stageIdFromName(phaseNumber: number, stageName: string): string {
  return `p${phaseNumber}-${slugify(stageName)}`;
}

function questionIdFromStage(stageId: string, index: number): string {
  return `${stageId}-q${index + 1}`;
}

function criterionIdFromStage(stageId: string, index: number): string {
  return `${stageId}-c${index + 1}`;
}

function mapPathType(label: string): string {
  const v = toText(label).toLowerCase();

  const map: Record<string, string> = {
    "main path": "main",
    "reporting path": "reporting",
    "containment path": "containment",
    "surveillance path": "surveillance",
    "coordination path": "coordination",
    "stakeholder trust path": "trust",
    "communication path": "communication",
    "tracing path": "tracing",
    "removal / disposal path": "disposal",
    "approval / alignment path": "alignment",
    "workforce path": "workforce",
    "recovery path": "recovery",
    "completion path": "complete",
  };

  return map[v] ?? "main";
}

function parseCriterionRoutes(
  input: string,
): Array<{ criterionName: string; nextStageName: string }> {
  if (!input.trim()) return [];

  return input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [left, right] = part.split("->").map((s) => s.trim());
      return {
        criterionName: left || "",
        nextStageName: right || "",
      };
    })
    .filter((item) => item.criterionName && item.nextStageName);
}

function getSheetRows(workbook: XLSX.WorkBook, sheetName: string): Row[] {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Missing sheet: ${sheetName}`);
  }

  return XLSX.utils.sheet_to_json<Row>(sheet, {
    defval: "",
    raw: false,
  });
}

export async function importScenarioFromExcel(
  fileBuffer: ArrayBuffer,
): Promise<ImportResult> {
  const workbook = XLSX.read(fileBuffer, { type: "array" });

  const scenarioRows = getSheetRows(workbook, "Scenario");
  const stageRows = getSheetRows(workbook, "Stages");
  const questionRows = getSheetRows(workbook, "Questions");
  const criteriaRows = getSheetRows(workbook, "Criteria");
  const branchingRows = getSheetRows(workbook, "Branching");

  if (scenarioRows.length !== 1) {
    throw new Error("Scenario sheet must contain exactly one row.");
  }

  const scenarioRow = scenarioRows[0];

  const scenarioName = toText(scenarioRow["scenario_name"]);
  const category = toText(scenarioRow["category"]);
  const overview = toText(scenarioRow["overview"]);
  const publishNow = toBool(scenarioRow["publish_now"]);

  if (!scenarioName) {
    throw new Error("Scenario sheet: scenario_name is required.");
  }

  if (!overview) {
    throw new Error("Scenario sheet: overview is required.");
  }

  if (!stageRows.length) {
    throw new Error("Stages sheet must contain at least one row.");
  }

  const stageKeySet = new Set<string>();
  const stageNameToInternalId = new Map<string, string>();

  for (const row of stageRows) {
    const phaseNumber = toInt(row["phase_number"]);
    const stageName = toText(row["stage_name"]);

    if (!phaseNumber || !stageName) {
      throw new Error(
        "Stages sheet: every row must include phase_number and stage_name.",
      );
    }

    const key = `${phaseNumber}::${stageName}`;
    if (stageKeySet.has(key)) {
      throw new Error(
        `Duplicate stage found in Stages sheet: Phase ${phaseNumber} — ${stageName}`,
      );
    }
    stageKeySet.add(key);

    const generatedStageId = stageIdFromName(phaseNumber, stageName);
    stageNameToInternalId.set(stageName, generatedStageId);
  }

  for (const row of questionRows) {
    const stageName = toText(row["stage_name"]);
    if (stageName && !stageNameToInternalId.has(stageName)) {
      throw new Error(
        `Questions sheet refers to unknown stage_name: ${stageName}`,
      );
    }
  }

  for (const row of criteriaRows) {
    const stageName = toText(row["stage_name"]);
    if (stageName && !stageNameToInternalId.has(stageName)) {
      throw new Error(
        `Criteria sheet refers to unknown stage_name: ${stageName}`,
      );
    }
  }

  for (const row of branchingRows) {
    const stageName = toText(row["stage_name"]);
    if (stageName && !stageNameToInternalId.has(stageName)) {
      throw new Error(
        `Branching sheet refers to unknown stage_name: ${stageName}`,
      );
    }

    const destinationFields = [
      "if_response_is_strong",
      "if_response_is_mixed",
      "if_response_is_weak",
      "default_next_stage",
    ];

    for (const field of destinationFields) {
      const destination = toText(row[field]);
      if (destination && !stageNameToInternalId.has(destination)) {
        throw new Error(
          `Branching sheet has unknown destination stage_name: ${destination}`,
        );
      }
    }

    const parsedRoutes = parseCriterionRoutes(
      toText(row["if_specific_criterion_is_missed"]),
    );
    for (const route of parsedRoutes) {
      if (!stageNameToInternalId.has(route.nextStageName)) {
        throw new Error(
          `Branching sheet has unknown criterion route destination stage_name: ${route.nextStageName}`,
        );
      }
    }
  }

  const supabase = await createClient();

  let insertedScenarioId: string | null = null;

  try {
    const scenarioSlug = slugify(scenarioName);

    const { data: existingScenario } = await supabase
      .from("scenarios")
      .select("id")
      .eq("slug", scenarioSlug)
      .maybeSingle();

    if (existingScenario) {
      throw new Error(
        `A scenario with link name "${scenarioSlug}" already exists.`,
      );
    }

    const { data: insertedScenario, error: scenarioInsertError } =
      await supabase
        .from("scenarios")
        .insert({
          title: scenarioName,
          slug: scenarioSlug,
          overview,
          category: category || "aquatic-biosecurity",
          version: 1,
          is_active: true,
          is_published: publishNow,
        })
        .select("id")
        .single();

    if (scenarioInsertError || !insertedScenario) {
      throw new Error(
        `Failed to create scenario: ${scenarioInsertError?.message || "Unknown error"}`,
      );
    }

    insertedScenarioId = insertedScenario.id;

    const stageDbIdByStageName = new Map<string, string>();

    for (const row of stageRows) {
      const phaseNumber = toInt(row["phase_number"]);
      const stageName = toText(row["stage_name"]);
      const stageId = stageNameToInternalId.get(stageName)!;
      const timePeriod = toText(row["time_period"]);
      const pathType = mapPathType(toText(row["path_type"]));
      const displayOrder = toInt(row["display_order"], 0);
      const outcomeGroup = toText(row["outcome_group"]);
      const finalStage = toBool(row["final_stage"]);
      const stageNarrative = toText(row["stage_narrative"]);

      const { data: insertedStage, error: stageInsertError } = await supabase
        .from("scenario_stages")
        .insert({
          scenario_id: insertedScenarioId,
          stage_id: stageId,
          phase_number: phaseNumber,
          title: stageName,
          timeframe: timePeriod,
          branch_family: pathType,
          base_scenario_text: stageNarrative,
          min_score: 0,
          required_criteria_ids: [],
          next_stage_map: {},
          sort_order: displayOrder,
          is_active: true,
          is_terminal: finalStage,
          summary_category: outcomeGroup || null,
        })
        .select("id")
        .single();

      if (stageInsertError || !insertedStage) {
        throw new Error(
          `Failed to create stage "${stageName}": ${stageInsertError?.message || "Unknown error"}`,
        );
      }

      stageDbIdByStageName.set(stageName, insertedStage.id);
    }

    const criteriaByStageName = new Map<
      string,
      Array<{
        dbId: string;
        generatedCriterionId: string;
        criterionName: string;
        required: boolean;
        weight: number;
      }>
    >();

    const groupedCriteria = new Map<string, Row[]>();
    for (const row of criteriaRows) {
      const stageName = toText(row["stage_name"]);
      if (!groupedCriteria.has(stageName)) groupedCriteria.set(stageName, []);
      groupedCriteria.get(stageName)!.push(row);
    }

    for (const [stageName, rows] of groupedCriteria.entries()) {
      const stageDbId = stageDbIdByStageName.get(stageName);
      const stageInternalId = stageNameToInternalId.get(stageName);

      if (!stageDbId || !stageInternalId) continue;

      const sortedRows = [...rows].sort(
        (a, b) => toInt(a["display_order"], 0) - toInt(b["display_order"], 0),
      );

      const insertedCriteriaForStage: Array<{
        dbId: string;
        generatedCriterionId: string;
        criterionName: string;
        required: boolean;
        weight: number;
      }> = [];

      for (let i = 0; i < sortedRows.length; i++) {
        const row = sortedRows[i];
        const criterionName = toText(row["criterion_name"]);
        const criterionText = toText(row["criterion_text"]);
        const consequence = toText(row["consequence_if_missed"]);
        const theme = toText(row["theme"]) || "Protocols";
        const required = toBool(row["required"]);
        const weight = toInt(row["priority_weight"], 1);
        const displayOrder = toInt(row["display_order"], i + 1);
        const keywords = toText(row["keywords"])
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean);

        if (!criterionText) {
          throw new Error(
            `Criteria sheet has an empty criterion_text for stage "${stageName}".`,
          );
        }

        const generatedCriterionId = criterionIdFromStage(stageInternalId, i);

        const { data: insertedCriterion, error: criterionInsertError } =
          await supabase
            .from("stage_criteria")
            .insert({
              stage_ref_id: stageDbId,
              criterion_id: generatedCriterionId,
              text: criterionText,
              consequence,
              theme,
              required,
              weight,
              keywords,
              sort_order: displayOrder,
            })
            .select("id")
            .single();

        if (criterionInsertError || !insertedCriterion) {
          throw new Error(
            `Failed to create criterion "${criterionName || criterionText}" for stage "${stageName}": ${
              criterionInsertError?.message || "Unknown error"
            }`,
          );
        }

        insertedCriteriaForStage.push({
          dbId: insertedCriterion.id,
          generatedCriterionId,
          criterionName,
          required,
          weight,
        });
      }

      criteriaByStageName.set(stageName, insertedCriteriaForStage);
    }

    const groupedQuestions = new Map<string, Row[]>();
    for (const row of questionRows) {
      const stageName = toText(row["stage_name"]);
      if (!groupedQuestions.has(stageName)) groupedQuestions.set(stageName, []);
      groupedQuestions.get(stageName)!.push(row);
    }

    for (const [stageName, rows] of groupedQuestions.entries()) {
      const stageDbId = stageDbIdByStageName.get(stageName);
      const stageInternalId = stageNameToInternalId.get(stageName);

      if (!stageDbId || !stageInternalId) continue;

      const sortedRows = [...rows].sort(
        (a, b) => toInt(a["display_order"], 0) - toInt(b["display_order"], 0),
      );

      for (let i = 0; i < sortedRows.length; i++) {
        const row = sortedRows[i];
        const questionText = toText(row["question_text"]);
        const theme = toText(row["theme"]) || "Protocols";
        const helperText = toText(row["helper_text"]);
        const displayOrder = toInt(row["display_order"], i + 1);

        if (!questionText) {
          throw new Error(
            `Questions sheet has an empty question_text for stage "${stageName}".`,
          );
        }

        const generatedQuestionId = questionIdFromStage(stageInternalId, i);

        const { error: questionInsertError } = await supabase
          .from("stage_questions")
          .insert({
            stage_ref_id: stageDbId,
            question_id: generatedQuestionId,
            text: questionText,
            theme,
            placeholder: helperText,
            sort_order: displayOrder,
          });

        if (questionInsertError) {
          throw new Error(
            `Failed to create question for stage "${stageName}": ${questionInsertError.message}`,
          );
        }
      }
    }

    const branchingByStageName = new Map<string, Row>();
    for (const row of branchingRows) {
      const stageName = toText(row["stage_name"]);
      if (stageName) branchingByStageName.set(stageName, row);
    }

    for (const row of stageRows) {
      const stageName = toText(row["stage_name"]);
      const stageDbId = stageDbIdByStageName.get(stageName);
      if (!stageDbId) continue;

      const insertedCriteria = criteriaByStageName.get(stageName) || [];
      const branchingRow = branchingByStageName.get(stageName);

      const requiredCriteriaIds = insertedCriteria
        .filter((item) => item.required)
        .map((item) => item.generatedCriterionId);

      const requiredWeightSum = insertedCriteria
        .filter((item) => item.required)
        .reduce((sum, item) => sum + item.weight, 0);

      const requiredCount = insertedCriteria.filter(
        (item) => item.required,
      ).length;
      const computedMinScore =
        requiredCount > 0 ? Math.min(requiredWeightSum, requiredCount * 2) : 0;

      const nextStageMap: Record<string, unknown> = {};

      if (branchingRow) {
        const strong = toText(branchingRow["if_response_is_strong"]);
        const mixed = toText(branchingRow["if_response_is_mixed"]);
        const weak = toText(branchingRow["if_response_is_weak"]);
        const fallback = toText(branchingRow["default_next_stage"]);

        if (strong) nextStageMap.strong = stageNameToInternalId.get(strong);
        if (mixed) nextStageMap.mixed = stageNameToInternalId.get(mixed);
        if (weak) nextStageMap.limited = stageNameToInternalId.get(weak);
        if (fallback)
          nextStageMap.fallback = stageNameToInternalId.get(fallback);

        const routePairs = parseCriterionRoutes(
          toText(branchingRow["if_specific_criterion_is_missed"]),
        );

        if (routePairs.length) {
          const byMissingRequired: Record<string, string> = {};
          const byMissingRequiredPriority: string[] = [];

          for (const route of routePairs) {
            const matchedCriterion = insertedCriteria.find(
              (item) => item.criterionName === route.criterionName,
            );

            const nextStageId = stageNameToInternalId.get(route.nextStageName);

            if (matchedCriterion && nextStageId) {
              byMissingRequired[matchedCriterion.generatedCriterionId] =
                nextStageId;
              byMissingRequiredPriority.push(
                matchedCriterion.generatedCriterionId,
              );
            }
          }

          if (Object.keys(byMissingRequired).length) {
            nextStageMap.byMissingRequired = byMissingRequired;
            nextStageMap.byMissingRequiredPriority = byMissingRequiredPriority;
          }
        }
      }

      const { error: stageUpdateError } = await supabase
        .from("scenario_stages")
        .update({
          min_score: computedMinScore,
          required_criteria_ids: requiredCriteriaIds,
          next_stage_map: nextStageMap,
          updated_at: new Date().toISOString(),
        })
        .eq("id", stageDbId);

      if (stageUpdateError) {
        throw new Error(
          `Failed to update branching for stage "${stageName}": ${stageUpdateError.message}`,
        );
      }
    }
    if (!insertedScenarioId) {
      throw new Error("Scenario ID was not created.");
    }
    return {
      success: true,
      scenarioId: insertedScenarioId,
      scenarioTitle: scenarioName,
    };
  } catch (error) {
    if (insertedScenarioId) {
      await supabase.from("scenarios").delete().eq("id", insertedScenarioId);
    }

    throw error;
  }
}
