"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRoadmap, updateStep } from "../../../lib/api";

export default function RoadmapPage() {
  const { id } = useParams();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStep, setUpdatingStep] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchRoadmap();
  }, [id]);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const data = await getRoadmap(id);
      setRoadmap(data.roadmap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStepToggle = async (stepId, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    setUpdatingStep(stepId);

    try {
      const data = await updateStep(id, stepId, newStatus);
      setRoadmap(data.roadmap);
    } catch (err) {
      console.error("Failed to update step:", err.message);
    } finally {
      setUpdatingStep(null);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onBack={() => router.push("/")} />;
  if (!roadmap) return null;

  const completion = roadmap.completionPercentage || 0;
  const completedCount = roadmap.steps?.filter((s) => s.status === "completed").length || 0;

  return (
    <div className="mesh-bg noise min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-ink/80 backdrop-blur">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-mist hover:text-paper transition-colors text-sm font-body"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Home
        </button>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-ember flex items-center justify-center">
            <span className="text-white font-display font-bold text-xs">AI</span>
          </div>
          <span className="font-display font-semibold text-paper/90 text-sm">RoadmapAI</span>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-mist hover:text-paper transition-colors font-body"
        >
          Dashboard →
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 animate-fade-up" style={{ animationDelay: "0s", opacity: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono text-ember uppercase tracking-widest">Learning Roadmap</span>
            {roadmap.timeline && (
              <>
                <span className="text-white/20">•</span>
                <span className="text-xs font-mono text-mist">{roadmap.timeline}</span>
              </>
            )}
          </div>
          <h1 className="font-display font-bold text-3xl md:text-5xl text-paper tracking-tight mb-6 leading-tight">
            {roadmap.goal}
          </h1>

          {/* Progress */}
          <div className="bg-slate/60 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-body text-mist">Overall Progress</span>
              <span className="font-display font-bold text-2xl text-paper">
                {completion}
                <span className="text-ember text-lg">%</span>
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-ember to-amber-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-mist/60 font-mono">
              <span>{completedCount} of {roadmap.steps?.length || 0} phases complete</span>
              {completion === 100 && (
                <span className="text-sage font-semibold">🎉 Completed!</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steps */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-display font-semibold text-paper/70 text-xs uppercase tracking-widest mb-4">
              Phases
            </h2>
            {roadmap.steps?.map((step, index) => (
              <StepCard
                key={step._id}
                step={step}
                index={index}
                updating={updatingStep === step._id}
                onToggle={() => handleStepToggle(step._id, step.status)}
              />
            ))}
          </div>

          {/* Resources sidebar */}
          <div>
            <h2 className="font-display font-semibold text-paper/70 text-xs uppercase tracking-widest mb-4">
              Resources
            </h2>
            <div className="space-y-3 sticky top-24">
              {roadmap.resources?.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate/40 hover:bg-slate/70 border border-white/10 hover:border-ember/30 rounded-xl p-4 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-ember/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-ember/40 transition-colors">
                      <svg className="w-3 h-3 text-ember" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-body text-paper/80 group-hover:text-paper transition-colors line-clamp-2 leading-snug">
                        {resource.title}
                      </p>
                      <p className="text-xs text-mist/50 mt-1 font-mono truncate">
                        {resource.url.replace(/^https?:\/\//, "").split("/")[0]}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({ step, index, updating, onToggle }) {
  const [expanded, setExpanded] = useState(index === 0);
  const isCompleted = step.status === "completed";

  return (
    <div
      className={`step-card border rounded-2xl overflow-hidden transition-all duration-300 animate-fade-up ${
        isCompleted
          ? "border-sage/30 bg-sage/5"
          : "border-white/10 bg-slate/40 hover:border-white/20"
      }`}
      style={{ opacity: 0 }}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={onToggle}
            disabled={updating}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5 ${
              isCompleted
                ? "bg-sage border-sage"
                : "border-white/30 hover:border-ember"
            } ${updating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {isCompleted && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {updating && (
              <div className="w-3 h-3 rounded-full border-2 border-ember border-t-transparent animate-spin" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-mono text-ember/60">Phase {index + 1}</span>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-left w-full"
            >
              <h3 className={`font-display font-semibold text-lg leading-tight ${isCompleted ? "text-mist line-through" : "text-paper"}`}>
                {step.title}
              </h3>
            </button>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-mist hover:text-paper transition-colors flex-shrink-0"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {expanded && (
          <div className="mt-4 ml-10 animate-fade-in">
            <p className="text-mist text-sm font-body leading-relaxed mb-4">
              {step.description}
            </p>
            {step.tasks?.length > 0 && (
              <div>
                <p className="text-xs font-mono text-ember/70 uppercase tracking-widest mb-2">Tasks</p>
                <ul className="space-y-2">
                  {step.tasks.map((task, ti) => (
                    <li key={ti} className="flex items-start gap-2 text-sm text-paper/70 font-body">
                      <span className="text-ember mt-1 flex-shrink-0">◆</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mesh-bg noise min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="h-4 w-16 rounded shimmer" />
        <div className="h-4 w-24 rounded shimmer" />
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="h-8 w-48 rounded-xl shimmer" />
        <div className="h-16 w-full rounded-2xl shimmer" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-2xl shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, onBack }) {
  return (
    <div className="mesh-bg noise min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-2xl text-paper mb-3">Something went wrong</h2>
        <p className="text-mist font-body mb-6">{error}</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-ember hover:bg-ember-dark text-white font-display font-semibold rounded-xl transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
