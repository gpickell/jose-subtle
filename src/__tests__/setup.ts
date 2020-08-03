import { Crypto } from "node-webcrypto-ossl";
import { resolve } from "path";
import pupp from "puppeteer";

const unbounds = new Set<string>();
let close = () => undefined as any;

declare global {
    const page: pupp.Page;
}

function __TracerProxy<T extends object>(name: string, target: T) {
    return new Proxy<T>(target, {
        get(target, key, receiver) {
            if (!Reflect.has(target, key)) {
                unbounds.add(`${name}.${String(key)}`);
            }

            return Reflect.get(target, key, receiver);
        }
    });
}

beforeEach(async function () {
    if (typeof jose === "undefined") {
        await init();
    }
});

afterAll(async function () {
    if (unbounds.size > 0) {
        console.log("unbounds:", unbounds);
    }

    await close();
});

async function init() {
    const browser = await pupp.launch();
    close = () => browser.close();

    const page = await browser.newPage();
    await page.goto("http://localhost");

    await page.addScriptTag({
        path: resolve(__dirname, "../index.js")
    });

    Object.assign(global, {
        crypto: new Crypto(),
        __TracerProxy,
    });

    Object.assign(global, {
        jose: require("jose"),
        page,
    });
}
