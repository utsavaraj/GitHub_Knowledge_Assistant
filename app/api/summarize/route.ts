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

📦 Repository Overview
- Explain what the project is
- Mention the main purpose

🚀 Key Features
- List the main features in bullet points

🛠 Tech Stack
- Mention technologies, frameworks and languages used

👥 Who Should Use It
- Mention which type of developers or users would benefit from it

📚 What You Can Learn
- Mention skills or concepts someone can learn from this repository

📝 Beginner Summary
- Give a short and simple explanation in 3-5 lines

Rules:
- Use simple English
- Use bullet points wherever possible
- Avoid long paragraphs
- Keep the response well-structured and easy to read

Keep the explanation clear and concise.
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

    const summary = completion.choices[0]?.message?.content;

    return NextResponse.json({
      summary: summary || "Unable to generate summary.",
    });
  } catch (error) {
    console.error("AI Summary Error:", error);

    return NextResponse.json(
      {
        error: String(error),
      },
      { status: 500 }
    );
  }
}