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
        { error: "Repository owner and repo name are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to fetch repository folders" },
        { status: response.status }
      );
    }

    const contents = await response.json();

    const folders = contents
      .filter((item: any) => item.type === "dir")
      .map((item: any) => item.name);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
Explain the purpose of these repository folders in beginner-friendly language.

Folders:
${folders.join(", ")}

For each folder explain:
- What it usually contains
- Why it is important
- Simple explanation for beginners
`,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0.5,
    });

    const explanation =
      completion.choices[0]?.message?.content ||
      "Unable to explain folders.";

    return NextResponse.json({
      folders,
      explanation,
    });
  } catch (error) {
    console.error("Folder Analysis Error:", error);

    return NextResponse.json(
      { error: "Failed to analyze folders" },
      { status: 500 }
    );
  }
}