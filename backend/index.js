import express from "express";
import axios from "axios";
import https from "https";
import "dotenv/config";

import { serverDown, serverUp, readDB } from "./utils/db.js";

const webUrl = process.env.KTU_URL;
const app = express();

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

        serverUp();

        res.json({ message: "Serever is up. Status updated." });
    } catch (err) {
        try {
            serverDown();
        } catch (err) {
            console.log("Cannot connect to database!");
            res.json({ message: "Serever is down. Status can't be updated." });
        }

        res.json({ message: "Serever is down. Status updated." });
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
    res.json(history);
});

app.listen(3000, () => console.log("Server running on port 3000"));
