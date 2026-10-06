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
You are a senior software architect and technical mentor.

Analyze this GitHub repository and generate a professional markdown report for beginners.

Repository Name: ${repository.full_name}
Description: ${repository.description || "Not available"}
Primary Language: ${repository.language || "Not available"}
Stars: ${repository.stargazers_count}
Forks: ${repository.forks_count}
Open Issues: ${repository.open_issues_count}

Return the response ONLY in the following format:

# 🤖 AI Summary

## 📦 Repository Overview
- What is this project?
- What problem does it solve?
- Main purpose of the repository.

## 🚀 Key Features
- Feature 1
- Feature 2
- Feature 3
- Feature 4

## 🛠 Tech Stack
- Programming Language:
- Frameworks:
- Libraries:
- Tools:

## 👥 Who Should Use It?
- Beginners
- Students
- Developers
- Companies

## 📚 What Can You Learn?
- Concept 1
- Concept 2
- Concept 3
- Concept 4

## 🎯 Difficulty Level
Choose one:
🟢 Beginner
🟡 Intermediate
🔴 Advanced

Give a short reason.

## 📝 Beginner Explanation
Explain the repository in 4-6 simple lines that a college student can easily understand.

Rules:
- Use proper markdown headings.
- Use bullet points.
- Do NOT write large paragraphs.
- Keep sections clearly separated.
- Make the report professional and easy to scan.
- Maximum 300 words.
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