import Section from "./Section";
import { skills } from "@/lib/data";

export default function About() {
  return (
    <Section id="about" ghost="SKILLS" title="Skills" meta={`${skills.length} areas`}>
      <p className="mb-10 max-w-lg text-sm leading-relaxed text-muted">
        Machine Learning Engineer focused on production AI systems that
        eliminate manual effort — presales automation, agentic workflows, RAG
        architectures, and LLM fine-tuning, backed by an M.Sc. in Data
        Science and dual cloud certifications from Oracle and AWS.
      </p>

      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground">
              {group.category}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
