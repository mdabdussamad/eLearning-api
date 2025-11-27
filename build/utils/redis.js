"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/utils/redis.ts
const ioredis_1 = require("ioredis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is missing in environment variables!");
}
const redis = new ioredis_1.Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    connectTimeout: 10000,
    reconnectOnError: (err) => {
        const errorsToReconnect = ["ECONNRESET", "ETIMEDOUT", "ECONNREFUSED"];
        if (errorsToReconnect.some(e => err.message.includes(e))) {
            console.warn("[Redis] Connection lost → attempting reconnect...");
            return true;
        }
        return false;
    },
    retryStrategy: (times) => {
        if (times > 10)
            return null;
        return Math.min(times * 500, 5000);
    },
});
// Prevent unhandled ECONNRESET crash
redis.on("error", (err) => {
    console.warn("[Redis] Error (handled):", err.message || err);
});
redis.on("connect", () => {
    console.log("✅ Redis connected successfully");
});
// Fixed line – no more TS error
redis.on("reconnecting", () => {
    console.log("[Redis] Reconnecting to Redis...");
});
redis.on("ready", () => {
    console.log("✅ Redis is ready");
});
redis.on("close", () => {
    console.log("[Redis] Connection closed");
});
redis.on("end", () => {
    console.log("[Redis] Redis connection ended");
});
exports.default = redis;
