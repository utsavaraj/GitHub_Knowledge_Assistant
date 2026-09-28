import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { repository, question } = await request.json();

    if (!repository || !question) {
      return NextResponse.json(
        { error: "Repository and question are required" },
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

Stars:
${repository.stargazers_count}

Question:
${question}

Answer the question in beginner-friendly language.
`,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.5,
    });

    const answer =
      completion.choices[0]?.message?.content ||
      "Unable to generate answer.";

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error("Chat Error:", error);

    return NextResponse.json(
      { error: "Failed to generate answer" },
      { status: 500 }
    );
  }
}