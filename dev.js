/**
 * dev.js — Custom dev launcher for Bharat Bhoomi
 * Works on Windows without relying on PATH cmd.exe resolution.
 */
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isWin = process.platform === "win32";

// ── Colour helpers ────────────────────────────────────────────
const C = {
  cyan:    "\x1b[36m",
  magenta: "\x1b[35m",
  reset:   "\x1b[0m",
  bold:    "\x1b[1m",
};

function prefix(label, color) {
  return `${color}${C.bold}[${label}]${C.reset} `;
}

// ── Process spawner ───────────────────────────────────────────
const procs = [];

function run(label, color, cmd, args = [], useShell = false) {
  const proc = spawn(cmd, args, {
    cwd: __dirname,
    stdio: "pipe",
    shell: useShell,
    windowsHide: true,
    env: { ...process.env },
  });

  const pre = prefix(label, color);

  proc.stdout.on("data", (chunk) => {
    chunk.toString().split("\n").filter(Boolean).forEach((line) => {
      process.stdout.write(pre + line + "\n");
    });
  });

  proc.stderr.on("data", (chunk) => {
    chunk.toString().split("\n").filter(Boolean).forEach((line) => {
      process.stderr.write(pre + line + "\n");
    });
  });

  proc.on("close", (code) => {
    console.log(`\n${pre}process exited (code ${code ?? 0})`);
    procs.forEach((p) => { try { p.kill(); } catch (_) {} });
    process.exit(code ?? 0);
  });

  proc.on("error", (err) => {
    console.error(`${pre}Failed to start: ${err.message}`);
    procs.forEach((p) => { try { p.kill(); } catch (_) {} });
    process.exit(1);
  });

  procs.push(proc);
  return proc;
}

// ── Resolve executables ───────────────────────────────────────
const nodeExe  = process.execPath;   // e.g. C:\Program Files\nodejs\node.exe

// For vite on Windows, we use node to directly run vite's CLI entry
// instead of the .cmd wrapper — avoids cmd.exe dependency entirely
const viteMain = path.join(__dirname, "node_modules", "vite", "bin", "vite.js");
const viteFallback = path.join(__dirname, "node_modules", ".bin", "vite");

const viteArgs = existsSync(viteMain)
  ? [viteMain]                          // node vite/bin/vite.js
  : [viteFallback];                     // fallback

console.log(`\n${C.bold}🇮🇳 Bharat Bhoomi — Dev Server${C.reset}`);
console.log(`${C.cyan}  Backend${C.reset}  → http://localhost:5000`);
console.log(`${C.magenta}  Frontend${C.reset} → http://localhost:5173\n`);

// ── Launch both — both via node directly, no shell ────────────
run("server", C.cyan,    nodeExe, ["server/index.js"]);
run("vite",   C.magenta, nodeExe, viteArgs);

// ── Graceful shutdown ─────────────────────────────────────────
function shutdown() {
  procs.forEach((p) => { try { p.kill(); } catch (_) {} });
  process.exit(0);
}
process.on("SIGINT",  shutdown);
process.on("SIGTERM", shutdown);
