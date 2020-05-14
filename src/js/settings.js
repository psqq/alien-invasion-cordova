import * as sounds from './sounds';
import * as screens from './screens';

const defaultSettings = {
    soundsVolume: 1,
    musicVolume: 1,
    difficulty: 1,
};

let settings = defaultSettings;

export function getSettings() {
    settings = JSON.parse(localStorage.getItem("settings")) || settings;
    settings = Object.assign({}, defaultSettings, settings);
    window.app.settings = settings;
    return settings;
}

export function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settings));
}

export function applySettings() {
    sounds.setVolumeForGroup('music', settings.musicVolume);
    sounds.setVolumeForGroup('sounds', settings.soundsVolume);
    document.querySelector("#sounds-volume").value = settings.soundsVolume * 10;
    document.querySelector("#music-volume").value = settings.musicVolume * 10;
    document.querySelector("#settings .difficulty").value = settings.difficulty;
}

export function init() {
    getSettings();
    applySettings();
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
    document.querySelector("#settings .difficulty").addEventListener("input", ev => {
        settings.difficulty = parseInt(ev.target.value);
        saveSettings();
    });
    document.querySelector(".settings-btn").addEventListener("click", () => {
        toggle();
    });
}

export function show() {
    screens.hideAll();
    document.querySelector("#settings").classList.remove('hidden');
    Game.pause = true;
}

export function hide() {
    screens.hideAll();
    document.querySelector("#container").classList.remove('hidden');
    Game.pause = false;
}

export function toggle() {
    if (document.querySelector("#settings").classList.contains('hidden')) {
        show();
    } else {
        hide();
    }
}

window.app = window.app || {};
window.app.settings = settings;
