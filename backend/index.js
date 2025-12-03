import express from "express";
import axios from "axios";
import https from "https";
import cors from "cors";
import "dotenv/config";

import {
    serverDown,
    serverUp,
    readHistory,
    readStatus,
    storeDB,
} from "./utils/db.js";

const webUrl = process.env.KTU_URL;
const originUrl = process.env.ORIGIN_URL;
const app = express();
app.use(cors({ origin: originUrl }));

const agent = new https.Agent({
    rejectUnauthorized: false,
});

// hourly ping for checking the url and storing status to db
app.get("/ping", async (req, res) => {
    let start = 0,
        end = 0,
        latency = 0;

    let result;

    try {
        start = Date.now();

        result = await axios.get(webUrl, {
            httpsAgent: agent,
            headers: { "User-Agent": "Mozilla/5.0" },
        });

        end = Date.now();
        latency = end - start;

        try {
            await serverUp();
            return res.json({ message: "Server is up. Status updated." });
        } catch (dbErr) {
            console.error("Redis error:", dbErr);
            return res.json({
                message: "Server up, but status update failed.",
            });
        }
    } catch (err) {
        end = Date.now();
        latency = end - start;

        console.error("Ping error:", err);

        try {
            await serverDown();
            return res.json({ message: "Server is down. Status updated." });
        } catch (dbErr) {
            console.error("Redis error:", dbErr);
            return res.json({
                message: "Server down, but status update failed.",
            });
        }
    } finally {
        await storeDB({
            status: result?.status || null,
            statusText: result?.statusText || "ERROR",
            latency,
        });
    }
});

// for user side checking only
app.get("/status", async (req, res) => {
    try {
        const status = await readStatus();
        console.log(status);
        return res.json(status);
    } catch (err) {
        return res.json({
            message: err.message,
        });
    }
});

// user side db status read
app.get("/status/history", async (req, res) => {
    try {
        const history = await readHistory();
        console.log(history);
        return res.json(history);
    } catch (err) {
        return res.json({
            message: err.message,
        });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
