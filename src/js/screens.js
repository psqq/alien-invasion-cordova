
export function hideAll() {
    document.querySelector("#settings").classList.add('hidden');
    document.querySelector("#records").classList.add('hidden');
    document.querySelector("#container").classList.add('hidden');
    document.body.style.overflow = "hidden";
}
