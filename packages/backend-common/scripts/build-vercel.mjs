import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(packageRoot, "..", "..");

const command = process.env.npm_execpath ? process.execPath : process.platform === "win32" ? "npm.cmd" : "npm";
const args = process.env.npm_execpath
  ? [process.env.npm_execpath, "run", "build:vercel"]
  : ["run", "build:vercel"];

execFileSync(command, args, {
  cwd: repoRoot,
  stdio: "inherit"
});

const sourceDist = resolve(repoRoot, "apps", "web", "dist");
const fallbackDist = resolve(packageRoot, "apps", "web", "dist");

rmSync(fallbackDist, { force: true, recursive: true });
mkdirSync(dirname(fallbackDist), { recursive: true });
cpSync(sourceDist, fallbackDist, { recursive: true });
