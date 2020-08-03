import proxy from "./proxy";

function es6<T extends object>(name: string, target: T) {
    const result = proxy(name, target);
    Object.defineProperty(target, "__esModule", { enumerable: false, value: true });
    Object.defineProperty(target, "default", { enumerable: false, value: result });

    return result;
}

export = es6("crypto", {});
