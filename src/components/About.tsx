"use client";

import { useState } from "react";
import Section from "./Section";
import { skills } from "@/lib/data";

export default function About() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<Record<string, string>>({});

  const toggleSkill = async (skill: string) => {
    if (expanded === skill) {
      setExpanded(null);
      return;
    }
    setExpanded(skill);
    if (explanations[skill] || loading === skill) return;

    setLoading(skill);
    try {
      const response = await fetch("/api/skill-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill }),
      });
      const data = await response.json();
      setExplanations((prev) => ({
        ...prev,
        [skill]: response.ok ? data.explanation : "Couldn't load an explanation right now.",
      }));
    } catch {
      setExplanations((prev) => ({
        ...prev,
        [skill]: "Couldn't load an explanation right now.",
      }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <Section id="about" ghost="SKILLS" title="Skills" meta={`${skills.length} areas`}>
      <p className="mb-10 max-w-lg text-sm leading-relaxed text-muted">
        AI/ML Engineer focused on production AI systems that
        eliminate manual effort — presales automation, agentic workflows, RAG
        architectures, and LLM fine-tuning, backed by an M.Sc. in Data
        Science and dual cloud certifications from Oracle and AWS.
      </p>
      <p className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs text-accent">
        <span aria-hidden>✨</span>
        Click any skill below to ask the AI how it&apos;s actually been used
      </p>

      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground">
              {group.category}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => toggleSkill(item)}
                    aria-expanded={expanded === item}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
                      expanded === item
                        ? "border-accent text-accent"
                        : "border-border text-muted hover:border-accent/50 hover:text-accent"
                    }`}
                  >
                    {item}
                    <span aria-hidden className="text-[10px] opacity-60">
                      {expanded === item ? "−" : "?"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {group.items.map(
              (item) =>
                expanded === item && (
                  <div
                    key={item}
                    className="mt-3 rounded-xl border border-border bg-surface p-3 text-xs leading-relaxed text-muted"
                  >
                    {loading === item ? "Thinking…" : explanations[item]}
                  </div>
                ),
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
