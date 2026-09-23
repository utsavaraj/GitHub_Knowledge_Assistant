import { NextResponse } from "next/server";

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

    return NextResponse.json({
      readme,
    });
  } catch (error) {
    console.error("README Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch README" },
      { status: 500 }
    );
  }
}