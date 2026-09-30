import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { owner, repo } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repo are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contributors`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch contributors");
    }

    const contributors = await response.json();

    const topContributors = contributors
      .slice(0, 5)
      .map(
        (contributor: any, index: number) =>
          `${index + 1}. ${contributor.login} (${contributor.contributions} contributions)`
      )
      .join("\n");

    return NextResponse.json({
      contributors: topContributors,
    });
  } catch (error) {
    console.error("Contributors Error:", error);

    return NextResponse.json(
      { error: "Failed to analyze contributors" },
      { status: 500 }
    );
  }
}