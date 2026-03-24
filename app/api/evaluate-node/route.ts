import { openai } from "@/app/lib/ai-summary";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { node, userAnswer } = body;

    if (!node || !userAnswer) {
      return NextResponse.json(
        { error: "Missing node or userAnswer." },
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
        missingRequiredCriteriaIds: node.passingRules?.requiredCriteriaIds || [],
        feedback:
          "Your response does not yet demonstrate the minimum operational actions expected at this stage. Please revise your answer by outlining the immediate practical steps you would take, including notification, coordination, surveillance, containment, and stakeholder communication where relevant.",
        decision: "fail",
        nextNodeId: node.nextOnFail,
      });
    }

    const prompt = `
You are evaluating a user's response in an aquatic biosecurity simulation.

Node title: ${node.title}
Phase number: ${node.phaseNumber}
Scenario text:
${node.scenarioText}

Criteria:
${JSON.stringify(node.criteria, null, 2)}

Passing rules:
${JSON.stringify(node.passingRules, null, 2)}

User response:
${userAnswer}

Return STRICT JSON ONLY in this format:
{
  "score": number,
  "matchedCriteriaIds": string[],
  "missingRequiredCriteriaIds": string[],
  "feedback": "string",
  "decision": "pass" | "partial" | "fail"
}

Evaluation rules:
- Evaluate whether the response addresses the criteria in substance, not only exact wording
- Pay close attention to required criteria
- Use the keywords and meaning, not just exact string matching
- Do not give credit for actions the user did not actually mention
- If the response is vague, uncertain, extremely short, or shows lack of knowledge, mark it as "fail"
- Feedback must be professional, supportive, and clear
- Feedback should explain what key operational elements are missing
- "pass" when the response sufficiently covers the required actions
- "partial" when some important ideas are present but notable gaps remain
- "fail" when critical actions are missing or the response shows insufficient operational understanding
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
        {
          error: "AI returned invalid JSON.",
          rawOutput: text,
        },
        { status: 500 }
      );
    }

    let nextNodeId = node.nextOnFail;

    if (
      parsed.decision === "pass" &&
      Array.isArray(parsed.missingRequiredCriteriaIds) &&
      parsed.missingRequiredCriteriaIds.length === 0 &&
      typeof parsed.score === "number" &&
      parsed.score >= node.passingRules.minScore
    ) {
      nextNodeId = node.nextOnPass;
    } else if (parsed.decision === "partial") {
      nextNodeId = node.nextOnPartial;
    }

    return NextResponse.json({
      score: typeof parsed.score === "number" ? parsed.score : 0,
      matchedCriteriaIds: Array.isArray(parsed.matchedCriteriaIds)
        ? parsed.matchedCriteriaIds
        : [],
      missingRequiredCriteriaIds: Array.isArray(
        parsed.missingRequiredCriteriaIds
      )
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
      nextNodeId,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Evaluation error" },
      { status: 500 }
    );
  }
}