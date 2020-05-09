import * as sounds from './sounds';


let settingsShowed = false;
let settings = {
    soundsVolume: 1,
    musicVolume: 1,
};

export function getSettings() {
    settings = JSON.parse(localStorage.getItem("settings")) || settings;
    return settings;
}

export function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settings));
}

export function applySettings() {
    sounds.setVolumeForGroup('music', settings.musicVolume);
    sounds.setVolumeForGroup('sounds', settings.soundsVolume);
}

export function init() {
    getSettings();
    document.querySelector("#sounds-volume").addEventListener("input", ev => {
        settings.soundsVolume = parseInt(ev.target.value) / 10;
        applySettings();
        saveSettings();
    });
    document.querySelector("#music-volume").addEventListener("input", ev => {
        settings.musicVolume = parseInt(ev.target.value) / 10;
        applySettings();
        saveSettings();
    });
    document.querySelector(".settings-btn").addEventListener("click", () => {
        toggleSettings();
    });
}

export function showSettings() {
    document.querySelector("#settings").classList.remove('hidden');
    document.querySelector("#container").classList.add('hidden');
    settingsShowed = true;
    Game.pause = true;
}

export function hideSettings() {
    document.querySelector("#settings").classList.add('hidden');
    document.querySelector("#container").classList.remove('hidden');
    settingsShowed = false;
    Game.pause = false;
}

export function toggleSettings() {
    if (settingsShowed) {
        hideSettings();
    } else {
        showSettings();
    }
}
