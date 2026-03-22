const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ HOME ROUTE
app.get("/", (req, res) => {
    res.send("SnapFetch API is running 🚀");
});

// ✅ DOWNLOAD ROUTE (FIXED)
app.get("/download", async (req, res) => {
    try {
        const videoUrl = req.query.url;

        if (!videoUrl) {
            return res.json({ status: "error", message: "No URL provided" });
        }

        const response = await fetch("https://api.cobalt.tools/api/json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Android)"
            },
            body: JSON.stringify({
                url: videoUrl,
                vCodec: "h264",
                vQuality: "720",
                aFormat: "mp3"
            })
        });

        const data = await response.json();
        console.log("FULL RESPONSE:", data);

        // ✅ Handle multiple response formats
        if (data && data.url) {
            return res.json({
                status: "success",
                video: data.url
            });
        }

        if (data && data.stream && data.stream.url) {
            return res.json({
                status: "success",
                video: data.stream.url
            });
        }

        if (data && data.streams && data.streams.length > 0) {
            return res.json({
                status: "success",
                video: data.streams[0].url
            });
        }

        return res.json({
            status: "error",
            message: "Extractor failed (site blocked or unsupported)"
        });

    } catch (e) {
        console.log("ERROR:", e);
        res.json({
            status: "error",
            message: "Server error"
        });
    }
});

// ✅ START SERVER (FIXED)
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
