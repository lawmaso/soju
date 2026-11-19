/**
 * @file test/offscreen.test.js
 * 
 * Offscreen document + audio playback unit tests.
 */

// @vitest-environment happy-dom
import { beforeEach, vi, describe, it, expect } from "vitest";
import { createAudioPlayer } from "../src/offscreen/offscreen.js";
import { stateMessage, soundMessage } from "../src/shared/messages.js";

let logger;
let player;

beforeEach(() => {
    document.body.innerHTML = `<audio id="on" /><audio id="off" />`;
    logger = { log: vi.fn() };
    player = createAudioPlayer({ document, logger });
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
});

describe("createAudioPlayer", () => {
    it("logs and does nothing for an uknown sound target", () => {
        const unknownTarget = "missing";

        expect(player.play(unknownTarget)).toBeNull();
        expect(logger.log).toHaveBeenCalledWith(expect.stringContaining(unknownTarget));
    });

    it("plays a clone of the mapped audio element", () => {
        for (const id of ["on", "off"]) {
            const audio = player.play(id);
            expect(audio).not.toBe(document.getElementById(id));
            expect(audio.play).toHaveBeenCalled();
        }
    });

    it("logs when playback is rejected", async () => {
        HTMLMediaElement.prototype.play.mockRejectedValueOnce(new Error("NotAllowed"));

        player.play("off");
        await new Promise((r) => setTimeout(r, 0));
        expect(logger.log).toHaveBeenCalledWith(expect.stringContaining(".play() failed"), expect.any(Error));
    });

    it("only handles sound messages", () => {
        const play = vi.spyOn(HTMLMediaElement.prototype, "cloneNode");

        player.handleMessage(stateMessage(true));
        expect(play).not.toHaveBeenCalled();

        player.handleMessage(soundMessage(true));
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    });
});
