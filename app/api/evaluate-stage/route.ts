import { NextRequest, NextResponse } from "next/server";
import {
  Criterion,
  EvaluationDecision,
  ScenarioSeverity,
  ScenarioStage,
  StageEvaluationResult,
  ThemeCategory,
} from "@/app/types/simulation";

type EvaluateStageRequest = {
  stage: ScenarioStage;
  userAnswer: string;
  previousOutcome?: string;
};

function normaliseText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stemWord(word: string) {
  const w = normaliseText(word);

  if (w.length <= 4) return w;

  const suffixes = ["ing", "ed", "es", "s"];
  for (const suffix of suffixes) {
    if (w.endsWith(suffix) && w.length > suffix.length + 2) {
      return w.slice(0, -suffix.length);
    }
  }

  return w;
}

function tokenize(text: string) {
  return normaliseText(text)
    .split(" ")
    .map((word) => stemWord(word))
    .filter(Boolean);
}

const SYNONYM_MAP: Record<string, string[]> = {
  notify: ["inform", "alert", "advise", "report", "escalate", "communicate"],
  reporting: ["notification", "escalation", "advice", "reporting"],
  report: ["notify", "inform", "alert", "escalate"],
  escalate: ["raise", "refer", "report", "notify"],
  authority: ["agency", "department", "government", "regulator"],
  containment: ["control", "restriction", "quarantine", "isolation"],
  restrict: ["limit", "stop", "prevent", "block"],
  movement: ["transport", "transfer", "relocation"],
  surveillance: [
    "monitoring",
    "inspection",
    "sampling",
    "observation",
    "survey",
  ],
  inspection: ["check", "site visit", "assessment", "monitoring"],
  tracing: ["trace", "track", "mapping", "pathway analysis"],
  communication: ["messaging", "briefing", "advice", "guidance", "updates"],
  stakeholders: ["industry", "growers", "operators", "partners", "community"],
  guidance: ["advice", "instructions", "direction", "information"],
  compliance: ["adherence", "following rules", "meeting requirements"],
  biosecurity: ["disease control", "farm hygiene", "security controls"],
  discharge: ["effluent", "water release", "water outflow"],
  workforce: ["staff", "personnel", "team", "resourcing"],
  recovery: ["transition", "restoration", "stand down", "close out"],
  operator: ["producer", "grower", "manager"],
  producer: ["grower", "operator", "farm owner"],
  grower: ["producer", "operator"],
};

function expandToken(token: string) {
  const stemmed = stemWord(token);
  const synonyms = SYNONYM_MAP[stemmed] || [];
  return [stemmed, ...synonyms.map((item) => stemWord(item))];
}

function keywordPhraseMatch(answer: string, keyword: string) {
  const safeAnswer = normaliseText(answer);
  const safeKeyword = normaliseText(keyword);

  if (!safeKeyword) return false;

  if (safeAnswer.includes(safeKeyword)) {
    return true;
  }

  const keywordTokens = tokenize(safeKeyword);
  const answerTokens = tokenize(safeAnswer);

  if (!keywordTokens.length || !answerTokens.length) {
    return false;
  }

  const answerTokenSet = new Set(answerTokens);

  let matchedCount = 0;

  for (const token of keywordTokens) {
    const expanded = expandToken(token);
    const hasMatch = expanded.some((candidate) =>
      answerTokenSet.has(candidate),
    );

    if (hasMatch) {
      matchedCount += 1;
    }
  }

  const requiredTokenMatches =
    keywordTokens.length <= 2
      ? keywordTokens.length
      : Math.max(2, Math.ceil(keywordTokens.length * 0.6));

  return matchedCount >= requiredTokenMatches;
}

function criterionSemanticScore(answer: string, criterion: Criterion) {
  const answerTokens = new Set(tokenize(answer));
  const criterionTokens = tokenize(criterion.text);

  if (!criterionTokens.length || !answerTokens.size) return 0;

  let overlap = 0;

  for (const token of criterionTokens) {
    const expanded = expandToken(token);
    if (expanded.some((candidate) => answerTokens.has(candidate))) {
      overlap += 1;
    }
  }

  return overlap / criterionTokens.length;
}

