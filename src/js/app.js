
const app = {
    main() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    async onDeviceReady() {
        await this.preload();
        await this.init();
        this.run();
    },
    async preload() {
    },
    async init() {
    },
    run() {
    },
};

export default app;
