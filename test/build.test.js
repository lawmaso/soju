/**
 * @file build.test.js
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { describe, it, expect, afterAll } from "vitest";

import { build, renderManifest } from "../scripts/build.js";
import CONFIG from "../src/config.js";

const template = fs.readFileSync(
    new URL("../manifest.template.json", import.meta.url),
    "utf8"
);

describe("renderManifest", () => {
    it("fills every placeholder from config", () => {
        const manifest = renderManifest(template, CONFIG);

        expect(manifest.name).toBe(CONFIG.NAME);
        expect(manifest.version).toBe(CONFIG.VERSION);
        expect(manifest.host_permissions).toEqual(CONFIG.MATCHES);
        expect(manifest.content_scripts[0]).toMatchObject({
            js: [CONFIG.CONTENT_SCRIPT],
            matches: CONFIG.MATCHES
        });
        expect(JSON.stringify(manifest)).not.toMatch(/__[A-Z_]+__/);
    });

    it("fails loudly on placeholder with no config value", () => {
        expect(() => renderManifest(`{"x": __MISSING__}`, CONFIG)).toThrow("__MISSING__");
    });
});

describe("build", () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "soju-dist-"));
    afterAll(() => fs.rmSync(outDir, { recursive: true }));

    it("writes only the runtime files", async () => {
        await build({ outDir });
        const files = fs.readdirSync(outDir, { recursive: true }).sort();

        expect(files).toEqual([
            "background.js",
            "content.js",
            "manifest.json",
            "offscreen.html",
            "offscreen.js",
            "sounds",
            path.join("sounds", "ui-click.mp3")
        ]);
    });

    it("bundles every file the manifest references", async () => {
        const manifest = JSON.parse(fs.readFileSync(path.join(outDir, "manifest.json"), "utf8"));
        const referenced = [
            manifest.background.service_worker,
            ...manifest.content_scripts[0].js
        ];

        for (const file of referenced) {
            expect(fs.existsSync(path.join(outDir, file))).toBe(true);
        }

        // NOTE: content scripts can't use ES module syntax
        expect(fs.readFileSync(path.join(outDir, "content.js"), "utf8")).not.toMatch(/^\s*(import|export)\s/m);
    });
});
