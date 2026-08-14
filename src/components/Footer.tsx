import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <div className="flex gap-4">
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            GitHub
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            LinkedIn
          </a>
          <a href={profile.links.medium} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            Medium
          </a>
        </div>
      </div>
    </footer>
  );
}
