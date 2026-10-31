import { strings } from "@/lib/strings";

type TechStackItem = { name: string; category?: string | null };

type TechStackGroup = { category: string; items: string[] };

/**
 * Groups the tech stack by category, in the order categories first appear in
 * Settings. Items without a category are collected under "Other", last.
 */
export function groupTechStack(
  items: TechStackItem[] | null | undefined,
): TechStackGroup[] {
  const groups = new Map<string, string[]>();
  const uncategorised: string[] = [];

  for (const { name, category } of items ?? []) {
    const key = category?.trim();
    if (!key) {
      uncategorised.push(name);
      continue;
    }
    groups.set(key, [...(groups.get(key) ?? []), name]);
  }

  const result = [...groups].map(([category, names]) => ({
    category,
    items: names,
  }));
  return uncategorised.length
    ? [...result, { category: strings.work.otherTech, items: uncategorised }]
    : result;
}
