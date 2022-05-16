export default class FrameRates {
    #prevFrame;
    #currentFrame;
    #callFn = () => {};

    static toFps(fpms) {
        return 1000 / fpms;
    }

    constructor(callFn) {
        this.#callFn = callFn || this.#callFn;
        this.isStarted = false;
    }

    #callFrame = () => {
        if (!this.isStarted) return;
        
        this.#timeBetweenCalls();
        this.#callFn();

        window.requestAnimationFrame(this.#callFrame);
    }

    #timeBetweenCalls = () => {
        const newFrame = performance.now();
        this.#currentFrame = newFrame - this.#prevFrame;

        this.#prevFrame = newFrame;
    }

    setCallFn(callFn) {
        this.#callFn = callFn;
    }

    /**
     * start frame calling
     */
    start = () => {
        this.isStarted = true
        this.#callFrame();
    }
    /**
     * stop frame calling
     */
    stop = () => {
        this.isStarted = false;
    }
    /**
     * get fps
     */
    getFPMS = () => {
        if (!this.#currentFrame) return Number.MAX_SAFE_INTEGER;

        return this.#currentFrame;
    }
}