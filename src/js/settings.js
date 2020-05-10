import * as sounds from './sounds';
import * as screens from './screens';


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
    document.querySelector("#sounds-volume").value = settings.soundsVolume * 10;
    document.querySelector("#music-volume").value = settings.musicVolume * 10;
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
