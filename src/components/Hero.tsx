import { profile } from "@/lib/data";

const socials = [
  { label: "GitHub", href: profile.links.github },
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "Medium", href: profile.links.medium },
];

export default function Hero() {
  const [first, ...rest] = profile.name.split(" ");
  const last = rest.join(" ");

  return (
    <section id="top" className="mx-auto max-w-4xl px-6 pb-8 pt-16 sm:pt-24">
      <h1 className="flex flex-wrap items-baseline gap-x-4 text-[13vw] font-black uppercase leading-[0.9] tracking-tight sm:text-[5.5rem]">
        <span className="text-outline">{first}</span>
        <span>{last}</span>
      </h1>

      <div className="mt-10 grid gap-10 sm:grid-cols-[auto_1fr_auto] sm:items-end">
        <div
          aria-hidden
          className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-ink font-mono text-2xl font-semibold text-ink-foreground sm:h-32 sm:w-32"
        >
          {first[0]}
          {last[0]}
        </div>

        <div>
          <p className="text-lg font-semibold">{profile.title}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            {profile.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-ink-foreground transition-opacity hover:opacity-85"
            >
              Let&apos;s collaborate ↗
            </a>
            <a
              href="#projects"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/30"
            >
              View projects
            </a>
          </div>
        </div>

        <div className="flex gap-2 sm:flex-col">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border bg-surface px-4 py-2 text-center text-xs font-medium transition-colors hover:border-foreground/30"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
