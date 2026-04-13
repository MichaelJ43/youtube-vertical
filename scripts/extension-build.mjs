import * as esbuild from "esbuild";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  cpSync,
  existsSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const target = process.argv[2] === "firefox" ? "firefox" : "chrome";
const watch = process.argv.includes("--watch");
const outDir = target === "firefox" ? "dist-firefox" : "dist-chrome";

function patchManifest() {
  const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
  const manifestPath =
    target === "firefox"
      ? resolve(root, "manifest.firefox.json")
      : resolve(root, "manifest.chrome.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  manifest.version = pkg.version;
  writeFileSync(
    resolve(root, outDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
}

function copyStatic() {
  mkdirSync(resolve(root, outDir, "popup"), { recursive: true });
  cpSync(
    resolve(root, "src/popup/popup.html"),
    resolve(root, outDir, "popup/popup.html"),
  );
  const icons = resolve(root, "public/icons");
  if (existsSync(icons)) {
    mkdirSync(resolve(root, outDir, "icons"), { recursive: true });
    cpSync(icons, resolve(root, outDir, "icons"), { recursive: true });
  }
}

const buildOptions = {
  entryPoints: {
    background: resolve(root, "src/background/service-worker.ts"),
    "content/youtube": resolve(root, "src/content/youtube.ts"),
    popup: resolve(root, "src/popup/popup.ts"),
  },
  outdir: resolve(root, outDir),
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  sourcemap: true,
  logLevel: "info",
};

async function run() {
  mkdirSync(resolve(root, outDir), { recursive: true });

  if (watch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    patchManifest();
    copyStatic();
    console.info(`Watching ${outDir}…`);
  } else {
    await esbuild.build(buildOptions);
    patchManifest();
    copyStatic();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
