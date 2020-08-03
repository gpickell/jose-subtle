import * as index from "./index";

declare global {
    namespace globalThis {
        export import jose = index;
    }
}
