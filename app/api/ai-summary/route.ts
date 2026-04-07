import { openai } from "@/app/lib/ai-summary";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing. Add it to .env.local." },
        { status: 500 },
      );
    }

    const body = await request.json();

    const prompt = `
You are helping summarize an aquatic biosecurity preparedness exercise.

Return a concise professional summary in plain text with these sections:
1. Overall preparedness comment
2. Main strengths demonstrated
3. Main capability gaps or missed priorities
4. How the scenario escalated over time
5. One practical recommendation

Important instructions:
- Do NOT use pass/fail language
- Do NOT describe the exercise like an exam or test
- Do NOT use labels like strong, mixed, limited as headings
- Write as if summarizing operational performance in a scenario-based preparedness exercise
- Focus on practical response capability, coordination, decision-making, and risk consequences
- If the user repeatedly gave weak or minimal answers, explain what was repeatedly lacking in operational terms
- If the simulation followed a more pressured branch path, describe the operational consequences clearly

Scenario title:
${body.scenarioTitle}

Summary object:
${JSON.stringify(body.summary, null, 2)}

Responses:
${JSON.stringify(body.responses, null, 2)}
`;

    const response = await openai.responses.create({
      model: "gpt-5.1",
      input: prompt,
    });

    return NextResponse.json({
      feedback: response.output_text,
    });
  } catch (error: any) {
    console.error("AI summary route error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Unknown AI summary error",
      },
      { status: 500 },
    );
  }
}