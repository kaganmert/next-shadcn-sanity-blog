import { cn } from "cn";

/** Items separated by quiet slashes: the tech stack's list style. */
export function SlashList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-x-3 gap-y-1 font-serif", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="after:ml-3 after:text-border after:content-['/'] last:after:content-none"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
