import { describe, expect, it } from "vitest";
import { mergeEnvFile, parseEnvFile } from "./bootstrap";

const example = `# Sanity project
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production

# Token
SANITY_API_READ_TOKEN=
`;

describe("parseEnvFile", () => {
  it("reads KEY=value lines and skips comments and blank lines", () => {
    expect(parseEnvFile(example)).toEqual({
      NEXT_PUBLIC_SANITY_PROJECT_ID: "",
      NEXT_PUBLIC_SANITY_DATASET: "production",
      SANITY_API_READ_TOKEN: "",
    });
  });

  it("strips matching quotes around a value", () => {
    expect(parseEnvFile(`A="one two"\nB='three'`)).toEqual({
      A: "one two",
      B: "three",
    });
  });
});

describe("mergeEnvFile", () => {
  it("fills empty values in place and keeps comments and order", () => {
    const { text } = mergeEnvFile(example, {
      NEXT_PUBLIC_SANITY_PROJECT_ID: "abc123",
      SANITY_API_READ_TOKEN: "sk_secret",
    });
    expect(text).toBe(`# Sanity project
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123
NEXT_PUBLIC_SANITY_DATASET=production

# Token
SANITY_API_READ_TOKEN=sk_secret
`);
  });

  it("reports which empty values it filled", () => {
    const { filled, added, updated } = mergeEnvFile(example, {
      NEXT_PUBLIC_SANITY_PROJECT_ID: "abc123",
    });
    expect({ filled, added, updated }).toEqual({
      filled: ["NEXT_PUBLIC_SANITY_PROJECT_ID"],
      added: [],
      updated: [],
    });
  });

  it("appends keys the file doesn't have yet", () => {
    const { text, added } = mergeEnvFile("A=1\n", { B: "2" });
    expect(text).toBe("A=1\nB=2\n");
    expect(added).toEqual(["B"]);
  });

  it("starts a file from nothing", () => {
    expect(mergeEnvFile("", { A: "1" }).text).toBe("A=1\n");
  });

  it("never overwrites a value that is already set, and reports it", () => {
    const { text, kept } = mergeEnvFile("A=old\n", { A: "new" });
    expect(text).toBe("A=old\n");
    expect(kept).toEqual(["A"]);
  });

  it("overwrites set values only when asked to", () => {
    const { text, updated } = mergeEnvFile(
      "A=old\n",
      { A: "new" },
      { overwrite: true },
    );
    expect(text).toBe("A=new\n");
    expect(updated).toEqual(["A"]);
  });

  it("quotes values with spaces or a hash", () => {
    expect(mergeEnvFile("", { A: "two words", B: "x#y" }).text).toBe(
      'A="two words"\nB="x#y"\n',
    );
  });
});
