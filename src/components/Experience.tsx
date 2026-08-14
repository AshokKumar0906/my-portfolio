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
          <div key={job.company} className="py-6">
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
        ))}
      </div>
    </Section>
  );
}
