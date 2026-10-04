import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { repository } = await request.json();

    if (!repository) {
  return NextResponse.json(
    { error: "Repository data is required" },
        { status: 400 }
      );
    }

    

    const response = await fetch(
      `https://api.github.com/repos/${repository.owner.login}/${repository.name}/contributors`
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
  explanation: topContributors,
});
  } catch (error) {
    console.error("Contributors Error:", error);

    return NextResponse.json(
      { error: "Failed to analyze contributors" },
      { status: 500 }
    );
  }
}