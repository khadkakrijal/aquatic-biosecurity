import { openai } from "@/app/lib/ai-summary";
import { NextResponse } from "next/server";

type ThemeCategory =
  | "Protocols"
  | "Data"
  | "Stakeholders"
  | "Constraints"
  | "Communication"
  | "Expectations";

type EvaluationDecision = "strong" | "mixed" | "limited";
type ScenarioSeverity = "manageable" | "elevated" | "severe";

const VALID_THEMES: ThemeCategory[] = [
  "Protocols",
  "Data",
  "Stakeholders",
  "Constraints",
  "Communication",
  "Expectations",
];

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function extractJsonObject(raw: string) {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const possibleJson = cleaned.slice(firstBrace, lastBrace + 1);
      return JSON.parse(possibleJson);
    }

    throw new Error("AI returned invalid JSON.");
  }
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function sentenceCount(text: string) {
  return text
    .split(/[.!?]\s+/)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

function keywordHitsForCriterion(answer: string, keywords: string[] = []) {
  if (!keywords.length) return 0;
  const normalized = normalizeText(answer);
  let hits = 0;

  for (const keyword of keywords) {
    const k = normalizeText(keyword);
    if (k && normalized.includes(k)) {
      hits += 1;
    }
  }

  return hits;
}

function buildFallbackMissedCriteriaTexts(stage: any, missingIds: string[]) {
  return missingIds
    .map(
      (id) =>
        stage?.criteria?.find((criterion: any) => criterion.id === id)?.text,
    )
    .filter(Boolean);
}

function buildFallbackStrengths(stage: any, matchedIds: string[]) {
  return matchedIds
    .map(
      (id) =>
        stage?.criteria?.find((criterion: any) => criterion.id === id)?.text,
    )
    .filter(Boolean)
    .slice(0, 3);
}

function assessAnswerQuality(answer: string, stage: any) {
  const normalized = normalizeText(answer);
  const words = countWords(answer);
  const sentences = sentenceCount(answer);

  const uncertainPatterns = [
    "i don't know",
    "i dont know",
    "dont know",
    "don't know",
    "idk",
    "not sure",
    "unsure",
    "no idea",
    "not certain",
    "cannot say",
    "can't say",
    "n/a",
  ];

  const isUncertain = uncertainPatterns.some((pattern) =>
    normalized.includes(pattern),
  );

  const exactWeakAnswers = new Set([
    "no idea",
    "dont know",
    "don't know",
    "not sure",
    "unsure",
    "idk",
    "n/a",
  ]);

  const isExactWeakAnswer = exactWeakAnswers.has(normalized);

  const genericWeakPatterns = [
    "inform authority",
    "inform the authority",
    "follow the system",
    "follow risk management",
    "inform them",
    "take action",
    "do surveillance",
    "do containment",
    "notify them",
    "call the team",
    "tell stakeholders",
  ];

  const hasGenericWeakPattern = genericWeakPatterns.some((pattern) =>
    normalized.includes(pattern),
  );

  const criteria = Array.isArray(stage?.criteria) ? stage.criteria : [];
  const requiredCriteriaIds = stage?.passingRules?.requiredCriteriaIds || [];
  const requiredCriteria = criteria.filter((criterion: any) =>
    requiredCriteriaIds.includes(criterion.id),
  );

  const totalKeywordHits = criteria.reduce((sum: number, criterion: any) => {
    return sum + keywordHitsForCriterion(answer, criterion.keywords || []);
  }, 0);

  const requiredKeywordHits = requiredCriteria.reduce(
    (sum: number, criterion: any) => {
      return sum + keywordHitsForCriterion(answer, criterion.keywords || []);
    },
    0,
  );

  const keywordOnlyLikely =
    words < 45 &&
    totalKeywordHits >= 3 &&
    sentences <= 2 &&
    !normalized.includes("because") &&
    !normalized.includes("so that") &&
    !normalized.includes("by ") &&
    !normalized.includes("first") &&
    !normalized.includes("then") &&
    !normalized.includes("while");

  const tooShortForOperationalReasoning = words < 35 || sentences < 2;

  return {
    words,
    sentences,
    isUncertain,
    isExactWeakAnswer,
    hasGenericWeakPattern,
    keywordOnlyLikely,
    tooShortForOperationalReasoning,
    totalKeywordHits,
    requiredKeywordHits,
    isClearlyWeak:
      isExactWeakAnswer ||
      isUncertain ||
      hasGenericWeakPattern ||
      keywordOnlyLikely ||
      words < 25 ||
      requiredKeywordHits === 0,
  };
}

function resolveNextStage(
  stage: any,
  decision: EvaluationDecision,
  missingRequiredCriteriaIds: string[],
) {
  const nextStageMap = stage?.nextStageMap;

  if (!nextStageMap) {
    return {
      nextStageId: "",
      branchReason: "",
    };
  }

  const missing = Array.isArray(missingRequiredCriteriaIds)
    ? missingRequiredCriteriaIds
    : [];

  if (
    Array.isArray(nextStageMap.byMissingRequiredPriority) &&
    nextStageMap.byMissingRequired
  ) {
    for (const criterionId of nextStageMap.byMissingRequiredPriority) {
      if (
        missing.includes(criterionId) &&
        nextStageMap.byMissingRequired[criterionId]
      ) {
        return {
          nextStageId: nextStageMap.byMissingRequired[criterionId],
          branchReason:
            "The next branch was selected because a priority required operational element was not clearly addressed.",
        };
      }
    }
  }

  if (nextStageMap.byMissingRequired) {
    for (const criterionId of missing) {
      const mapped = nextStageMap.byMissingRequired[criterionId];
      if (mapped) {
        return {
          nextStageId: mapped,
          branchReason:
            "The next branch was selected because a required operational element was not clearly addressed.",
        };
      }
    }
  }

  const mappedByDecision =
    (decision === "strong" && nextStageMap.strong) ||
    (decision === "mixed" && nextStageMap.mixed) ||
    (decision === "limited" && nextStageMap.limited) ||
    nextStageMap.fallback ||
    "";

  return {
    nextStageId: mappedByDecision,
    branchReason:
      decision === "strong"
        ? "The next branch was selected because the response covered key operational priorities with stronger practical detail."
        : decision === "mixed"
          ? "The next branch was selected because the response addressed some important actions but still left notable operational gaps."
          : "The next branch was selected because several important response actions were weak or missing.",
  };
}

function enforceDecisionAndMissingCriteria(
  stage: any,
  rawDecision: EvaluationDecision,
  rawMissingRequired: string[],
  answerQuality: ReturnType<typeof assessAnswerQuality>,
) {
  const requiredIds: string[] = stage?.passingRules?.requiredCriteriaIds || [];

  let missingRequired = Array.isArray(rawMissingRequired)
    ? rawMissingRequired.filter((id) => requiredIds.includes(id))
    : [];

  if (answerQuality.isClearlyWeak) {
    missingRequired = [...requiredIds];
  }

  let decision: EvaluationDecision = rawDecision;

  if (answerQuality.isClearlyWeak) {
    decision = "limited";
  } else if (
    answerQuality.tooShortForOperationalReasoning &&
    decision === "strong"
  ) {
    decision = "mixed";
  }

  if (missingRequired.length > 0 && decision === "strong") {
    decision = missingRequired.length >= 2 ? "limited" : "mixed";
  }

  if (
    missingRequired.length === 0 &&
    decision === "limited" &&
    !answerQuality.isClearlyWeak
  ) {
    decision = "mixed";
  }

  return {
    decision,
    missingRequiredCriteriaIds: missingRequired,
  };
}

function severityFromDecision(decision: EvaluationDecision): ScenarioSeverity {
  if (decision === "strong") return "manageable";
  if (decision === "mixed") return "elevated";
  return "severe";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stage, userAnswer, previousOutcome } = body;

    if (!stage || !userAnswer) {
      return NextResponse.json(
        { error: "Missing stage or userAnswer." },
        { status: 400 },
      );
    }

    const answer = String(userAnswer).trim();
    const answerQuality = assessAnswerQuality(answer, stage);

    if (answerQuality.isClearlyWeak) {
      const missingRequiredCriteriaIds =
        stage.passingRules?.requiredCriteriaIds || [];
      const nextStage = resolveNextStage(
        stage,
        "limited",
        missingRequiredCriteriaIds,
      );

      return NextResponse.json({
        score: 0,
        matchedCriteriaIds: [],
        missingRequiredCriteriaIds,
        feedback: `Your response only covered the situation at a very limited level.

- The answer was too brief or too uncertain to show clear operational decision-making
- Important response actions were not explained in enough practical detail
- Key areas such as coordination, surveillance, containment, compliance, logistics, or communication were not clearly addressed

To strengthen your response, explain the practical actions you would take, who would be involved, how you would prioritise them, and how those actions would reduce risk at this stage.`,
        decision: "limited" as EvaluationDecision,
        scenarioSeverity: "severe" as ScenarioSeverity,
        nextScenarioText:
          "Because several critical actions were not clearly addressed, the situation is now worsening. Spread risk is increasing, stakeholder concern is growing, and the next stage will involve greater operational pressure and reduced flexibility in the response.",
        nextStageId: nextStage.nextStageId,
        branchReason: nextStage.branchReason,
        strengths: [],
        missedThemes: [] as ThemeCategory[],
        missedCriteriaTexts: buildFallbackMissedCriteriaTexts(
          stage,
          missingRequiredCriteriaIds,
        ),
      });
    }

    const prompt = `
You are evaluating a user's response in an aquatic biosecurity simulation.

Stage title: ${stage.title}
Stage id: ${stage.id}
Phase number: ${stage.phaseNumber}
Base scenario text:
${stage.baseScenarioText}

Criteria:
${JSON.stringify(stage.criteria, null, 2)}

Evaluation rules:
${JSON.stringify(stage.passingRules, null, 2)}

Previous outcome context:
${previousOutcome || "none"}

User response:
${answer}

Return ONLY valid JSON.
Do not include markdown fences.
Do not include explanations before or after the JSON.
Return exactly one JSON object in this format:
{
  "score": number,
  "matchedCriteriaIds": string[],
  "missingRequiredCriteriaIds": string[],
  "feedback": "string",
  "decision": "strong" | "mixed" | "limited",
  "scenarioSeverity": "manageable" | "elevated" | "severe",
  "nextScenarioText": "string",
  "strengths": string[],
  "missedThemes": string[],
  "missedCriteriaTexts": string[]
}

Rules:
- Evaluate whether the response addresses the criteria in substance, not only exact wording.
- Pay close attention to required criteria and key operational themes.
- Do not give credit for actions the user did not mention.
- Do not reward shallow keyword-dropping, vague generic wording, or answers that only name authorities or themes without practical detail.
- A strong answer must explain practical actions, responsible parties, and how those actions reduce risk.
- Use "strong" when the response sufficiently covers the required actions and demonstrates practical operational understanding.
- Use "mixed" when some important actions are present but notable gaps remain.
- Use "limited" when critical actions are missing or the response is too weak to support an effective response.
- matchedCriteriaIds must only include criteria genuinely addressed by the user.
- missingRequiredCriteriaIds must include required criteria that were not clearly addressed.
- strengths should be a short list of what the user did well in practical terms.
- missedThemes should only contain values from:
  "Protocols", "Data", "Stakeholders", "Constraints", "Communication", "Expectations"
- missedCriteriaTexts should describe important missed actions in plain language, not criterion IDs.

Feedback instructions:
- The feedback must be written in a professional and clear tone.
- Do NOT reference internal criterion IDs.
- Do NOT use pass, partial, fail, passed, failed, or similar grading language.
- Start with a short paragraph explaining what the response covered well.
- Then list weaker or missing areas using bullet points.
- Use plain text bullet points beginning with "- ".
- End with a short improvement summary explaining what would strengthen the response.
- The feedback should feel like practical operational guidance, not a test result.

Scenario progression instructions:
- The nextScenarioText must dynamically evolve the incident based on the user's response quality.
- If the decision is "limited", the scenario should clearly worsen and mention stronger operational pressure.
- If the decision is "mixed", the scenario should remain controllable but show emerging strain or consequences.
- If the decision is "strong", the scenario can remain more controlled, though still realistic and pressured.
`;

    const response = await openai.responses.create({
      model: "gpt-5.1",
      input: prompt,
    });

    const parsed = extractJsonObject(response.output_text || "{}");

    const sanitizedMatchedCriteriaIds = Array.isArray(parsed.matchedCriteriaIds)
      ? parsed.matchedCriteriaIds.filter((id: string) =>
          stage.criteria?.some((criterion: any) => criterion.id === id),
        )
      : [];

    const sanitizedMissingRequiredCriteriaIds = Array.isArray(
      parsed.missingRequiredCriteriaIds,
    )
      ? parsed.missingRequiredCriteriaIds.filter((id: string) =>
          stage.passingRules?.requiredCriteriaIds?.includes(id),
        )
      : [];

    const rawDecision: EvaluationDecision =
      parsed.decision === "strong" ||
      parsed.decision === "mixed" ||
      parsed.decision === "limited"
        ? parsed.decision
        : "mixed";

    const enforced = enforceDecisionAndMissingCriteria(
      stage,
      rawDecision,
      sanitizedMissingRequiredCriteriaIds,
      answerQuality,
    );

    const nextStage = resolveNextStage(
      stage,
      enforced.decision,
      enforced.missingRequiredCriteriaIds,
    );

    const sanitizedMissedThemes: ThemeCategory[] = Array.isArray(
      parsed.missedThemes,
    )
      ? parsed.missedThemes.filter((theme: string) =>
          VALID_THEMES.includes(theme as ThemeCategory),
        )
      : [];

    const score =
      typeof parsed.score === "number"
        ? Math.max(0, Math.min(10, parsed.score))
        : sanitizedMatchedCriteriaIds.length;

    return NextResponse.json({
      score,
      matchedCriteriaIds: sanitizedMatchedCriteriaIds,
      missingRequiredCriteriaIds: enforced.missingRequiredCriteriaIds,
      feedback:
        typeof parsed.feedback === "string" && parsed.feedback.trim()
          ? parsed.feedback.trim()
          : `Your response addressed some relevant aspects of the situation, but several important operational actions still need clearer explanation.

- Some required actions were not described clearly enough
- Practical implementation detail was limited in places
- The response would be stronger with clearer sequencing, coordination, and risk-control actions

To strengthen your response, explain who would do what, in what order, and how that would reduce operational risk.`,
      decision: enforced.decision,
      scenarioSeverity: severityFromDecision(enforced.decision),
      nextScenarioText:
        typeof parsed.nextScenarioText === "string" &&
        parsed.nextScenarioText.trim()
          ? parsed.nextScenarioText.trim()
          : enforced.decision === "strong"
            ? "The response remains under pressure, but stronger operational control is still being maintained as the incident develops."
            : enforced.decision === "mixed"
              ? "The response is still moving forward, but operational strain and consequence risk are increasing because some important actions were not fully addressed."
              : "The situation is worsening because several important actions were not clearly addressed, reducing flexibility and increasing consequence pressure in the next phase.",
      nextStageId: nextStage.nextStageId,
      branchReason: nextStage.branchReason,
      strengths:
        Array.isArray(parsed.strengths) && parsed.strengths.length > 0
          ? parsed.strengths.slice(0, 4)
          : buildFallbackStrengths(stage, sanitizedMatchedCriteriaIds),
      missedThemes: sanitizedMissedThemes,
      missedCriteriaTexts:
        Array.isArray(parsed.missedCriteriaTexts) &&
        parsed.missedCriteriaTexts.length > 0
          ? parsed.missedCriteriaTexts.slice(0, 6)
          : buildFallbackMissedCriteriaTexts(
              stage,
              enforced.missingRequiredCriteriaIds,
            ),
    });
  } catch (error: any) {
    console.error("Stage evaluation route error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Unknown evaluation error",
      },
      { status: 500 },
    );
  }
}
