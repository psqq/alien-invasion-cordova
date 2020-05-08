import { Howl, Howler } from 'howler';

var muteSoundsFlag = false;
var muteMusicFlag = false;
var muteFlag = false;

var sounds = {};

function addSound(name, fn, loop = false, volume = 1) {
    sounds[name] = new Howl({ src: [fn], loop, volume });
}

export function init() {
    addSound("explosion1", "/assets/opengameart/space-battle-game-sounds-astromenace/sfx/explosion1.wav");
    addSound("fire", "/assets/opengameart/space-battle-game-sounds-astromenace/sfx/weaponfire6.wav");
}

function play(name, o) {
    var id = sounds[name].play();
    o = o || {};
    if (o.volume) {
        sounds[name].volume(o.volume, id);
    }
    return id;
}

function toggleMuteAll() {
    Howler.mute(muteFlag);
    muteFlag = !muteFlag;
}

window.app = window.app || {};
window.app.playSound = play;
