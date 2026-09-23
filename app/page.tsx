"use client";

import { useState } from "react";

const featureHighlights = [
  "AI repo summaries",
  "README analysis",
  "PR and architecture context",
];

export default function Home() {
  const [repoUrl, setRepoUrl] = useState(
    "https://github.com/vercel/next.js"
  );

  const [repoData, setRepoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  const [readmeLoading, setReadmeLoading] = useState(false);
  const [readmeContent, setReadmeContent] = useState("");

  const [error, setError] = useState("");

  const analyzeRepository = async () => {
    try {
      setLoading(true);
      setError("");
      setRepoData(null);
      setAiSummary("");
      setReadmeContent("");

      const parts = repoUrl.split("/").filter(Boolean);
      const githubIndex = parts.indexOf("github.com");

      if (githubIndex === -1) {
        setError("Please enter a valid GitHub repository URL");
        return;
      }

      const owner = parts[githubIndex + 1];
      const repo = parts[githubIndex + 2]?.replace(".git", "");

      if (!owner || !repo) {
        setError("Please enter a valid GitHub repository URL");
        return;
      }

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`
      );

      if (!response.ok) {
        throw new Error("Repository not found");
      }

      const data = await response.json();

      setRepoData(data);
    } catch (err) {
      console.error(err);
      setError("Repository not found or invalid GitHub URL");
    } finally {
      setLoading(false);
    }
  };

  const generateAISummary = async () => {
    if (!repoData) {
      setError("Please analyze a repository first");
      return;
    }

    try {
      setAiLoading(true);
      setError("");

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repository: repoData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate AI summary");
      }

      setAiSummary(data.summary);
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI summary");
    } finally {
      setAiLoading(false);
    }
  };

  const fetchReadme = async () => {
    if (!repoData) {
      setError("Please analyze a repository first");
      return;
    }

    try {
      setReadmeLoading(true);
      setError("");
      setReadmeContent("");

      const response = await fetch("/api/readme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: repoData.owner.login,
          repo: repoData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "README not found");
      }

      setReadmeContent(data.readme);
    } catch (err) {
      console.error(err);
      setError("README could not be fetched");
    } finally {
      setReadmeLoading(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_22%)]" />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-12 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 text-sm font-bold text-slate-950">
              G
            </div>

            <p className="text-sm font-medium text-slate-200">
              GitHub Knowledge Assistant
            </p>
          </div>
        </header>

        {/* Main Section */}
        <section className="grid flex-1 items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">

          {/* Left Side */}
          <div className="max-w-2xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-blue-200">
              AI-powered repo intelligence
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              GitHub Knowledge Assistant
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-300 sm:text-xl">
              Chat with any GitHub repository using AI
            </p>

            {/* Repository Input */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/80 p-3">
              <div className="flex flex-col gap-3 sm:flex-row">

                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/user/repository"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
                />

                <button
                  onClick={analyzeRepository}
                  disabled={loading}
                  className="rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Analyzing..." : "Analyze Repository"}
                </button>

              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="mt-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {/* Features */}
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              {featureHighlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5"
                >
                  {item}
                </span>
              ))}
            </div>

          </div>

          {/* Right Side */}
          <div className="relative">

            <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-900/80 p-5">

              {/* Browser Dots */}
              <div className="mb-4 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">

                {/* Repository Header */}
                <div className="mb-4 flex items-start justify-between gap-3">

                  <div>

                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Repository
                    </p>

                    <h2 className="mt-2 break-all text-xl font-semibold text-white">
                      {repoData
                        ? repoData.full_name
                        : "Click Analyze Repository"}
                    </h2>

                    {repoData?.owner?.avatar_url && (
                      <img
                        src={repoData.owner.avatar_url}
                        alt="Owner Avatar"
                        className="mt-4 h-20 w-20 rounded-full border-2 border-blue-500 object-cover"
                      />
                    )}

                  </div>

                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                    Active
                  </span>

                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <p className="text-xs text-slate-400">
                      Stars
                    </p>

                    <p className="mt-2 text-xl font-semibold text-white">
                      {repoData ? repoData.stargazers_count : "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <p className="text-xs text-slate-400">
                      Forks
                    </p>

                    <p className="mt-2 text-xl font-semibold text-white">
                      {repoData ? repoData.forks_count : "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <p className="text-xs text-slate-400">
                      Issues
                    </p>

                    <p className="mt-2 text-xl font-semibold text-white">
                      {repoData ? repoData.open_issues_count : "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <p className="text-xs text-slate-400">
                      Language
                    </p>

                    <p className="mt-2 break-words text-lg font-semibold text-white">
                      {repoData?.language || "-"}
                    </p>
                  </div>

                </div>

                {/* Description */}
                <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">

                  <p className="text-xs uppercase tracking-[0.2em] text-blue-200">
                    Repository Description
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    {repoData
                      ? repoData.description ||
                        "No repository description available."
                      : "Enter a GitHub repository URL and click Analyze Repository"}
                  </p>

                </div>

                {/* AI Summary */}
                {repoData && (
                  <>
                    <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">

                      <div className="flex items-center gap-2">

                        <span className="text-lg">
                          🤖
                        </span>

                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                          AI Repository Summary
                        </p>

                      </div>

                      {!aiSummary && (
                        <>
                          <p className="mt-3 text-sm leading-6 text-slate-300">
                            Let AI analyze this repository and explain its
                            purpose, technologies, and project structure in
                            beginner-friendly language.
                          </p>

                          <button
                            onClick={generateAISummary}
                            disabled={aiLoading}
                            className="mt-4 rounded-lg bg-linear-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {aiLoading
                              ? "Generating AI Summary..."
                              : "Generate AI Summary"}
                          </button>
                        </>
                      )}

                      {aiSummary && (
                        <div className="mt-4 whitespace-pre-line rounded-lg border border-slate-700 bg-slate-950/70 p-4 text-sm leading-7 text-slate-200">
                          {aiSummary}
                        </div>
                      )}

                    </div>

                    {/* README Analysis */}
                    <div className="mt-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">

                      <div className="flex items-center gap-2">

                        <span className="text-lg">
                          📖
                        </span>

                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
                          README Analysis
                        </p>

                      </div>

                      {!readmeContent && (
                        <>
                          <p className="mt-3 text-sm leading-6 text-slate-300">
                            Fetch the repository README and inspect its
                            documentation.
                          </p>

                          <button
                            onClick={fetchReadme}
                            disabled={readmeLoading}
                            className="mt-4 rounded-lg bg-linear-to-r from-purple-400 to-blue-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {readmeLoading
                              ? "Loading README..."
                              : "Analyze README"}
                          </button>
                        </>
                      )}

                      {readmeContent && (
                        <div className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-700 bg-slate-950/70 p-4 text-sm leading-7 text-slate-200">
                          {readmeContent}
                        </div>
                      )}

                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}