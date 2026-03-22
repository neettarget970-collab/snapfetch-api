const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ HOME
app.get("/", (req, res) => {
    res.send("SnapFetch API is running 🚀");
});

// ✅ DOWNLOAD
app.get("/download", async (req, res) => {
    try {
        const videoUrl = req.query.url;

        if (!videoUrl) {
            return res.json({ status: "error", message: "No URL provided" });
        }

        const response = await fetch("https://api.cobalt.tools/api/json", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
                "Origin": "https://cobalt.tools",
                "Referer": "https://cobalt.tools/"
            },
            body: JSON.stringify({
                url: videoUrl,
                vCodec: "h264",
                vQuality: "720",
                filenamePattern: "basic",
                isAudioOnly: false
            })
        });

        const text = await response.text();
        console.log("RAW RESPONSE:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            return res.json({
                status: "error",
                message: "Invalid API response"
            });
        }

        // ✅ ALL POSSIBLE FORMATS
        if (data?.url) {
            return res.json({ status: "success", video: data.url });
        }

        if (data?.stream?.url) {
            return res.json({ status: "success", video: data.stream.url });
        }

        if (data?.streams?.length > 0) {
            return res.json({ status: "success", video: data.streams[0].url });
        }

        if (data?.links?.length > 0) {
            return res.json({ status: "success", video: data.links[0].url });
        }

        return res.json({
            status: "error",
            message: "Cobalt blocked or unsupported URL"
        });

    } catch (err) {
        console.log("ERROR:", err);
        res.json({
            status: "error",
            message: "Server error"
        });
    }
});

// ✅ START
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
