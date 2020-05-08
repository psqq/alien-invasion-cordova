import * as sounds from './sounds';


const app = {
    gameStarted: false,
    main() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    async onDeviceReady() {
        await this.preload();
        await this.init();
        await this.run();
    },
    async preload() {
        sounds.init();
    },
    async init() {
        window.screen.orientation.lock('portrait');
        // eslint-disable-next-line no-undef
        console.log(device);
    },
    isPortrait() {
        return screen.orientation.type === 'portrait' || screen.orientation.type === 'portrait-primary' || screen.orientation.type === 'portrait-secondary';
    },
    async run() {
        this.__startGame();
    },
    async __startGame() {
        if (this.gameStarted) {
            return;
        }
        for (; ;) {
            try {
                await this.waitPortrait();
                break;
            } catch (e) {
                alert("Please rotate the device and then click OK");
            }
        }
        // eslint-disable-next-line no-undef
        _startGame();
        this.gameStarted = true;
        this.hideLoading();
    },
    waitPortrait() {
        return new Promise((res, rej) => {
            let i = 0;
            const go = () => {
                i++;
                if (i > 3) {
                    return rej();
                }
                const w = window.innerWidth, h = window.innerHeight;
                if (w > h) {
                    setTimeout(go, 300);
                } else {
                    return res();
                }
            };
            setTimeout(go, 300);
        });
    },
    hideLoading() {
        document.querySelector("#loading").classList.add('hidden');
        document.querySelector("#container").classList.remove('hidden');
    }
};

export default app;
