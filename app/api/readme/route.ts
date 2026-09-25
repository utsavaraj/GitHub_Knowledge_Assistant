import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { owner, repo } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Repository owner and name are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.raw+json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "README not found" },
        { status: response.status }
      );
    }

    const readme = await response.text();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
Explain this GitHub README in simple beginner-friendly language.

README:

${readme}

Give the answer in these sections:

1. What this project does
2. Main features
3. Technologies used
4. How to use it
5. Beginner explanation

Keep it simple and concise.
`,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.5,
    });

    const explanation =
      completion.choices[0]?.message?.content ||
      "Unable to analyze README.";

    return NextResponse.json({
      explanation,
    });
  } catch (error) {
    console.error("README AI Error:", error);

    return NextResponse.json(
      { error: "Failed to analyze README" },
      { status: 500 }
    );
  }
}