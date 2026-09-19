"use client";

import { useState } from "react";

const featureHighlights = [
  "AI repo summaries",
  "Instant code insights",
  "PR and architecture context",
];

export default function Home() {
  const [repoUrl, setRepoUrl] = useState(
    "https://github.com/vercel/next.js"
  );

  const [repoData, setRepoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const analyzeRepository = async () => {
  try {
    setLoading(true);
    setError("");

    const parts = repoUrl.split("/");

    const owner = parts[3];
    const repo = parts[4];

    if (!owner || !repo) {
      setError("Please enter a valid GitHub repository URL");
      setLoading(false);
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
    setError("Repository not found");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_22%)]" />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">
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

        <section className="grid flex-1 items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
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
  className="rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 px-6 py-3 font-semibold text-slate-950"
>
  {loading ? "Loading..." : "Analyze Repository"}

                </button>
              </div>
            </div>
            {error && (
  <p className="mt-2 text-sm text-red-400">
    {error}
  </p>
)}

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

          <div className="relative">
            <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-900/80 p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Repository
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-white">
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

     <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
    <p className="text-xs text-slate-400">Stars</p>
    <p className="mt-2 text-xl font-semibold text-white">
      {repoData ? repoData.stargazers_count : "-"}
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
    <p className="text-xs text-slate-400">Forks</p>
    <p className="mt-2 text-xl font-semibold text-white">
      {repoData ? repoData.forks_count : "-"}
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
    <p className="text-xs text-slate-400">Issues</p>
    <p className="mt-2 text-xl font-semibold text-white">
      {repoData ? repoData.open_issues_count : "-"}
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
    <p className="text-xs text-slate-400">Language</p>
    <p className="mt-2 text-lg font-semibold text-white break-words">
      {repoData?.language || "-"}
    </p>
  </div>

</div>
                

                <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-200">
                    Repository Description
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    {repoData
                      ? repoData.description
                      : "Enter a GitHub repository URL and click Analyze Repository"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}