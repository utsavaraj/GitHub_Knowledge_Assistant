import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { repository } = await request.json();

    if (!repository) {
      return NextResponse.json(
        { error: "Repository data is required" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
Repository Name: ${repository.full_name}

Description:
${repository.description}

Language:
${repository.language}

Analyze this repository and identify:

- Frontend Technology
- Backend Technology
- Database (if any)
- Main Language
- Framework
- Short beginner-friendly explanation
`,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.5,
    });

    const analysis =
      completion.choices[0]?.message?.content ||
      "Unable to analyze tech stack.";

    return NextResponse.json({
  explanation: analysis,
});
  } catch (error) {
    console.error("Tech Stack Error:", error);

    return NextResponse.json(
      { error: "Failed to analyze tech stack" },
      { status: 500 }
    );
  }
}
