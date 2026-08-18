/*
    build.js

    A custom build script to avoid hardcoding values.

    Usage: node build.js
*/

import fs from "fs";
import path from "path";
import CONFIG from "./config.js";

try {
    let manifest = fs.readFileSync("./manifest.template.yaml", "utf8");

    for (const [key, value] of Object.entries(CONFIG)) {
        manifest = manifest.replaceAll(`__${key}__`, JSON.stringify(value));
    }

    JSON.parse(manifest);
    fs.writeFileSync("./manifest.json", manifest);
} catch (err) {
    console.error(err);
}
