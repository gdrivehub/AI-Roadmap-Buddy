"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { listRoadmaps, deleteRoadmap } from "../../lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const data = await listRoadmaps();
      setRoadmaps(data.roadmaps || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this roadmap?")) return;
    setDeleting(id);
    try {
      await deleteRoadmap(id);
      setRoadmaps((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const totalCompleted = roadmaps.filter((r) => r.completionPercentage === 100).length;
  const avgCompletion =
    roadmaps.length > 0
      ? Math.round(roadmaps.reduce((s, r) => s + (r.completionPercentage || 0), 0) / roadmaps.length)
      : 0;

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
          onClick={() => router.push("/")}
          className="text-sm bg-ember hover:bg-ember-dark text-white px-4 py-2 rounded-xl font-display font-semibold transition-colors"
        >
          + New
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 animate-fade-up" style={{ opacity: 0 }}>
          <span className="text-xs font-mono text-ember uppercase tracking-widest">Dashboard</span>
          <h1 className="font-display font-bold text-4xl text-paper mt-2 tracking-tight">
            My Roadmaps
          </h1>
        </div>

        {/* Stats */}
        {roadmaps.length > 0 && (
          <div
            className="grid grid-cols-3 gap-4 mb-10 animate-fade-up"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            {[
              { label: "Total Roadmaps", value: roadmaps.length, color: "text-paper" },
              { label: "Completed", value: totalCompleted, color: "text-sage" },
              { label: "Avg. Progress", value: `${avgCompletion}%`, color: "text-ember" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-slate/40 border border-white/10 rounded-2xl p-5 text-center"
              >
                <div className={`font-display font-bold text-3xl ${color} mb-1`}>{value}</div>
                <div className="text-xs font-mono text-mist uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl shimmer" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 font-body mb-4">{error}</p>
            <button onClick={fetchRoadmaps} className="text-ember hover:underline text-sm">
              Try again
            </button>
          </div>
        ) : roadmaps.length === 0 ? (
          <EmptyState onNew={() => router.push("/")} />
        ) : (
          <div
            className="grid gap-4 animate-fade-up"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            {roadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap._id}
                roadmap={roadmap}
                onOpen={() => router.push(`/roadmap/${roadmap._id}`)}
                onDelete={() => handleDelete(roadmap._id)}
                deleting={deleting === roadmap._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RoadmapCard({ roadmap, onOpen, onDelete, deleting }) {
  const pct = roadmap.completionPercentage || 0;
  const isComplete = pct === 100;

  return (
    <div className="bg-slate/40 hover:bg-slate/60 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all duration-200 group">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-display font-bold text-sm ${
            isComplete ? "bg-sage/20 text-sage" : "bg-ember/20 text-ember"
          }`}
        >
          {isComplete ? "✓" : `${pct}%`}
        </div>

        <div className="flex-1 min-w-0" onClick={onOpen} role="button" style={{ cursor: "pointer" }}>
          <h3 className="font-display font-semibold text-paper text-lg leading-tight mb-1 truncate group-hover:text-ember transition-colors">
            {roadmap.goal}
          </h3>
          <div className="flex items-center gap-3 text-xs font-mono text-mist/60">
            {roadmap.timeline && <span>{roadmap.timeline}</span>}
            <span>•</span>
            <span>{new Date(roadmap.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden w-full">
            <div
              className={`h-full rounded-full transition-all duration-700 ${isComplete ? "bg-sage" : "bg-gradient-to-r from-ember to-amber-400"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpen}
            className="px-4 py-2 bg-white/5 hover:bg-ember hover:text-white border border-white/10 hover:border-ember rounded-xl text-sm font-display font-semibold text-mist transition-all duration-200"
          >
            Open
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="p-2 text-mist/40 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/10 disabled:opacity-30"
          >
            {deleting ? (
              <div className="w-4 h-4 rounded-full border border-mist border-t-transparent animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onNew }) {
  return (
    <div className="text-center py-24 animate-fade-up" style={{ opacity: 0 }}>
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-mist/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="font-display font-bold text-2xl text-paper mb-3">No roadmaps yet</h3>
      <p className="text-mist font-body mb-8">Generate your first AI-powered learning roadmap</p>
      <button
        onClick={onNew}
        className="px-6 py-3 bg-ember hover:bg-ember-dark text-white font-display font-semibold rounded-xl transition-colors"
      >
        Create Roadmap
      </button>
    </div>
  );
}
