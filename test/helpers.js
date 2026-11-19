/**
 * @file test/helpers.js
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FIXTURES = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures");

// Load a fixture file into the current happy-dom document.body
export function loadFixture(name) {
    document.body.innerHTML = fs.readFileSync(path.join(FIXTURES, name), "utf8");
}
