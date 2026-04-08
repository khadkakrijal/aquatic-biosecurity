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
  return text.toLowerCase().replace(/[^\w\s-]/g, " ");
}

function keywordHitCount(answer: string, keywords: string[]) {
  const safeAnswer = normaliseText(answer);

  return keywords.reduce((count, keyword) => {
    const safeKeyword = normaliseText(keyword).trim();
    if (!safeKeyword) return count;
    return safeAnswer.includes(safeKeyword) ? count + 1 : count;
  }, 0);
}

function isCriterionMatched(answer: string, criterion: Criterion) {
  const keywords = criterion.keywords || [];
  if (!keywords.length) return false;

  const hits = keywordHitCount(answer, keywords);
  const threshold = Math.min(2, Math.max(1, Math.ceil(keywords.length / 4)));

  return hits >= threshold;
}

function getDecision(
  score: number,
  requiredMet: boolean,
  missingRequiredCount: number,
  minScore: number,
): EvaluationDecision {
  if (requiredMet && score >= minScore + 1) return "strong";
  if (missingRequiredCount <= 1 && score >= Math.max(1, minScore - 1)) return "mixed";
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
    const priorityList =
      routing.byMissingRequiredPriority?.length
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
  if (!nextStageId) {
    return "The simulation has reached its end state and is now ready for final reflection and summary.";
  }

  if (missingRequiredCriteriaIds.length > 0) {
    const missed = stage.criteria.filter((criterion) =>
      missingRequiredCriteriaIds.includes(criterion.id),
    );

    const leadMiss = missed[0];

    if (leadMiss) {
      return `The response is moving into a more pressured consequence pathway because the answer did not cover the required criterion: "${leadMiss.text}".`;
    }
  }

  if (matchedCriteriaIds.length > 0) {
    return "The response covered the main required actions well enough to continue along the more controlled forward pathway.";
  }

  return "The response is progressing forward through the simulation, but with elevated consequence pressure due to limited coverage of the expected operational actions.";
}

function buildStrengths(stage: ScenarioStage, matchedCriteriaIds: string[]) {
  return stage.criteria
    .filter((criterion) => matchedCriteriaIds.includes(criterion.id))
    .map((criterion) => criterion.text)
    .slice(0, 4);
}

function buildMissedThemes(stage: ScenarioStage, missingRequiredCriteriaIds: string[]) {
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
    return "Because some critical actions were missed or only partially addressed, the situation now progresses into a more pressured consequence pathway. The next phase reflects the operational impact of those gaps.";
  }

  if (decision === "strong" || decision === "mixed") {
    return "The response now moves forward into the next phase on a more controlled pathway. The next stage still becomes more complex, but the early actions taken have reduced some consequence pressure.";
  }

  return "The simulation continues forward, but the next stage reflects a more escalated operational picture because important actions were not covered strongly enough.";
}

function buildFeedback(
  stage: ScenarioStage,
  matchedCriteriaIds: string[],
  missingRequiredCriteriaIds: string[],
  decision: EvaluationDecision,
) {
  const matched = stage.criteria.filter((criterion) =>
    matchedCriteriaIds.includes(criterion.id),
  );
  const missed = stage.criteria.filter((criterion) =>
    missingRequiredCriteriaIds.includes(criterion.id),
  );

  const strengthsText = matched.length
    ? `Covered well: ${matched.map((item) => item.text).join("; ")}.`
    : "Covered well: none of the major hidden criteria were clearly identified.";

  const gapsText = missed.length
    ? `Important gaps: ${missed.map((item) => item.text).join("; ")}.`
    : "Important gaps: no required criteria were missed.";

  const decisionText =
    decision === "strong"
      ? "Overall, this response was strong enough to keep the scenario on a more controlled forward path."
      : decision === "mixed"
      ? "Overall, this response covered some key actions but still left important gaps, so the scenario may continue with elevated pressure."
      : "Overall, this response missed too many key actions, so the scenario will continue into a more pressured consequence pathway.";

  return `${strengthsText}\n\n${gapsText}\n\n${decisionText}`;
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
        score: 0,
        matchedCriteriaIds: [],
        missingRequiredCriteriaIds: [],
        feedback:
          "Your final reflection has been saved. You can now move to the final simulation summary.",
        decision: "strong",
        scenarioSeverity: "manageable",
        nextScenarioText: undefined,
        nextStageId: "",
        branchReason:
          "The simulation has reached its final reflection stage and is ready for summary generation.",
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

    const weightedMatches = stage.criteria.reduce((total, criterion) => {
      return total + (isCriterionMatched(userAnswer, criterion) ? criterion.weight || 1 : 0);
    }, 0);

    const matchedCriteriaIds = stage.criteria
      .filter((criterion) => isCriterionMatched(userAnswer, criterion))
      .map((criterion) => criterion.id);

    const missingRequiredCriteriaIds = stage.criteria
      .filter(
        (criterion) =>
          criterion.required && !matchedCriteriaIds.includes(criterion.id),
      )
      .map((criterion) => criterion.id);

    const requiredMet = missingRequiredCriteriaIds.length === 0;

    const decision = getDecision(
      weightedMatches,
      requiredMet,
      missingRequiredCriteriaIds.length,
      stage.passingRules.minScore,
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
    );

    const result: StageEvaluationResult = {
      score: weightedMatches,
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