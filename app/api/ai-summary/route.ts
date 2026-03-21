import { openai } from "@/app/lib/ai-summary";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing. Add it to .env.local." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const prompt = `
You are helping summarize an aquatic biosecurity preparedness exercise.

Return a concise professional summary in plain text with:
1. Overall preparedness comment
2. Top strengths
3. Top gaps
4. One practical recommendation

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
      { status: 500 }
    );
  }
}