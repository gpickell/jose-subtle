const { resolve } = require("path");
const { ProvidePlugin } = require("webpack");

function config() {
    const set = new Set();
    function getExternal(value) {
        value = value.replace(/[\\/]+/g, "/");

        var parts = value.split("/node_modules/@");
        if (parts.length > 1) {
            const [x, y] = parts[1].split("/");
            return `@${x}/${y}`;
        }

        var parts = value.split("/node_modules/");
        if (parts.length > 1) {
            return parts[1].split("/")[0];
        }

        if (value.indexOf("/src/") >= 0) {
            return "src";
        }

        return "???"
    }

    const main = {
        entry: "./src/index.ts",
        mode: "development",
        devtool: "source-map",

        output: {
            filename: "index.js",
            library: "jose",
            libraryTarget: "umd",
            globalObject: "this",
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: "ts-loader"
                }
            ]
        },

        resolve: {
            alias: {
                crypto: resolve(__dirname, "src/crypto.ts"),
            },

            extensions: [
                ".js",
                ".ts",
            ]
        },

        externals(context, request, callback) {
            const module = getExternal(context);
            if (module !== undefined && !set.has(module)) {
                set.add(module);
                console.log("--- %s", module);
            }
            
            callback(null);
        },
    };

    const jest = {
        entry: "./src/__tests__/index.test.ts",
        mode: "development",
        devtool: "source-map",
        target: "node",
        node: false,

        output: {
            filename: "index.test.js",
            path: resolve(__dirname, "dist/__tests__"),
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: "ts-loader"
                }
            ]
        },

        resolve: {
            extensions: [
                ".js",
                ".ts",
            ]
        },

        externals(context, request, callback) {
            if (request[0] !== ".") {
                if (request === "jose") {
                    request = "jose-subtle";
                }

                if (request === "jose-subtle") {
                    request = resolve(__dirname, "dist/index.js");
                }

                callback(null, "commonjs " + request);
            } else {
                callback(null);
            }
        },
    };

    return [main, jest];
}

module.exports = config;
