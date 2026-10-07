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
  const [error, setError] = useState("");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  const [readmeLoading, setReadmeLoading] = useState(false);
  const [readmeContent, setReadmeContent] = useState("");

  const [folderLoading, setFolderLoading] = useState(false);
  const [folderExplanation, setFolderExplanation] = useState("");
  
  const [question, setQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const [techLoading, setTechLoading] = useState(false);
  const [techStack, setTechStack] = useState("");

  const [similarRepos, setSimilarRepos] = useState("");
  const [similarLoading, setSimilarLoading] = useState(false);

  const [contributors, setContributors] = useState("");
  const [contributorsLoading, setContributorsLoading] = useState(false);
  const analyzeRepository = async () => {
    try {
      setLoading(true);
      setError("");
      setRepoData(null);
      setAiSummary("");
      setReadmeContent("");
      setFolderExplanation("");

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
      localStorage.setItem(
  "selectedRepo",
  JSON.stringify(data)
);

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

      setReadmeContent(data.explanation);
    } catch (err) {
      console.error(err);
      setError("README could not be fetched");
    } finally {
      setReadmeLoading(false);
    }
  };
    
      

const fetchTechStack = async () => {
  if (!repoData) {
    setError("Please analyze a repository first");
    return;
  }

  try {
    setTechLoading(true);
    setError("");
    setTechStack("");

    const response = await fetch("/api/techstack", {
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
      throw new Error(data.error || "Failed to analyze tech stack");
    }

    setTechStack(data.analysis);
  } catch (err) {
    console.error(err);
    setError("Tech stack analysis failed");
  } finally {
    setTechLoading(false);
  }
};

const fetchContributors = async () => {
  if (!repoData) {
    setError("Please analyze a repository first");
    return;
  }

  try {
    setContributorsLoading(true);
    setError("");
    setContributors("");

    const response = await fetch("/api/contributors", {
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
      throw new Error(data.error || "Failed to analyze contributors");
    }

    setContributors(data.contributors);
  } catch (err) {
    console.error(err);
    setError("Contributors analysis failed");
  } finally {
    setContributorsLoading(false);
  }
};
const fetchSimilarRepos = async () => {
  if (!repoData) {
    setError("Please analyze a repository first");
    return;
  }

  try {
    setSimilarLoading(true);
    setError("");
    setSimilarRepos("");

    const response = await fetch("/api/similar", {
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
      throw new Error(
        data.error || "Failed to fetch similar repositories"
      );
    }

    setSimilarRepos(data.suggestions);
  } catch (err) {
    console.error(err);
    setError("Similar repositories analysis failed");
  } finally {
    setSimilarLoading(false);
  }
};

const fetchFolders = async () => {
  if (!repoData) {
    setError("Please analyze a repository first");
    return;
  }

  try {
    setFolderLoading(true);
    setError("");
    setFolderExplanation("");

    const response = await fetch("/api/folders", {
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
      throw new Error(data.error || "Failed to explain folders");
    }

    setFolderExplanation(data.explanation);
  } catch (err) {
    console.error(err);
    setError("Folder analysis failed");
  } finally {
    setFolderLoading(false);
  }
};

const askQuestion = async () => {
  if (!repoData || !question.trim()) {
    setError("Please enter a question about the repository");
    return;
  }

  try {
    setChatLoading(true);
    setError("");
    setChatAnswer("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repository: repoData,
        question: question.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to get answer");
    }

    setChatAnswer(data.answer);
  } catch (err) {
    console.error(err);
    setError("Failed to answer the question");
  } finally {
    setChatLoading(false);
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
       <section className="flex flex-1 flex-col items-center justify-center text-center">

          {/* Left Side */}
        <div className="mx-auto max-w-4xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-blue-200">
              AI-powered repo intelligence
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              GitHub Knowledge Assistant
            </h1>

            <p className="mt-6 mx-auto max-w-xl text-center text-lg text-slate-300 sm:text-xl">
              Chat with any GitHub repository using AI
            </p>

            {/* Repository Input */}
          <div className="mt-8 mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-slate-900/80 p-3">
             <div className="flex flex-col items-center gap-4">

                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/user/repository"
                  className="w-full max-w-3xl rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
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
         {repoData && (
  <div className="mt-6 flex justify-center">

   <a
  href="/analysis"
  className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-purple-500 to-pink-500 px-8 py-3 font-semibold text-white transition hover:opacity-90"
>
  View Detailed Analysis →
</a>
  </div>
)}

            {/* Error */}
            {error && (
              <p className="mt-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {/* Features */}
         <div className="relative mt-4 flex flex-wrap justify-center gap-3 overflow-hidden rounded-4xl border border-white/10 bg-slate-900/80 p-5">
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


           <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/80 p-4">

                {/* Repository Header */}
               <div className="flex flex-col items-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Repository
                    </p>

                    <h2 className="mt-2 break-all text-center text-xl font-semibold text-white">
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
<div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">

  <span className="text-slate-200">
    ⭐ {repoData ? repoData.stargazers_count : "-"} Stars
  </span>

  <span className="text-slate-200">
    🍴 {repoData ? repoData.forks_count : "-"} Forks
  </span>

  <span className="text-slate-200">
    🐞 {repoData ? repoData.open_issues_count : "-"} Issues
  </span>

  <span className="text-slate-200">
    🛠 {repoData?.language || "-"} Tech Stack
  </span>

  <span className="font-semibold text-green-400">
    💚
    {repoData
      ? Math.min(
          10,
          repoData.stargazers_count / 1000 +
            repoData.forks_count / 500 +
            5 -
            repoData.open_issues_count / 1000
        ).toFixed(1)
      : "-"}
    /10 Health Score
  </span>

</div>
                {/* Description */}
                <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
                 <p className="text-center text-xs uppercase tracking-[0.2em] text-blue-200">
                    Repository Description
                  </p>

                 <p className="mt-2 text-center text-sm leading-6 text-slate-200">
                    {repoData
                      ? repoData.description || "No repository description available."
                      : ""}
                  </p>
                </div>

                {/* Chat With Repository */}
                <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                 <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">💬</span>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-200">
                      Chat With Repository
                    </p>
                  </div>

                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask anything about this repository..."
                   className="mt-4 mx-auto block w-full max-w-2xl rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none"
                  />

                  <button
                    onClick={askQuestion}
                    disabled={chatLoading}
                   className="mt-3 mx-auto block rounded-lg bg-linear-to-r from-green-400 to-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:opacity-60"
                  >
                    {chatLoading ? "Thinking..." : "Ask AI"}
                  </button>

                  {chatAnswer && (
                    <div className="mt-4 whitespace-pre-line rounded-lg border border-slate-700 bg-slate-950/70 p-4 text-sm leading-7 text-slate-200">
                      {chatAnswer}
                    </div>
                  )}
                </div>
              </div>
        </section>
      </div>
    </main>
  );
}