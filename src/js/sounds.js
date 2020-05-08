import { Howl, Howler } from 'howler';

var muteFlag = true;

var sounds = {};

function addSound(name, www_fn, loop = false, volume = 1) {
    var fn = www_fn;
    if (device.platform == "Android") {
        fn = "file:///android_asset/www/" + www_fn;
    } else if (device.platform == "browser") {
        fn = "../" + www_fn;
    }
    sounds[name] = new Howl({ src: [fn], loop, volume });
}

export function init() {
    addSound("explosion1", "assets/opengameart/space-battle-game-sounds-astromenace/sfx/explosion1.wav");
    addSound("explosion2", "assets/opengameart/space-battle-game-sounds-astromenace/sfx/explosion2.wav");
    addSound("explosion3", "assets/opengameart/space-battle-game-sounds-astromenace/sfx/explosion3.wav");
    addSound("explosion4", "assets/opengameart/space-battle-game-sounds-astromenace/sfx/explosion4.wav");
    addSound("fire", "assets/opengameart/space-battle-game-sounds-astromenace/sfx/weaponfire6.wav");
    addSound("music", "assets/opengameart/Orbital Colossus.mp3");
}

export function play(name, o) {
    var id = sounds[name].play();
    o = o || {};
    if (o.volume) {
        sounds[name].volume(o.volume, id);
    }
    if (o.loop) {
        sounds[name].loop(true, id);
    }
    return id;
}

export function toggleMuteAll() {
    Howler.mute(muteFlag);
    muteFlag = !muteFlag;
}

window.app = window.app || {};
window.app.playSound = play;
window.app.sounds = sounds;
