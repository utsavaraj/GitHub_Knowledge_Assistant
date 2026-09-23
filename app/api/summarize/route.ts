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
You are an expert software engineer.

Analyze this GitHub repository information and explain it in simple language for a beginner.

Repository Name: ${repository.full_name}
Description: ${repository.description || "Not available"}
Primary Language: ${repository.language || "Not available"}
Stars: ${repository.stargazers_count}
Forks: ${repository.forks_count}
Open Issues: ${repository.open_issues_count}

Give the response in these sections:

1. What this project is
2. Main purpose
3. Technologies used
4. Why developers might use it
5. Beginner-friendly explanation

Keep the explanation clear and concise.
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
    });

    const summary = completion.choices[0]?.message?.content;

    return NextResponse.json({
      summary: summary || "Unable to generate summary.",
    });
  } catch (error) {
    console.error("AI Summary Error:", error);

    return NextResponse.json(
      { error: "Failed to generate AI summary" },
      { status: 500 }
    );
  }
}