function keywordHitCount(answer: string, keywords: string[]) {
  return keywords.reduce((count, keyword) => {
    return keywordPhraseMatch(answer, keyword) ? count + 1 : count;
  }, 0);
}

function getCriterionCoverageLevel(answer: string, criterion: Criterion) {
  const keywords = criterion.keywords || [];
  const hits = keywordHitCount(answer, keywords);
  const semanticScore = criterionSemanticScore(answer, criterion);

  if (hits >= 2 || semanticScore >= 0.6) return "strong";
  if (hits >= 1 || semanticScore >= 0.35) return "partial";
  return "missing";
}

function isCriterionMatched(answer: string, criterion: Criterion) {
  const coverage = getCriterionCoverageLevel(answer, criterion);
  return coverage === "strong" || coverage === "partial";
}

function getDecision(
  stage: ScenarioStage,
  matchedCriteriaIds: string[],
  missingRequiredCriteriaIds: string[],
): EvaluationDecision {
  const totalCriteria = stage.criteria.length || 1;
  const matchedCount = matchedCriteriaIds.length;
  const missingRequiredCount = missingRequiredCriteriaIds.length;
  const requiredCriteriaCount = stage.criteria.filter(
    (criterion) => criterion.required,
  ).length;
  const requiredMatchedCount = requiredCriteriaCount - missingRequiredCount;
  const coverageRatio = matchedCount / totalCriteria;

  if (
    missingRequiredCount === 0 &&
    (coverageRatio >= 0.67 || requiredMatchedCount === requiredCriteriaCount)
  ) {
    return "strong";
  }

  if (
    missingRequiredCount <= 1 &&
    (coverageRatio >= 0.34 ||
      requiredMatchedCount >= Math.max(1, requiredCriteriaCount - 1))
  ) {
    return "mixed";
  }

  return "limited";
}

function getScenarioSeverity(
  phaseNumber: number,
  decision: EvaluationDecision,
): ScenarioSeverity {
  if (phaseNumber <= 2 && decision === "strong") return "manageable";
  if (phaseNumber >= 5 && decision === "limited") return "severe";
  if (phaseNumber >= 4 && decision !== "strong") return "elevated";
  if (decision === "limited") return "elevated";
  return "manageable";
}

function resolveNextStageId(
  stage: ScenarioStage,
  decision: EvaluationDecision,
  missingRequiredCriteriaIds: string[],
) {
  const routing = stage.nextStageMap;

  if (!routing) return "complete";

  if (missingRequiredCriteriaIds.length && routing.byMissingRequired) {
    const priorityList = routing.byMissingRequiredPriority?.length
      ? routing.byMissingRequiredPriority
      : missingRequiredCriteriaIds;

    for (const criterionId of priorityList) {
      if (
        missingRequiredCriteriaIds.includes(criterionId) &&
        routing.byMissingRequired[criterionId]
      ) {
        return routing.byMissingRequired[criterionId];
      }
    }
  }

  if (decision === "strong" && routing.strong) return routing.strong;
  if (decision === "mixed" && routing.mixed) return routing.mixed;
  if (decision === "limited" && routing.limited) return routing.limited;

  return routing.fallback ?? "complete";
}

function getBranchReason(
  stage: ScenarioStage,
  matchedCriteriaIds: string[],
  missingRequiredCriteriaIds: string[],
  nextStageId: string,
) {
  if (!nextStageId || nextStageId === "complete") {
    return "The simulation has reached its final point for this stage and is ready to move into reflection and summary.";
  }

  if (missingRequiredCriteriaIds.length > 0) {
    const missed = stage.criteria.filter((criterion) =>
      missingRequiredCriteriaIds.includes(criterion.id),
    );

    const leadMiss = missed[0];

    if (leadMiss) {
      return `The response is now moving into a more pressured pathway because one of the key expected actions was not addressed clearly enough: ${leadMiss.text}.`;
    }
  }

  if (matchedCriteriaIds.length > 0) {
    return "The response covered enough of the key actions to continue on a more controlled pathway into the next phase.";
  }

  return "The response is progressing forward, but with higher pressure because the expected operational actions were not covered clearly enough.";
}

