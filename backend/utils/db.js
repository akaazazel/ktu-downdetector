import { Redis } from "@upstash/redis";
import "dotenv/config";

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const serverDown = async () => {
    try {
        await redis.set("uptime:status", 0);
        await redis.set("uptime:last_down_time", Date.now());
        await redis.set("uptime:last_check", Date.now());
    } catch (err) {
        console.log("Can't connect to Database!");
    }
};

export const serverUp = async () => {
    try {
        await redis.set("uptime:last_check", Date.now());

        const lastDown = await redis.get("uptime:last_down_time");
        const status = await redis.get("uptime:status");

        status === 0 &&
            (await redis.set(
                "uptime:last_down_duration",
                Date.now() - lastDown
            ));
        await redis.set("uptime:status", 1);
    } catch (err) {
        console.log("Can't connect to Database!");
    }
};

export const readHistory = async () => {
    try {
        const lastDownTime = await redis.get("uptime:last_down_time");
        const lastDownDuration = await redis.get("uptime:last_down_duration");
        const lastCheck = await redis.get("uptime:last_check");
        // const status = await redis.get("uptime:status");

        return {
            last_down_time: lastDownTime,
            last_down_duration: lastDownDuration,
            last_check: lastCheck,
            // status: status,
        };
    } catch (err) {
        console.log("Can't connect to Database!");
        return {
            last_down_time: null,
            last_down_duration: null,
            last_check: null,
            // status: null,
        };
    }
};

export const readStatus = async () => {
    try {
        const status = await redis.get("uptime:status");
        const code = await redis.get("uptime:code");
        const statusText = await redis.get("uptime:status_text");
        const latency = await redis.get("uptime:latency");

        return {
            status: status,
            code: code,
            statusText: statusText,
            latency: latency,
        };
    } catch (err) {
        console.log("Can't connect to Database!");
        return {
            status: null,
            code: null,
            statusText: null,
            latency: null,
        };
    }
};

export const storeDB = async (data) => {
    try {
        await redis.set("uptime:code", data.status);
        await redis.set("uptime:status_text", data.statusText);
        await redis.set("uptime:latency", data.latency);
    } catch (err) {
        console.log("Can't connect to Database!");
    }
};

export default readStatus;
