import express from "express";
import axios from "axios";
import https from "https";
import { time } from "console";

const app = express();

const agent = new https.Agent({
    rejectUnauthorized: false,
});

app.get("/", async (req, res) => {
    let start = 0,
        end = 0,
        latency = 0;
    try {
        start = Date.now();

        const result = await axios.get("https://www.youtube.com", {
            httpsAgent: agent,
            headers: { "User-Agent": "Mozilla/5.0" },
        });

        end = Date.now();
        latency = end - start;
        console.log(latency);

        return res.json({
            down: false,
            status: result.status,
            statusText: result.statusText,
            latency: latency,
        });
    } catch (err) {
        end = Date.now();
        latency = end - start;
        console.log(latency);
        return res.json({
            down: true,
            status: err.response?.status,
            statusText: err.response?.statusText,
            latency: latency,
        });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
