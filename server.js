const express = require("express");
const ytdlp = require("yt-dlp-exec");

const app = express();
const PORT = process.env.PORT || 3000;

// HOME
app.get("/", (req, res) => {
    res.send("🔥 SnapFetch PRO API Running");
});

// GET ALL QUALITIES
app.get("/info", async (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.json({ status: "error", message: "No URL" });
        }

        const data = await ytdlp(url, {
            dumpSingleJson: true
        });

        const formats = data.formats
            .filter(f => f.ext === "mp4" && f.height)
            .map(f => ({
                quality: f.height + "p",
                url: f.url
            }));

        res.json({
            status: "success",
            title: data.title,
            thumbnail: data.thumbnail,
            formats: formats
        });

    } catch (e) {
        res.json({ status: "error", message: "Failed to fetch" });
    }
});

// DIRECT DOWNLOAD
app.get("/download", async (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.json({ status: "error", message: "No URL" });
        }

        const video = await ytdlp(url, {
            format: "best",
            getUrl: true
        });

        res.json({
            status: "success",
            video: video
        });

    } catch (e) {
        res.json({ status: "error", message: "Download failed" });
    }
});

app.listen(PORT, () => {
    console.log("🔥 Server running on port " + PORT);
});
