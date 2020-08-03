export * from "./critical";

import "./key";
import "./misc";

import crypto from "crypto";
import os from "os";
import stream from "stream";
import zlib from "zlib";
export { crypto, os, stream, zlib };

export * from "jose";
import jose from "jose";
export { jose };
export default jose;