function buildStrengths(stage: ScenarioStage, matchedCriteriaIds: string[]) {
  return stage.criteria
    .filter((criterion) => matchedCriteriaIds.includes(criterion.id))
    .map((criterion) => criterion.text)
    .slice(0, 4);
}

function buildMissedThemes(
  stage: ScenarioStage,
  missingRequiredCriteriaIds: string[],
) {
  const themeSet = new Set<ThemeCategory>();

  stage.criteria.forEach((criterion) => {
    if (missingRequiredCriteriaIds.includes(criterion.id)) {
      themeSet.add(criterion.theme);
    }
  });

  return Array.from(themeSet);
}

function buildMissedCriteriaTexts(
  stage: ScenarioStage,
  missingRequiredCriteriaIds: string[],
) {
  return stage.criteria
    .filter((criterion) => missingRequiredCriteriaIds.includes(criterion.id))
    .map((criterion) => criterion.text);
}

function buildNextScenarioText(
  stage: ScenarioStage,
  decision: EvaluationDecision,
  missingRequiredCriteriaIds: string[],
) {
  if (!stage.nextStageMap) return undefined;

  if (missingRequiredCriteriaIds.length > 0) {
    return "Because some of the critical actions were missed or only covered partially, the next phase reflects a more pressured operational picture and the consequences of those gaps.";
  }

  if (decision === "strong") {
    return "The response now moves into the next phase on a relatively controlled pathway. The situation still becomes more complex, but the actions taken so far have reduced some of the pressure.";
  }

  if (decision === "mixed") {
    return "The scenario continues forward on a workable path, but the next phase still carries extra pressure because some important elements were only partially addressed.";
  }

  return "The next phase reflects a more difficult operational picture because too many important actions were not covered clearly enough.";
}

function isNonSubstantiveAnswer(answer: string) {
  const cleaned = normaliseText(answer);

  const nonSubstantivePhrases = [
    "no idea",
    "i dont know",
    "i don't know",
    "dont know",
    "don't know",
    "not sure",
    "unsure",
    "no clue",
    "nothing",
    "n/a",
    "na",
    "nil",
    "none",
  ];

  if (nonSubstantivePhrases.includes(cleaned)) {
    return true;
  }

  const tokens = tokenize(cleaned);

  return tokens.length <= 2;
}

