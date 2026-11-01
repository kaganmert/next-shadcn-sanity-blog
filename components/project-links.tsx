import type { ReactNode } from "react";
import { strings } from "@/lib/strings";

/** "Visit ↗", "Repository ↗" and an optional extra link, in small mono caps. */
export function ProjectLinks({
  project,
  more,
}: {
  project: { url?: string | null; repositoryUrl?: string | null };
  more?: ReactNode;
}) {
  const links = [
    project.url ? { href: project.url, label: strings.project.visit } : null,
    project.repositoryUrl
      ? { href: project.repositoryUrl, label: strings.project.repository }
      : null,
  ].filter((link) => link !== null);
  if (!links.length && !more) return null;

  return (
    <p className="label-mono flex flex-wrap gap-x-5 gap-y-1 pt-2">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-150 hover:text-primary"
        >
          {link.label} ↗
        </a>
      ))}
      {more}
    </p>
  );
}
