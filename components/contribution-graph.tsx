import { cn } from "cn";
import type { CSSProperties } from "react";
import { ContributionTooltip } from "@/components/contribution-tooltip";
import { buildContributionGrid } from "@/lib/contribution-grid";
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
 * A year of GitHub contributions as a server-rendered SVG. A small client
 * wrapper adds GitHub-style day tooltips on hover, tap or arrow keys. Renders
 * nothing without a username, without GITHUB_TOKEN, or when GitHub fails.
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
      <ContributionTooltip
        summary={summary}
        keyboardHint={strings.github.keyboardHint}
      >
        <svg
          // A 1px margin keeps today's outline from being clipped at the edge.
          viewBox={`-1 -1 ${width + 2} ${height + 2}`}
          aria-hidden
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
              data-label={cell.label}
              data-column={cell.column}
              data-row={cell.row}
              data-today={cell.isToday ? "" : undefined}
              className={cn(
                levelFill[cell.level],
                "[stroke-width:1.5]",
                cell.isToday && "stroke-primary",
                "data-active:stroke-foreground",
              )}
            />
          ))}
        </svg>
      </ContributionTooltip>
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
