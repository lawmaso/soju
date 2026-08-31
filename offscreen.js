const soundMap = {
    on: document.getElementById("on"),
    off: document.getElementById("off")
};

function playSound(target) {
    const template = soundMap[target];
    if (!template) {
        console.log(`[soju] No sound mapped for target: ${target}`);
        return;
    }

    const audio = template.cloneNode(true);
    audio.volume = template.volume;

    audio.addEventListener("ended", () => audio.remove());
    audio.addEventListener("error", (err) => {
        console.log(`[soju] Playback error for target ${target}:`, err)
        audio.remove();
    });

    audio.play().catch((err) => {
        console.log(`[soju] play() failed for "${target}":`, err);
    })
}

chrome.runtime.onMessage.addListener(async (message) => {
    if (message.target !== "offscreen") {
        return;
    }

    playSound(message.soundTarget);
});

