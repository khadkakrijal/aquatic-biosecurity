import { openai } from "@/app/lib/ai-summary";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stage, userAnswer, previousOutcome } = body;

    if (!stage || !userAnswer) {
      return NextResponse.json(
        { error: "Missing stage or userAnswer." },
        { status: 400 }
      );
    }

    const normalizedAnswer = String(userAnswer).trim().toLowerCase();

    const uncertainPatterns = [
      "i don't know",
      "i dont know",
      "dont know",
      "don't know",
      "not sure",
      "no idea",
      "idk",
      "unsure",
      "not certain",
    ];

    const isTooShort = normalizedAnswer.length < 20;
    const isUncertain = uncertainPatterns.some((pattern) =>
      normalizedAnswer.includes(pattern)
    );

    if (isTooShort || isUncertain) {
      return NextResponse.json({
        score: 0,
        matchedCriteriaIds: [],
        missingRequiredCriteriaIds: stage.passingRules?.requiredCriteriaIds || [],
        feedback: `Your response does not yet demonstrate the minimum operational actions expected at this stage.

- The answer is too brief to show clear operational decision-making
- Key response actions were not explained in enough detail
- Important coordination, surveillance, containment, or communication measures were missing

To improve your response, provide clearer and more complete operational actions that explain how the incident would be managed at this stage.`,
        decision: "fail",
        scenarioSeverity: "severe",
        nextScenarioText:
          "Because critical actions were unclear or incomplete, the situation is now more serious. Spread risk is increasing, stakeholder concern is growing, and the next stage will involve greater operational pressure and reduced flexibility in the response.",
      });
    }

    const prompt = `
You are evaluating a user's response in an aquatic biosecurity simulation.

Stage title: ${stage.title}
Phase number: ${stage.phaseNumber}
Base scenario text:
${stage.baseScenarioText}

Criteria:
${JSON.stringify(stage.criteria, null, 2)}

Passing rules:
${JSON.stringify(stage.passingRules, null, 2)}

Previous outcome context:
${previousOutcome || "none"}

User response:
${userAnswer}

Return STRICT JSON ONLY in this format:
{
  "score": number,
  "matchedCriteriaIds": string[],
  "missingRequiredCriteriaIds": string[],
  "feedback": "string",
  "decision": "pass" | "partial" | "fail",
  "scenarioSeverity": "stable" | "elevated" | "severe",
  "nextScenarioText": "string"
}

Rules:
- Evaluate whether the response addresses the criteria in substance, not only exact wording.
- Pay close attention to required criteria and key terms.
- Do not give credit for actions the user did not mention.
- Score based on how well the response covers the required and supporting operational actions.
- "pass" when the response sufficiently covers the required actions and demonstrates practical operational understanding.
- "partial" when some important actions are present but notable gaps remain.
- "fail" when critical actions are missing or the response is too weak to support an effective response.
- "stable" means the next stage proceeds under more controlled conditions.
- "elevated" means the next stage should reflect increased concern, uncertainty, or operational pressure.
- "severe" means the next stage should reflect worsening spread risk, stronger stakeholder pressure, or escalating operational consequences.
- matchedCriteriaIds must only include criteria genuinely addressed by the user.
- missingRequiredCriteriaIds must include required criteria that were not clearly addressed.

Feedback instructions:
- The feedback must be written in a professional and clear tone.
- Do NOT reference internal criterion IDs such as p1c1, p2c2, etc.
- Describe strengths and gaps using natural language only.
- Start with a short paragraph explaining what the user did well.
- Then list missing or weak areas using bullet points.
- Use plain text bullet points beginning with "- ".
- End with a short improvement summary explaining what would strengthen the response.
- The feedback should feel like professional operational guidance, not technical evaluation.

Scenario progression instructions:
- The nextScenarioText must dynamically evolve the incident based on the user's response quality.
- If the decision is "fail", escalate the situation clearly with greater spread risk, stakeholder concern, and operational pressure.
- If the decision is "partial", keep the situation active but introduce complications, uncertainty, or increased pressure.
- If the decision is "pass", allow a more controlled progression, but still introduce realistic operational challenges.
- Do not simply repeat the base scenario text.
- nextScenarioText must be professional, realistic, and suitable as the next stage situation update.
`;

    const response = await openai.responses.create({
      model: "gpt-5.1",
      input: prompt,
    });

    const text = response.output_text.trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON.", rawOutput: text },
        { status: 500 }
      );
    }

    return NextResponse.json({
      score: typeof parsed.score === "number" ? parsed.score : 0,
      matchedCriteriaIds: Array.isArray(parsed.matchedCriteriaIds)
        ? parsed.matchedCriteriaIds
        : [],
      missingRequiredCriteriaIds: Array.isArray(parsed.missingRequiredCriteriaIds)
        ? parsed.missingRequiredCriteriaIds
        : [],
      feedback:
        parsed.feedback ||
        "Your response was evaluated, but no detailed feedback was returned.",
      decision:
        parsed.decision === "pass" ||
        parsed.decision === "partial" ||
        parsed.decision === "fail"
          ? parsed.decision
          : "fail",
      scenarioSeverity:
        parsed.scenarioSeverity === "stable" ||
        parsed.scenarioSeverity === "elevated" ||
        parsed.scenarioSeverity === "severe"
          ? parsed.scenarioSeverity
          : "severe",
      nextScenarioText:
        parsed.nextScenarioText ||
        "The next stage now reflects the consequences and conditions created by your response.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Stage evaluation error" },
      { status: 500 }
    );
  }
}