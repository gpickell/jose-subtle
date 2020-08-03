require("./setup");

const tests = require.context("./facets/", false, /\.ts$/);
tests.keys().forEach(tests);

export default undefined;
