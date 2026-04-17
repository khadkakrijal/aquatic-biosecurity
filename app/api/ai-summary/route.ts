import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const scenarioTitle = body?.scenarioTitle || "Simulation";
    const summary = body?.summary || {};
    const responses = body?.responses || [];

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY in environment variables." },
        { status: 500 },
      );
    }

    const prompt = `
You are helping summarise a biosecurity simulation exercise for a user.

Scenario title:
${scenarioTitle}

Exercise summary:
${JSON.stringify(summary, null, 2)}

Responses:
${JSON.stringify(responses, null, 2)}

Write a clear, concise final summary in plain English.
Keep it easy to understand.
Use short paragraphs only.
Include:
1. Overall performance
2. Main strengths
3. Main repeated gaps
4. What should improve next time
5. Final takeaway

Return JSON in this exact format:
{
  "feedback": "..."
}
`;

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5.1",
        input: prompt,
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      console.error("OpenAI error:", data);
      return NextResponse.json(
        { error: data?.error?.message || "Failed to generate AI summary." },
        { status: 500 },
      );
    }

    const text =
      data?.output?.[0]?.content?.[0]?.text ||
      data?.output_text ||
      "";

    if (!text) {
      return NextResponse.json(
        { error: "AI summary returned no text." },
        { status: 500 },
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { feedback: text };
    }

    return NextResponse.json({
      feedback: parsed.feedback || text,
    });
  } catch (error) {
    console.error("ai-summary error", error);

    return NextResponse.json(
      { error: "Failed to generate final summary." },
      { status: 500 },
    );
  }
}