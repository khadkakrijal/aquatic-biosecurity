// import { invasiveMusselScenario } from "../data/invasive-mussel-scenario";
// import { DecisionImpact, Phase, PhaseResponse, SimulationSession, SummaryResult, ThemeCategory } from "../types/simulation";


// const impactScoreMap: Record<DecisionImpact, number> = {
//   strong: 100,
//   moderate: 65,
//   weak: 30,
// };

// export function createEmptySession(): SimulationSession {
//   const now = new Date().toISOString();
//   return {
//     scenarioId: invasiveMusselScenario.id,
//     currentPhase: 1,
//     responses: {},
//     startedAt: now,
//     updatedAt: now,
//   };
// }

// export function getPhaseByNumber(phaseNumber: number): Phase | undefined {
//   return invasiveMusselScenario.phases.find((p) => p.phaseNumber === phaseNumber);
// }

// export function buildPhaseResponse(params: {
//   phase: Phase;
//   selectedCriteriaIds: string[];
//   answers: Record<string, string>;
//   selectedDecisionId: string;
// }): PhaseResponse {
//   const { phase, selectedCriteriaIds, answers, selectedDecisionId } = params;

//   const decision = phase.decisionOptions.find((d) => d.id === selectedDecisionId);
//   const impact = decision?.impact ?? "weak";

//   const missedCriteria = phase.criteria.filter(
//     (c) => !selectedCriteriaIds.includes(c.id)
//   );

//   const missedConsequences = missedCriteria.map((c) => c.consequence);
//   const consequenceFlags = decision ? [decision.consequenceFlag] : [];
//   const criteriaScore =
//     phase.criteria.length === 0
//       ? 0
//       : Math.round((selectedCriteriaIds.length / phase.criteria.length) * 100);

//   const writtenAnswerBonus =
//     Object.values(answers).filter((v) => v.trim().length > 20).length * 5;

//   const score = Math.min(
//     Math.round(criteriaScore * 0.7 + impactScoreMap[impact] * 0.3 + writtenAnswerBonus),
//     100
//   );

//   return {
//     phaseNumber: phase.phaseNumber,
//     selectedCriteriaIds,
//     answers,
//     selectedDecisionId,
//     missedConsequences,
//     impact,
//     consequenceFlags,
//     score,
//   };
// }

// export function updateSession(
//   session: SimulationSession,
//   response: PhaseResponse
// ): SimulationSession {
//   return {
//     ...session,
//     currentPhase: Math.min(response.phaseNumber + 1, 6),
//     updatedAt: new Date().toISOString(),
//     responses: {
//       ...session.responses,
//       [response.phaseNumber]: response,
//     },
//   };
// }

// export function buildSummary(session: SimulationSession): SummaryResult {
//   const allResponses = Object.values(session.responses);
//   const totalScore = allResponses.length
//     ? Math.round(
//         allResponses.reduce((sum, r) => sum + r.score, 0) / allResponses.length
//       )
//     : 0;

//   const readinessLabel =
//     totalScore >= 85
//       ? "High preparedness"
//       : totalScore >= 65
//       ? "Moderate preparedness"
//       : "Preparedness gaps need attention";

//   const allMissedConsequences = allResponses.flatMap((r) => r.missedConsequences);
//   const allFlags = allResponses.flatMap((r) => r.consequenceFlags);

//   const coveredThemesSet = new Set<ThemeCategory>();
//   invasiveMusselScenario.phases.forEach((phase) => {
//     const response = session.responses[phase.phaseNumber];
//     if (!response) return;
//     phase.criteria.forEach((criterion) => {
//       if (response.selectedCriteriaIds.includes(criterion.id)) {
//         coveredThemesSet.add(criterion.theme);
//       }
//     });
//   });

//   const coveredThemes = Array.from(coveredThemesSet);

//   const strengths: string[] = [];
//   const gaps: string[] = [];

//   if (coveredThemes.includes("Protocols")) {
//     strengths.push("You identified important protocol and incident-management actions.");
//   }
//   if (coveredThemes.includes("Stakeholders")) {
//     strengths.push("You considered coordination across agencies and stakeholders.");
//   }
//   if (coveredThemes.includes("Communication")) {
//     strengths.push("You addressed community or industry communication responsibilities.");
//   }
//   if (coveredThemes.includes("Data")) {
//     strengths.push("You considered surveillance, tracing, or evidence requirements.");
//   }

//   if (!coveredThemes.includes("Constraints")) {
//     gaps.push("Operational constraints and resourcing were not strongly addressed.");
//   }
//   if (!coveredThemes.includes("Expectations")) {
//     gaps.push("Long-term transition, review, or future expectations were not strongly addressed.");
//   }

//   if (allFlags.includes("containment-delayed")) {
//     gaps.push("Early containment delay increased downstream spread risk.");
//   }
//   if (allFlags.includes("spread-escalates")) {
//     gaps.push("Escalation controls were insufficient during confirmation and spread phases.");
//   }
//   if (allFlags.includes("premature-lifting-risk")) {
//     gaps.push("Restriction-lifting decisions may have created reinfestation risk.");
//   }

//   if (strengths.length === 0) {
//     strengths.push("You completed the simulation and generated a usable response pathway.");
//   }

//   if (gaps.length === 0 && allMissedConsequences.length === 0) {
//     gaps.push("No major gap was detected in this prototype summary.");
//   }

//   return {
//     totalScore,
//     readinessLabel,
//     strengths,
//     gaps,
//     consequenceFlags: allFlags,
//     missedConsequences: allMissedConsequences,
//     coveredThemes,
//   };
// }