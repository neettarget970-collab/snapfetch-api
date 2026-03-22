const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.get("/download", async (req, res) => {
    try {
        const videoUrl = req.query.url;

        if (!videoUrl) {
            return res.json({ status: "error", message: "No URL" });
        }

        const response = await fetch("https://api.cobalt.tools/api/json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: videoUrl })
        });

        const data = await response.json();

        if (!data || !data.url) {
            return res.json({ status: "error", message: "Failed" });
        }

        res.json({
            status: "success",
            video: data.url
        });

    } catch (e) {
        res.json({ status: "error" });
    }
});

app.listen(3000);
