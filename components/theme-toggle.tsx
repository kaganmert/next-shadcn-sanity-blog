"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { strings } from "@/lib/strings";

/**
 * Both icons are always rendered and swapped with the `dark:` variant, so the
 * server markup never depends on the client's theme (no hydration mismatch).
 *
 * Where the browser supports view transitions, the page crossfades between
 * paper and ink. The class is flipped synchronously inside the transition so
 * the "after" snapshot is the new theme; next-themes then persists it.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  function toggle() {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!document.startViewTransition || reduceMotion) {
      setTheme(next);
      return;
    }

    root.dataset.themeTransition = "";
    const transition = document.startViewTransition(() => {
      root.classList.toggle("dark", next === "dark");
      root.classList.toggle("light", next === "light");
      root.style.colorScheme = next;
      setTheme(next);
    });
    transition.finished.finally(() => {
      delete root.dataset.themeTransition;
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={strings.theme.toggle}
      onClick={toggle}
      className="text-muted-foreground hover:text-foreground"
    >
      <SunIcon className="dark:hidden" aria-hidden />
      <MoonIcon className="hidden dark:block" aria-hidden />
    </Button>
  );
}
