import type { CSSProperties } from "react";
import { buildContributionGrid } from "@/lib/contribution-grid";
import { formatDate } from "@/lib/format-date";
import type { ContributionLevel } from "@/lib/github-contributions";
import { loadContributionCalendar } from "@/lib/load-contribution-calendar";
import { strings } from "@/lib/strings";

const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP;

/** Ink density: an empty day is a faint mark on the paper, a busy one solid sumi. */
const levelFill: Record<ContributionLevel, string> = {
  0: "fill-foreground/7",
  1: "fill-foreground/30",
  2: "fill-foreground/50",
  3: "fill-foreground/75",
  4: "fill-foreground",
};

/**
 * A year of GitHub contributions as a server-rendered SVG: no client
 * JavaScript, native tooltips per day. Renders nothing without a username,
 * without GITHUB_TOKEN, or when GitHub fails.
 */
export async function ContributionGraph({
  username,
  className,
  style,
}: {
  username: string | null | undefined;
  className?: string;
  style?: CSSProperties;
}) {
  if (!username) return null;
  const calendar = await loadContributionCalendar(username);
  if (!calendar || calendar.weeks.length === 0) return null;

  const grid = buildContributionGrid(calendar);
  const summary = strings.github.summary(grid.total);
  const width = grid.columns * STEP - GAP;
  const height = 7 * STEP - GAP;

  return (
    <figure className={className} style={style}>
      <svg
        // A 1px margin keeps today's outline from being clipped at the edge.
        viewBox={`-1 -1 ${width + 2} ${height + 2}`}
        role="img"
        aria-label={summary}
        className="block h-auto w-full"
      >
        {grid.cells.map((cell) => (
          <rect
            key={cell.date}
            x={cell.column * STEP}
            y={cell.row * STEP}
            width={CELL}
            height={CELL}
            rx={1}
            className={
              cell.isToday
                ? `${levelFill[cell.level]} stroke-primary`
                : levelFill[cell.level]
            }
            strokeWidth={cell.isToday ? 1.5 : undefined}
          >
            <title>
              {strings.github.day(cell.count, formatDate(cell.date))}
            </title>
          </rect>
        ))}
      </svg>
      <figcaption className="label-mono mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span>{summary}</span>
        <a
          href={`https://github.com/${encodeURIComponent(username)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-150 hover:text-primary"
        >
          {strings.github.profile} ↗
        </a>
      </figcaption>
    </figure>
  );
}
