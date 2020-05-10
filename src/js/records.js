import * as screens from './screens';


export function init() {
    document.querySelector(".records-btn").addEventListener("click", () => {
        toggle();
    });
}

export function show() {
    screens.hideAll();
    document.querySelector("#records").classList.remove('hidden');
    Game.pause = true;
    document.body.style.overflow = "auto";
}

export function hide() {
    screens.hideAll();
    document.querySelector("#container").classList.remove('hidden');
    Game.pause = false;
}

export function toggle() {
    if (document.querySelector("#records").classList.contains('hidden')) {
        show();
    } else {
        hide();
    }
}
