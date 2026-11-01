import { cn } from "cn";

/**
 * The site's hanko: a small vermilion seal bearing 間 (ma, "the space
 * between"), the idea the design is built on. The only solid vermilion
 * surface on the page. Decorative; the site title next to it is the label.
 */
export function Seal({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-7 shrink-0 select-none place-items-center rounded-[3px] bg-primary font-display font-semibold text-[0.95rem] text-primary-foreground leading-none",
        className,
      )}
    >
      間
    </span>
  );
}
