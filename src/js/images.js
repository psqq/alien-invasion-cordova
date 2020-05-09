
export function loadImage(url) {
    return new Promise((res, rej) => {
        let img = new Image();
        img.onerror = err => rej(err);
        img.onload = () => res(img);
        img.src = url;
    });
}

export function loadAllImages() {
    const promises = [];
    for (let imageName in images) {
        const image = images[imageName];
        promises.push(loadImage(image.url).then((img) => {
            image.img = img;
        }));
    }
    return Promise.all(promises);
}

export async function init() {
    await loadAllImages();
}

/**
 * @param {string} name 
 * @param {string} url 
 */
function addImage(name, url) {
    return {
        [name]: {
            name,
            url: url || `assets/images/${name}.png`,
            /** @type {HTMLImageElement} */
            img: null,
        },
    };
}

const images = {
    ...addImage('sprites'),
};

export default images;

window.app = window.app || {};
window.app.images = images;
