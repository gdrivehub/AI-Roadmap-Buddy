"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateRoadmap } from "../lib/api";

const EXAMPLE_GOALS = [
  "Become a SOC Analyst",
  "Learn Machine Learning",
  "Master Web Development",
  "Get into Cybersecurity",
  "Learn Cloud Architecture",
  "Become a Data Scientist",
];

export default function HomePage() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGenerate = async () => {
    if (!goal.trim() || goal.trim().length < 3) {
      setError("Please enter a learning goal (at least 3 characters)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await generateRoadmap(goal.trim());
      router.push(`/roadmap/${data.roadmapId}`);
    } catch (err) {
      setError(err.message || "Failed to generate roadmap. Please try again.");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) handleGenerate();
  };

  return (
    <main className="mesh-bg noise min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-ember flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">AI</span>
          </div>
          <span className="font-display font-semibold text-paper/90 tracking-tight">
            RoadmapAI
          </span>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-mist hover:text-paper transition-colors font-body"
        >
          My Roadmaps →
        </button>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-sage animate-pulse-slow" />
          <span className="text-xs font-mono text-mist tracking-widest uppercase">
            Powered by OpenRouter AI
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-display font-bold text-center leading-none tracking-tighter mb-6 animate-fade-up"
          style={{ animationDelay: "0.1s", opacity: 0 }}
        >
          <span className="block text-5xl md:text-7xl lg:text-8xl text-paper">
            Learn anything.
          </span>
          <span className="block text-5xl md:text-7xl lg:text-8xl text-ember">
            With a plan.
          </span>
        </h1>

        <p
          className="text-mist text-lg md:text-xl text-center max-w-xl mb-12 font-body font-light leading-relaxed animate-fade-up"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          Enter your learning goal and get a personalized, step-by-step roadmap
          with timelines, resources, and tasks — generated in seconds.
        </p>

        {/* Input */}
        <div
          className="w-full max-w-2xl animate-fade-up"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-ember/30 to-ember/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex bg-slate/80 backdrop-blur border border-white/10 rounded-2xl overflow-hidden focus-within:border-ember/50 transition-colors">
              <input
                type="text"
                value={goal}
                onChange={(e) => {
                  setGoal(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Become a SOC Analyst, Learn Python..."
                className="flex-1 bg-transparent px-6 py-5 text-paper placeholder-mist/50 text-lg font-body outline-none"
                disabled={loading}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !goal.trim()}
                className="m-2 px-6 py-3 bg-ember hover:bg-ember-dark disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-display font-semibold text-white text-sm tracking-wide transition-all duration-200 active:scale-95 flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate
                    <ArrowIcon />
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-3 text-red-400 text-sm font-body px-2">{error}</p>
          )}

          {/* Loading state */}
          {loading && (
            <div className="mt-6 p-5 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-ember animate-pulse" />
                <span className="text-sm font-mono text-mist">
                  AI is crafting your roadmap...
                </span>
              </div>
              <div className="space-y-2">
                {["Analyzing your goal", "Building phases", "Finding resources", "Finalizing roadmap"].map(
                  (step, i) => (
                    <div
                      key={step}
                      className="h-2 rounded-full shimmer"
                      style={{ width: `${85 - i * 12}%` }}
                    />
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Example goals */}
        <div
          className="mt-8 flex flex-wrap gap-2 justify-center max-w-2xl animate-fade-up"
          style={{ animationDelay: "0.4s", opacity: 0 }}
        >
          <span className="text-xs text-mist/50 font-mono self-center mr-1">Try:</span>
          {EXAMPLE_GOALS.map((eg) => (
            <button
              key={eg}
              onClick={() => {
                setGoal(eg);
                setError("");
              }}
              className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-ember/30 text-mist hover:text-paper rounded-full px-3 py-1.5 transition-all duration-200 font-body"
            >
              {eg}
            </button>
          ))}
        </div>
      </div>

      {/* Footer stats */}
      <div className="border-t border-white/5 px-8 py-6">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-8 justify-center">
          {[
            ["AI-Powered", "OpenRouter GPT-4o"],
            ["Step-by-Step", "Beginner → Expert"],
            ["Trackable", "Mark progress & complete"],
            ["Free to Use", "No account needed"],
          ].map(([label, value]) => (
            <div key={label} className="text-center">
              <div className="text-xs font-mono text-ember uppercase tracking-widest mb-1">
                {label}
              </div>
              <div className="text-sm text-mist font-body">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}
