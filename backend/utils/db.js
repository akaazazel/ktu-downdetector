import { Redis } from "@upstash/redis";
import "dotenv/config";

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const serverDown = async () => {
    try {
        await redis.set("uptime:last_down_time", Date.now());
        await redis.set("uptime:last_check", Date.now());
        await redis.set("uptime:status", 0);
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

export const readDB = async () => {
    try {
        const lastDownTime = await redis.get("uptime:last_down_time");
        const lastDownDuration = await redis.get("uptime:last_down_duration");
        const lastCheck = await redis.get("uptime:last_check");
        const status = await redis.get("uptime:status");

        return {
            last_down_time: lastDownTime,
            last_down_duration: lastDownDuration,
            last_check: lastCheck,
            status: status,
        };
    } catch (err) {
        console.log("Can't connect to Database!");
        return {
            last_down_time: null,
            last_down_duration: null,
            last_check: null,
            status: null,
        };
    }
};

export default readDB;
