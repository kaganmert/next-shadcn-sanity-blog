import { describe, expect, it } from "vitest";
import { groupTechStack } from "./group-tech-stack";

describe("groupTechStack", () => {
  it("groups items by category in the order categories first appear, keeping item order", () => {
    expect(
      groupTechStack([
        { name: "TypeScript", category: "Languages" },
        { name: "Next.js", category: "Frameworks" },
        { name: "GROQ", category: "Languages" },
      ]),
    ).toEqual([
      { category: "Languages", items: ["TypeScript", "GROQ"] },
      { category: "Frameworks", items: ["Next.js"] },
    ]);
  });

  it("collects items without a category under Other, at the end", () => {
    expect(
      groupTechStack([
        { name: "Figma", category: null },
        { name: "React", category: "Frameworks" },
        { name: "Linear", category: "  " },
      ]),
    ).toEqual([
      { category: "Frameworks", items: ["React"] },
      { category: "Other", items: ["Figma", "Linear"] },
    ]);
  });

  it("returns no groups for an empty or missing stack", () => {
    expect(groupTechStack(null)).toEqual([]);
    expect(groupTechStack([])).toEqual([]);
  });
});
