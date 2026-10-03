"use client";

import { useEffect, useState } from "react";

export default function AnalysisPage() {
  const [repoData, setRepoData] = useState<any>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  useEffect(() => {
    const savedRepo = localStorage.getItem("selectedRepo");

    if (savedRepo) {
      setRepoData(JSON.parse(savedRepo));
    }
  }, []);
  const generateAISummary = async () => {
  if (!repoData) return;

  try {
    setAiLoading(true);

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
      throw new Error(data.error);
    }

    setAiSummary(data.summary);
  } catch (error) {
    console.error(error);
  } finally {
    setAiLoading(false);
  }
};
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
       <h1 className="text-4xl font-bold">
  {repoData?.full_name || "Repository Detailed Analysis"}
</h1>

        <p className="mt-3 text-slate-400">
          Explore AI-powered insights for your GitHub repository.
        </p>

       <div
  onClick={generateAISummary}
  className="cursor-pointer rounded-2xl border border-purple-500/20 bg-slate-900 p-5 transition hover:border-purple-400 hover:bg-slate-800"
>
  <h2 className="font-semibold text-purple-300">
    🤖 AI Summary
  </h2>

  <p className="mt-2 text-sm text-slate-400">
    Repository overview and beginner-friendly explanation.
  </p>

  <p className="mt-3 text-xs text-purple-400">
    Click to generate summary
  </p>
</div>
{aiSummary && (
  <div className="rounded-2xl border border-purple-500/20 bg-slate-900 p-5 md:col-span-2">
    <h3 className="mb-3 font-semibold text-purple-300">
      AI Summary Result
    </h3>

    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
      {aiSummary}
    </div>
  </div>
)}

          <div className="rounded-2xl border border-blue-500/20 bg-slate-900 p-5">
            <h2 className="font-semibold text-blue-300">
              📄 README Analysis
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Understand project documentation quickly.
            </p>
          </div>

          <div className="rounded-2xl border border-pink-500/20 bg-slate-900 p-5">
            <h2 className="font-semibold text-pink-300">
              📁 Folder Analysis
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Learn the purpose of important folders.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-slate-900 p-5">
            <h2 className="font-semibold text-orange-300">
              🛠 Tech Stack Analysis
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Discover technologies used in the repository.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-5">
            <h2 className="font-semibold text-cyan-300">
              👥 Contributors Analysis
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Understand contributor roles and activity.
            </p>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-slate-900 p-5">
            <h2 className="font-semibold text-green-300">
              🔗 Similar Repositories
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Find related repositories and alternatives.
            </p>
          </div>
        </div>
    </main>
  );
}
