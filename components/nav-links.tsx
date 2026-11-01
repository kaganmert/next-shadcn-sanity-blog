"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

/** A section is active on its own page and on every page beneath it. */
function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Header links. The current section is marked with a small vermilion point
 * under its label, the one place colour says "you are here".
 */
export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="group relative inline-flex rounded-sm px-2.5 py-1.5 text-muted-foreground text-sm transition-colors duration-150 hover:text-foreground aria-[current=page]:text-foreground"
            >
              {item.label}
              <span
                aria-hidden
                className="absolute bottom-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary opacity-0 transition-opacity duration-200 group-aria-[current=page]:opacity-100"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
