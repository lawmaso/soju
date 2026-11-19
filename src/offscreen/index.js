/**
 * @file src/offscreen/index.js
 * 
 * Offscreen document entrypoint; bundled
 * as a classic script.
 */

import { createAudioPlayer } from "./offscreen";

const player = createAudioPlayer({ document });
chrome.runtime.onMessage.addListener(player.handleMessage);
