/**
 * @file scripts/build.js
 * 
 * Builds the unpacked extension into dist.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as esbuild from "esbuild";

import CONFIG from "../src/config.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const MANIFEST_TEMPLATE = path.join(ROOT, "manifest.template.json");

export const ENTRY_POINTS = {
    "background.js": {
        source: "src/background/index.js",
        format: "esm"
    },
    [CONFIG.CONTENT_SCRIPT]: {
        source: "src/content/index.js",
        format: "iife"
    },
    "offscreen.js": {
        source: "src/offscreen/index.js",
        format: "iife"
    }
};

export const STATIC_FILES = {
    [CONFIG.OFFSCREEN_PAGE]: "src/offscreen/offscreen.html",
    sounds: "sounds"
};

export function renderManifest(template, config) {
    let manifest = template;

    for (const [key, value] of Object.entries(config)) {
        manifest = manifest.replaceAll(
            `__${key}__`,
            JSON.stringify(value)
        );
    }

    const leftover = manifest.match(/__[A-Z_]+__/);
    if (leftover) {
        throw new Error(`manifest placeholder ${leftover[0]} has no value in config`);
    }

    return JSON.parse(manifest);
}

export async function build({ outDir = DIST, config = CONFIG } = {}) {
    fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });

    const manifest = renderManifest(
        fs.readFileSync(MANIFEST_TEMPLATE, "utf8"),
        config
    );

    fs.writeFileSync(
        path.join(outDir, "manifest.json"),
        JSON.stringify(manifest, null, 4)
    );

    await Promise.all(
        Object.entries(ENTRY_POINTS).map(([outFile, { source, format }]) =>
            esbuild.build({
                entryPoints: [path.join(ROOT, source)],
                outfile: path.join(outDir, outFile),
                bundle: true,
                format: format,
                target: "chrome116",
                logLevel: "warning"
            })
        )
    );

    for (const [dst, src] of Object.entries(STATIC_FILES)) {
        fs.cpSync(
            path.join(ROOT, src),
            path.join(outDir, dst),
            { recursive: true }
        );
    }
}

if (process.argv[1] == fileURLToPath(import.meta.url)) {
    build()
        .then(() => console.log("Soju built succesfully"))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}
