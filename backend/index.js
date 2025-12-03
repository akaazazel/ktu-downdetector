import express from "express";
import axios from "axios";
import https from "https";
import cors from "cors";
import "dotenv/config";

import { serverDown, serverUp, readDB } from "./utils/db.js";

const webUrl = process.env.KTU_URL;
const originUrl = process.env.ORIGIN_URL;
const app = express();
app.use(cors({ origin: originUrl }));

const agent = new https.Agent({
    rejectUnauthorized: false,
});

// hourly ping for checking the url and storing status to db
app.get("/ping", async (req, res) => {
    try {
        const result = await axios.get(webUrl, {
            httpsAgent: agent,
            headers: { "User-Agent": "Mozilla/5.0" },
        });

        await serverUp();
        return res.json({ message: "Server is up. Status updated." });
    } catch (err) {
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
    }
});

// for user side checking only
app.get("/status", async (req, res) => {
    let start = 0,
        end = 0,
        latency = 0;

    try {
        start = Date.now();

        const result = await axios.get(webUrl, {
            httpsAgent: agent,
            headers: { "User-Agent": "Mozilla/5.0" },
        });

        end = Date.now();
        latency = end - start;

        return res.json({
            down: false,
            status: result.status,
            statusText: result.statusText,
            latency: latency,
        });
    } catch (err) {
        end = Date.now();
        latency = end - start;

        return res.json({
            down: true,
            status: err.response?.status,
            statusText: err.response?.statusText,
            latency: latency,
        });
    }
});

// user side db status read
app.get("/status/history", async (req, res) => {
    const history = await readDB();
    console.log(history);
    res.json(history);
});

app.listen(3000, () => console.log("Server running on port 3000"));
