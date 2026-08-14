import Section from "./Section";
import { experience } from "@/lib/data";

export default function Experience() {
  return (
    <Section
      id="experience"
      ghost="EXPERIENCE"
      title="Experience"
      meta="2+ years of experience"
      tone="dark"
    >
      <div className="divide-y divide-ink-foreground/10 border-t border-ink-foreground/10">
        {experience.map((job) => (
          <details key={job.company} className="group py-6" open={job === experience[0]}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-ink-foreground/40 transition-transform group-open:rotate-45">
                  +
                </span>
                <div>
                  <p className="text-base font-semibold">{job.role}</p>
                  <p className="text-sm text-ink-foreground/60">{job.company}</p>
                </div>
              </div>
              <span className="shrink-0 font-mono text-xs text-ink-foreground/60">
                {job.period}
              </span>
            </summary>
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
          </details>
        ))}
      </div>
    </Section>
  );
}
