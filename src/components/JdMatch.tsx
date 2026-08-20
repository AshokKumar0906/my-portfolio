"use client";

import { useState } from "react";
import Section from "./Section";
import { profile } from "@/lib/data";

type MatchResult = {
  score: number;
  verdict: string;
  matches: string[];
  gaps: string[];
};

export default function JdMatch() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);

  const analyze = async () => {
    if (jobDescription.trim().length < 20 || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/jd-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_description: jobDescription }),
      });
      if (!response.ok) throw new Error("Request failed");
      setResult(await response.json());
    } catch {
      setError("Couldn't analyze that job description. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="jd-match" ghost="JD MATCH" title="Job Fit Check" meta="AI-scored">
      <p className="mb-6 max-w-lg text-sm leading-relaxed text-muted">
        Paste a job description and {profile.name.split(" ")[0]}&apos;s AI assistant will
        score the fit against his actual résumé — matches and gaps, no fluff.
      </p>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.currentTarget.value)}
        placeholder="Paste a job description here…"
        rows={6}
        className="w-full resize-y rounded-xl border border-border bg-surface p-4 text-sm outline-none focus:border-foreground/30"
      />

      <button
        onClick={analyze}
        disabled={jobDescription.trim().length < 20 || loading}
        className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-ink-foreground transition-opacity hover:opacity-85 disabled:opacity-40"
      >
        {loading ? "Analyzing…" : "Check fit ↗"}
      </button>

      {error && <p className="mt-4 text-sm text-muted">{error}</p>}

      {result && (
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black tracking-tight">{result.score}%</span>
            <p className="text-sm leading-relaxed text-muted">{result.verdict}</p>
          </div>

          {result.matches.length > 0 && (
            <div className="mt-6">
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground">
                Matches
              </h4>
              <ul className="space-y-2">
                {result.matches.map((match, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="text-accent">+</span>
                    {match}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.gaps.length > 0 && (
            <div className="mt-6">
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground">
                Gaps
              </h4>
              <ul className="space-y-2">
                {result.gaps.map((gap, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="text-muted">–</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
