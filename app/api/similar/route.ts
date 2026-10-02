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
        { error: "Repository information is required" },
        { status: 400 }
      );
    }

    const prompt = `
You are a GitHub expert.

Repository Name: ${repository.full_name}
Description: ${repository.description || "Not available"}
Primary Language: ${repository.language || "Not available"}

Suggest 5 GitHub repositories that are similar to this project.

For each repository provide:
- Repository name
- Short description
- Why it is similar

Keep the response beginner friendly.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.5,
    });

    const result = completion.choices[0]?.message?.content;

    return NextResponse.json({
      suggestions: result || "No similar repositories found.",
    });
  } catch (error) {
    console.error("Similar Repo Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch similar repositories" },
      { status: 500 }
    );
  }
}