/**
 * @file src/offscreen/offscreen.js
 * 
 * JS functionality for the offscreen
 * document (i.e., play audio + handle runtime messages)
 */

import { isSoundMessage } from "../shared/messages.js";

export function createAudioPlayer({ document, logger = console }) {
    function play(target) {
        const template = document.getElementById(target);
        if (!template) {
            logger.log(`[SOJU] no sound mapped for target: ${target}`);
            return null;
        }

        const audio = template.cloneNode(true);
        audio.volume = template.volume;

        audio.addEventListener("ended", () => audio.remove());
        audio.addEventListener("error", (err) => {
            logger.log(`[SOJU] playback error for target ${target}:`, err);
            audio.remove();
        });

        Promise.resolve(audio.play()).catch((err) => {
            logger.log(`[SOJU] .play() failed for "${target}:"`, err);
        });
        return audio;
    }

    function handleMessage(message) {
        if (isSoundMessage(message)) {
            play(message.soundTarget);
        }
    }

    return {
        play,
        handleMessage
    };
}
