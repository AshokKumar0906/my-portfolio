import Section from "./Section";
import { projects } from "@/lib/data";

const gradients = [
  "from-indigo-500 via-blue-500 to-cyan-400",
  "from-fuchsia-500 via-purple-500 to-indigo-500",
  "from-emerald-500 via-teal-500 to-cyan-400",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-slate-700 via-slate-600 to-slate-500",
];

export default function Projects() {
  return (
    <Section
      id="projects"
      ghost="PROJECTS"
      title="Selected Work"
      meta={`${projects.length} projects`}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <div
            key={project.name}
            className="overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-foreground/30"
          >
            <div
              className={`relative flex h-40 items-end bg-gradient-to-br p-4 ${gradients[i % gradients.length]}`}
            >
              <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-ink">
                Production
              </span>
              <span className="absolute right-4 top-4 rounded-full bg-black/20 px-3 py-1 text-[11px] font-medium text-white">
                {project.metric}
              </span>
            </div>
            <div className="p-5">
              <h3 className="mb-2 text-sm font-semibold">{project.name}</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted">
                {project.description}
              </p>
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-border px-3 py-1 text-[11px] text-muted"
                  >
                    {tech}
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
