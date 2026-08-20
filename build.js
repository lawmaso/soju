/*
    build.js

    A custom build script to avoid hardcoding values.

    Usage: node build.js
*/

import fs from "fs";
import path from "path";
import CONFIG from "./config.js";

const MANIFEST_TEMPLATE = "manifest.template.yaml";
const BUILD_SCRIPT = import.meta.filename.split("/").at(-1);
const DIST = "dist";
const EXCLUDE = new Set([DIST, MANIFEST_TEMPLATE]);

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
    fs.writeFileSync(`${DIST}/manifest.json`, manifest);
    for (const sojuFile of fs.readdirSync("./")) {
        if (
            sojuFile == BUILD_SCRIPT ||
            sojuFile.startsWith(".") ||
            EXCLUDE.has(sojuFile)
        ) {
            continue
        }

        fs.copyFileSync(sojuFile, `${DIST}/${sojuFile}`);
    }

    console.log(`Soju built successfully`);
} catch (err) {
    console.error(err);
}
