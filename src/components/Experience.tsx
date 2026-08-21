"use client";

import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import { experience } from "@/lib/data";

export default function Experience() {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setRevealed(new Set(experience.map((_, i) => i)));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setRevealed((prev) => {
          let changed = false;
          const next = new Set(prev);
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (!next.has(index)) {
              next.add(index);
              changed = true;
            }
          }
          return changed ? next : prev;
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" },
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const progress =
    experience.length > 0 ? (revealed.size / experience.length) * 100 : 0;

  return (
    <Section
      id="experience"
      ghost="EXPERIENCE"
      title="Experience"
      meta="2+ years of experience"
      tone="dark"
    >
      <div className="relative">
        <div className="absolute left-1 top-2 bottom-2 w-px bg-ink-foreground/10" />
        <div
          className="absolute left-1 top-2 w-px bg-accent transition-[height] duration-700 ease-out"
          style={{ height: `${progress}%` }}
        />

        {experience.map((job, index) => (
          <div
            key={job.company}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            data-index={index}
            className="relative pb-10 pl-8 last:pb-0"
          >
            <span
              className={`absolute left-0 top-1.5 h-2 w-2 rounded-full transition-colors duration-500 ${
                revealed.has(index) ? "bg-accent" : "bg-ink-foreground/20"
              }`}
            />
            <div
              className={`transition-all duration-700 ease-out ${
                revealed.has(index)
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-semibold">{job.role}</p>
                  <p className="text-sm text-ink-foreground/60">{job.company}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-ink-foreground/60">
                  {job.period}
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {job.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="relative pl-4 text-sm leading-relaxed text-ink-foreground/70 before:absolute before:left-0 before:content-['—']"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
