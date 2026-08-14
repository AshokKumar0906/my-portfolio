import Section from "./Section";
import { profile } from "@/lib/data";

const links = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
  { label: "LinkedIn", value: "linkedin.com/in/ashok-kumar-l", href: profile.links.linkedin },
  { label: "GitHub", value: "github.com/AshokKumar0906", href: profile.links.github },
  { label: "Medium", value: "medium.com/@ashokkumar0906.ak", href: profile.links.medium },
];

export default function Contact() {
  return (
    <Section id="contact" ghost="CONTACT" title="Contact" tone="dark">
      <div className="flex flex-col items-center py-8 text-center">
        <span className="mb-6 flex items-center gap-2 rounded-full bg-ink-foreground/10 px-4 py-1.5 text-xs font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Open to opportunities
        </span>
        <h3 className="max-w-2xl text-3xl font-black uppercase leading-[1.05] sm:text-5xl">
          Let&apos;s build something intelligent
        </h3>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-foreground/60">
          Open to interesting AI/ML opportunities, collaborations, and
          consulting. Reach out through any channel below.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-8 rounded-full bg-ink-foreground px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-85"
        >
          Contact Me ↗
        </a>
      </div>

      <div className="grid gap-3 border-t border-ink-foreground/10 pt-8 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center justify-between rounded-xl border border-ink-foreground/10 px-4 py-3 text-sm transition-colors hover:border-ink-foreground/30"
          >
            <span className="text-ink-foreground/60">{link.label}</span>
            <span className="font-medium">{link.value}</span>
          </a>
        ))}
      </div>
    </Section>
  );
}
