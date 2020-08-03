const _process = process;
Object.assign(_process, {
    browser: true,
    noDeprecation: false,
    version: "v12.10.2",
    versions: {
        "jose": "0.0.0",
        "jose-subtle": "0.0.0",
    }
});

export { _process as process };
