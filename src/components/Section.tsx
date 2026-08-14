import { ReactNode } from "react";

export default function Section({
  id,
  ghost,
  title,
  meta,
  tone = "light",
  children,
}: {
  id: string;
  ghost: string;
  title: string;
  meta?: string;
  tone?: "light" | "dark";
  children: ReactNode;
}) {
  const isDark = tone === "dark";
  return (
    <section
      id={id}
      className={`scroll-mt-20 py-16 sm:py-24 ${
        isDark ? "bg-ink text-ink-foreground" : ""
      }`}
    >
      <div className="relative mx-auto max-w-4xl px-6">
        <span
          aria-hidden
          className={`pointer-events-none absolute -top-6 left-0 select-none text-[15vw] leading-none font-black tracking-tight sm:text-[7rem] ${
            isDark ? "text-ink-foreground/[0.06]" : "ghost-label"
          }`}
        >
          {ghost}
        </span>
        <div className="relative mb-12 flex items-end justify-between gap-4 pt-10">
          <h2 className="font-mono text-sm font-medium tracking-tight">
            /{title}
          </h2>
          {meta && (
            <span
              className={`font-mono text-xs ${
                isDark ? "text-ink-foreground/60" : "text-muted"
              }`}
            >
              {meta}
            </span>
          )}
        </div>
        <div className="relative">{children}</div>
      </div>
    </section>
  );
}
