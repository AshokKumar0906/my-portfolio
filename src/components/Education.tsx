import Section from "./Section";
import { education, certifications } from "@/lib/data";

export default function Education() {
  return (
    <Section
      id="education"
      ghost="EDUCATION"
      title="Education & Certifications"
      meta={`${certifications.length} certifications`}
    >
      <div className="grid gap-10 sm:grid-cols-2">
        <div>
          <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-muted">
            Education
          </h3>
          <ul className="space-y-5">
            {education.map((item) => (
              <li key={item.degree} className="rounded-xl border border-border bg-surface p-4">
                <p className="text-sm font-semibold">{item.degree}</p>
                <p className="text-sm text-muted">{item.school}</p>
                <p className="mt-2 font-mono text-xs text-accent">
                  {item.period} · {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-muted">
            Certifications
          </h3>
          <ul className="space-y-5">
            {certifications.map((cert) => (
              <li key={cert.name} className="rounded-xl border border-border bg-surface p-4">
                <p className="text-sm font-semibold">{cert.name}</p>
                <p className="mt-2 font-mono text-xs text-accent">
                  {cert.issuer} · {cert.year}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
