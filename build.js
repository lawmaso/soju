/*
    build.js

    A custom build script to avoid hardcoding values.

    Usage: node build.js
*/

import fs from "fs";
import CONFIG from "./config.js";

const MANIFEST_TEMPLATE = "manifest.template.yaml";
const BUILD_SCRIPT = import.meta.filename.split("/").at(-1);
const DIST = "dist";
const SOUNDS = "sounds";
const EXCLUDE = new Set([DIST, MANIFEST_TEMPLATE, "README.md", "soju.excalidraw"]);

try {
    let manifest = fs.readFileSync(MANIFEST_TEMPLATE, "utf8");

    for (const [key, value] of Object.entries(CONFIG)) {
        manifest = manifest.replaceAll(`__${key}__`, JSON.stringify(value));
    }

    JSON.parse(manifest);

    if (fs.existsSync(DIST)) {
        fs.rmSync(DIST, { recursive: true, force: true });
    }

    fs.mkdirSync(DIST);
    fs.writeFileSync(DIST.concat("/manifest.json"), manifest);
    for (const sojuFile of fs.readdirSync("./")) {
        if (
            sojuFile == BUILD_SCRIPT ||
            sojuFile.startsWith(".") ||
            EXCLUDE.has(sojuFile)
        ) {
            continue;
        }

        if (sojuFile == SOUNDS) {
            const distSoundDir = DIST.concat(`/${SOUNDS}`);
            fs.mkdirSync(distSoundDir);

            for (const soundFile of fs.readdirSync(sojuFile)) {
                fs.copyFileSync(
                    sojuFile.concat(`/${soundFile}`),
                    distSoundDir.concat(`/${soundFile}`)
                );
            }

            continue;
        }
        fs.copyFileSync(sojuFile, DIST.concat(`/${sojuFile}`));
    }

    console.log(`Soju built successfully`);
} catch (err) {
    console.error(err);
}
