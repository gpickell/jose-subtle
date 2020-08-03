function proxy<T extends object>(name: string, target: T): T {
    if (typeof __TracerProxy === "function") {
        return new __TracerProxy(name, target);
    }

    return target;
}

export default proxy;
