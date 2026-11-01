/**
 * `pnpm bootstrap`: from a fresh clone to a running site in one command.
 *
 * Logs in to Sanity, creates (or reuses) a project and dataset, creates a
 * viewer token, allows the local origin in CORS, fills in `.env.local` and
 * optionally imports the sample content. Safe to re-run: it reuses what is
 * already configured and never overwrites a value in `.env.local` unless you
 * agree to.
 *
 * Runs with plain Node (24+ strips the types), so it has no dependencies.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// .env files (pure, tested)
// ---------------------------------------------------------------------------

const LINE = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/;

function unquote(value: string): string {
  const quoted = /^(["'])(.*)\1$/.exec(value);
  return quoted ? quoted[2] : value;
}

function formatValue(value: string): string {
  return /[\s#"']/.test(value) ? `"${value.replaceAll('"', '\\"')}"` : value;
}

/** KEY=value pairs from a .env file; comments and blank lines are skipped. */
export function parseEnvFile(text: string): Record<string, string> {
  const values: Record<string, string> = {};
  for (const line of text.split("\n")) {
    if (line.trimStart().startsWith("#")) continue;
    const match = LINE.exec(line);
    if (match) values[match[1]] = unquote(match[2]);
  }
  return values;
}

/**
 * Writes `updates` into a .env file's text, keeping comments and order.
 * Empty values are filled in place, missing keys are appended, and a value
 * that is already set is kept unless `overwrite` is true.
 */
export function mergeEnvFile(
  text: string,
  updates: Record<string, string>,
  { overwrite = false }: { overwrite?: boolean } = {},
) {
  const pending = new Map(Object.entries(updates));
  const kept: string[] = [];
  const updated: string[] = [];

  const lines = (text === "" ? [] : text.replace(/\n$/, "").split("\n")).map(
    (line) => {
      const match = line.trimStart().startsWith("#") ? null : LINE.exec(line);
      if (!match || !pending.has(match[1])) return line;
      const key = match[1];
      const next = pending.get(key) ?? "";
      pending.delete(key);
      const current = unquote(match[2]);
      if (current === next) return line;
      if (current !== "" && !overwrite) {
        kept.push(key);
        return line;
      }
      if (current !== "") updated.push(key);
      return `${key}=${formatValue(next)}`;
    },
  );

  const added = [...pending.keys()];
  for (const [key, value] of pending)
    lines.push(`${key}=${formatValue(value)}`);

  return { text: `${lines.join("\n")}\n`, added, kept, updated };
}

// ---------------------------------------------------------------------------
// The interactive run
// ---------------------------------------------------------------------------

const ENV_FILE = ".env.local";
const EXAMPLE_FILE = ".env.example";
const LOCAL_ORIGIN = "http://localhost:3000";
const DATASET = "production";

const step = (text: string) => console.log(`\n→ ${text}`);
const done = (text: string) => console.log(`  ✓ ${text}`);

