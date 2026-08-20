import { profile, skills, experience, projects } from "@/lib/data";

const links = [
  { href: "#jd-match", label: "Job Fit" },
  { href: "#about", label: "Skills", meta: `${skills.length}` },
  { href: "#experience", label: "Experience", meta: `${experience.length}` },
  { href: "#projects", label: "Projects", meta: `${projects.length}` },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-4 z-50 mx-auto flex max-w-4xl items-center justify-between gap-4 rounded-full border border-border bg-surface/90 px-4 py-2.5 shadow-sm backdrop-blur lg:max-w-5xl xl:max-w-6xl">
      <a
        href="#top"
        className="flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-xs font-medium"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Open to opportunities
      </a>
      <nav className="hidden items-center gap-6 text-sm sm:flex">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex items-center gap-1 text-foreground/80 transition-colors hover:text-foreground"
          >
            {link.label}
            {link.meta && (
              <span className="text-[11px] text-muted">[{link.meta}]</span>
            )}
          </a>
        ))}
      </nav>
      <a
        href={profile.links.resume}
        download
        className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-ink-foreground transition-opacity hover:opacity-85"
      >
        Résumé ↓
      </a>
    </header>
  );
}
