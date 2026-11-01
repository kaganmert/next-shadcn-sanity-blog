"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ComponentProps, useLayoutEffect } from "react";

/**
 * next-themes' inline script sets the theme class on <html> while the HTML is
 * parsed. In development, React Strict Mode's remount resets <html> to its JSX
 * attributes and clears that class, so we re-apply it before paint. This is a
 * no-op in production. See node_modules/next/dist/docs/01-app/02-guides/
 * preventing-flash-before-hydration.md.
 */
function ReapplyThemeClass() {
  const { resolvedTheme } = useTheme();

  useLayoutEffect(() => {
    if (!resolvedTheme) return;
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.classList.toggle("light", resolvedTheme === "light");
  }, [resolvedTheme]);

  return null;
}

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ReapplyThemeClass />
      {children}
    </NextThemesProvider>
  );
}