/** Runs the project's Sanity CLI. `inherit` hands the terminal over (for login). */
function sanity(
  args: string[],
  {
    env = {},
    inherit = false,
  }: { env?: Record<string, string>; inherit?: boolean } = {},
) {
  const result = spawnSync("pnpm", ["exec", "sanity", ...args], {
    encoding: "utf8",
    stdio: inherit ? "inherit" : "pipe",
    env: { ...process.env, ...env },
  });
  return {
    ok: result.status === 0,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

/** The first JSON object in CLI output (the CLI may print notices before it). */
function readJson<T>(output: string): T {
  return JSON.parse(output.slice(output.indexOf("{"))) as T;
}

function fail(message: string, detail?: string): never {
  console.error(`\n✗ ${message}`);
  if (detail?.trim()) console.error(detail.trim());
  process.exit(1);
}

async function main() {
  const yes = process.argv.includes("--yes");
  const rl = createInterface({ input: stdin, output: stdout });
  const ask = async (question: string, fallback: string) => {
    if (yes) return fallback;
    const answer = (await rl.question(`  ${question} `)).trim();
    return answer || fallback;
  };
  const confirm = async (question: string, fallback: boolean) =>
    /^y/i.test(
      await ask(
        `${question} ${fallback ? "[Y/n]" : "[y/N]"}`,
        fallback ? "y" : "n",
      ),
    );

  console.log("next-shadcn-sanity-blog: project setup");

  const envText = existsSync(ENV_FILE)
    ? readFileSync(ENV_FILE, "utf8")
    : existsSync(EXAMPLE_FILE)
      ? readFileSync(EXAMPLE_FILE, "utf8")
      : "";
  const env = parseEnvFile(existsSync(ENV_FILE) ? envText : "");

  // 1. Sanity login.
  step("Checking your Sanity login");
  if (!sanity(["projects", "list"]).ok) {
    console.log("  Not logged in. Opening the Sanity login…");
    if (!sanity(["login"], { inherit: true }).ok) fail("Sanity login failed.");
  }
  done("Logged in");

  // 2. Project and dataset.
  step("Sanity project");
  let projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
  let isNewProject = false;
  if (
    projectId &&
    (await confirm(`Use the project in ${ENV_FILE} (${projectId})?`, true))
  ) {
    done(`Using ${projectId}`);
  } else {
    const answer = await ask(
      "Name for a new project, or an existing project ID (default: my-blog):",
      "my-blog",
    );
    if (/^[a-z0-9]{8}$/.test(answer)) {
      projectId = answer;
      done(`Using ${projectId}`);
    } else {
      const created = sanity([
        "projects",
        "create",
        answer,
        "--dataset",
        DATASET,
        "--dataset-visibility",
        "public",
        "--json",
      ]);
      if (!created.ok) fail("Could not create the project.", created.stderr);
      projectId = readJson<{ projectId: string }>(created.stdout).projectId;
      isNewProject = true;
      done(
        `Created "${answer}" (${projectId}) with a public "${DATASET}" dataset`,
      );
    }
  }
  const projectEnv = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: projectId,
    NEXT_PUBLIC_SANITY_DATASET: env.NEXT_PUBLIC_SANITY_DATASET || DATASET,
  };

  // 3. Viewer token (draft mode and Visual Editing).
  step("Viewer token");
  let token = isNewProject ? "" : (env.SANITY_API_READ_TOKEN ?? "");
  if (token) {
    done(`Keeping the token in ${ENV_FILE}`);
  } else {
    const created = sanity([
      "tokens",
      "add",
      "next-app-viewer",
      "--role",
      "viewer",
      "--project",
      projectId,
      "--json",
      "--yes",
    ]);
    if (!created.ok) fail("Could not create a viewer token.", created.stderr);
    token = readJson<{ token: string }>(created.stdout).token;
    done('Created "next-app-viewer"');
  }

  // 4. CORS, so the embedded Studio can sign in locally.
  step(`CORS origin ${LOCAL_ORIGIN}`);
  const origins = sanity(["cors", "list", "--project", projectId]);
  if (
    origins.ok &&
    origins.stdout.split("\n").some((line) => line.trim() === LOCAL_ORIGIN)
  ) {
    done("Already allowed");
  } else {
    const added = sanity([
      "cors",
      "add",
      LOCAL_ORIGIN,
      "--credentials",
      "--project",
      projectId,
    ]);
    if (!added.ok && !/Duplicate origin/i.test(added.stderr))
      fail("Could not add the CORS origin.", added.stderr);
    done("Allowed, with credentials");
  }

  // 5. .env.local.
  step(`Writing ${ENV_FILE}`);
  const updates = { ...projectEnv, SANITY_API_READ_TOKEN: token };
  let merged = mergeEnvFile(envText, updates, { overwrite: isNewProject });
  if (merged.kept.length) {
    const overwrite = await confirm(
      `${merged.kept.join(", ")} already set to other values. Overwrite?`,
      false,
    );
    if (overwrite) merged = mergeEnvFile(envText, updates, { overwrite: true });
  }
  writeFileSync(ENV_FILE, merged.text);
  done(
    [
      merged.added.length && `added ${merged.added.join(", ")}`,
      merged.updated.length && `updated ${merged.updated.join(", ")}`,
      !merged.added.length && !merged.updated.length && "nothing to change",
    ]
      .filter(Boolean)
      .join("; "),
  );

  // 6. Sample content.
  step("Sample content");
  if (
    await confirm(
      "Import the sample posts, projects and settings?",
      isNewProject,
    )
  ) {
    const seeded = sanity(
      [
        "dataset",
        "import",
        "sanity/seed/data.ndjson",
        "--dataset",
        projectEnv.NEXT_PUBLIC_SANITY_DATASET,
        "--replace",
      ],
      { env: projectEnv, inherit: true },
    );
    if (!seeded.ok) fail("The sample import failed.");
    done("Imported");
  } else {
    done("Skipped");
  }

  rl.close();
  console.log(
    `\nAll set. Run \`pnpm dev\`: the site is on ${LOCAL_ORIGIN} and the Studio on ${LOCAL_ORIGIN}/studio.`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
