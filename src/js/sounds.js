import { Howl, Howler } from 'howler';

var muteFlag = true;

var sounds = {};
var groups = { all: [] };

function addSound(name, www_fn, { loop = false, volume = 1, group = null }) {
    return new Promise((res, rej) => {
        var fn = www_fn;
        if (device.platform == "Android") {
            fn = "file:///android_asset/www/" + www_fn;
        } else if (device.platform == "browser") {
            fn = "../" + www_fn;
        }
        sounds[name] = {
            howl: new Howl({ src: [fn], loop, volume }),
            volume,
            loop,
            group,
        };
        sounds[name].howl.once('load', () => res());
        sounds[name].howl.once('loaderror', (err) => rej(err));
        if (group) {
            if (!groups[group]) groups[group] = [];
            groups[group].push(sounds[name]);
        }
        groups["all"].push(sounds[name]);
    });
}

export async function init() {
    const promises = [
        addSound("explosion1", "assets/opengameart/space-battle-game-sounds-astromenace/sfx/explosion1.wav", { group: 'sounds' }),
        addSound("explosion2", "assets/opengameart/space-battle-game-sounds-astromenace/sfx/explosion2.wav", { group: 'sounds' }),
        addSound("explosion3", "assets/opengameart/space-battle-game-sounds-astromenace/sfx/explosion3.wav", { group: 'sounds' }),
        addSound("explosion4", "assets/opengameart/space-battle-game-sounds-astromenace/sfx/explosion4.wav", { group: 'sounds' }),
        addSound("fire", "assets/opengameart/space-battle-game-sounds-astromenace/sfx/weaponfire6.wav", { group: 'sounds' }),
        addSound("music", "assets/opengameart/Orbital Colossus.mp3", { group: 'music', loop: true }),
    ];
    await Promise.all(promises);
}

export function play(name, o) {
    var id = sounds[name].howl.play();
    o = o || {};
    if (o.volume) {
        sounds[name].howl.volume(o.volume, id);
    }
    if (o.loop) {
        sounds[name].howl.loop(true, id);
    }
    return id;
}

export function setVolumeForGroup(groupName, volume = 1) {
    for (var sound of groups[groupName]) {
        sound.howl.volume(sound.volume * volume);
    }
}

export function toggleMuteAll() {
    Howler.mute(muteFlag);
    muteFlag = !muteFlag;
}

export function muteAll() {
    Howler.mute(true);
}

export function unmuteAll() {
    Howler.mute(false);
}

window.app = window.app || {};
window.app.playSound = play;
window.app.sounds = sounds;