function buildFeedback(
  stage: ScenarioStage,
  matchedCriteriaIds: string[],
  missingRequiredCriteriaIds: string[],
  decision: EvaluationDecision,
  userAnswer: string,
) {
  if (isNonSubstantiveAnswer(userAnswer)) {
    return "It looks like no clear response was provided for this stage. In a real response setting, this would usually create uncertainty because the team would not yet have enough information to understand the intended actions. The scenario will continue into a more pressured pathway so you can still explore what may happen when early priorities are not clearly identified.";
  }

  const matched = stage.criteria.filter((criterion) =>
    matchedCriteriaIds.includes(criterion.id),
  );

  const missed = stage.criteria.filter((criterion) =>
    missingRequiredCriteriaIds.includes(criterion.id),
  );

  const formatList = (items: string[]) => {
    if (!items.length) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;

    return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
  };

  if (decision === "strong") {
    const matchedText = matched.length
      ? formatList(matched.map((item) => item.text))
      : "the main operational priorities";

    return `This response demonstrates a clear understanding of the priorities at this stage. It gives strong attention to ${matchedText}, which supports a more coordinated and controlled response pathway.`;
  }

  if (decision === "mixed") {
    const matchedText = matched.length
      ? formatList(matched.map((item) => item.text))
      : "some relevant operational priorities";

    const missedText = missed.length
      ? formatList(missed.map((item) => item.text))
      : "some areas that would benefit from more detail";

    return `This response identifies some useful actions, particularly around ${matchedText}. To strengthen the response further, it would be helpful to give more attention to ${missedText}. The scenario therefore continues with some additional operational pressure, reflecting the areas that still need clarification.`;
  }

  const missedText = missed.length
    ? formatList(missed.map((item) => item.text))
    : "several important operational priorities";

  return `This response provides a starting point, but it would benefit from stronger coverage of several priority actions for this stage. In particular, further consideration would be useful around ${missedText}. The scenario therefore moves into a more pressured pathway, reflecting the increased operational uncertainty and workload that can occur when these areas are not yet fully addressed.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EvaluateStageRequest;

    const stage = body.stage;
    const userAnswer = body.userAnswer?.trim() || "";

    if (!stage) {
      return NextResponse.json(
        { error: "Stage is required." },
        { status: 400 },
      );
    }

    if (stage.id === "complete") {
      const result: StageEvaluationResult = {
        matchedCriteriaIds: [],
        missingRequiredCriteriaIds: [],
        feedback:
          "Your final reflection has been saved. The simulation can now move into the closing summary.",
        decision: "strong",
        scenarioSeverity: "manageable",
        nextScenarioText: undefined,
        nextStageId: "",
        branchReason:
          "The simulation has reached its final reflection point and is now ready for summary generation.",
        strengths: [],
        missedThemes: [],
        missedCriteriaTexts: [],
      };

      return NextResponse.json(result);
    }

    if (!userAnswer) {
      return NextResponse.json(
        { error: "User answer is required." },
        { status: 400 },
      );
    }

    const criterionCoverage = stage.criteria.map((criterion) => ({
      criterion,
      matched: isCriterionMatched(userAnswer, criterion),
      level: getCriterionCoverageLevel(userAnswer, criterion),
    }));

    const matchedCriteriaIds = criterionCoverage
      .filter((item) => item.matched)
      .map((item) => item.criterion.id);

    const missingRequiredCriteriaIds = criterionCoverage
      .filter(
        (item) =>
          item.criterion.required &&
          !matchedCriteriaIds.includes(item.criterion.id),
      )
      .map((item) => item.criterion.id);

    const decision = getDecision(
      stage,
      matchedCriteriaIds,
      missingRequiredCriteriaIds,
    );

    const scenarioSeverity = getScenarioSeverity(stage.phaseNumber, decision);
    const nextStageId = resolveNextStageId(
      stage,
      decision,
      missingRequiredCriteriaIds,
    );
    const strengths = buildStrengths(stage, matchedCriteriaIds);
    const missedThemes = buildMissedThemes(stage, missingRequiredCriteriaIds);
    const missedCriteriaTexts = buildMissedCriteriaTexts(
      stage,
      missingRequiredCriteriaIds,
    );
    const nextScenarioText = buildNextScenarioText(
      stage,
      decision,
      missingRequiredCriteriaIds,
    );
    const branchReason = getBranchReason(
      stage,
      matchedCriteriaIds,
      missingRequiredCriteriaIds,
      nextStageId,
    );
    const feedback = buildFeedback(
      stage,
      matchedCriteriaIds,
      missingRequiredCriteriaIds,
      decision,
      userAnswer,
    );

    const result: StageEvaluationResult = {
      matchedCriteriaIds,
      missingRequiredCriteriaIds,
      feedback,
      decision,
      scenarioSeverity,
      nextScenarioText,
      nextStageId,
      branchReason,
      strengths,
      missedThemes,
      missedCriteriaTexts,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("evaluate-stage error", error);

    return NextResponse.json(
      { error: "Failed to evaluate stage response." },
      { status: 500 },
    );
  }
}
