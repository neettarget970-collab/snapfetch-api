const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ HOME
app.get("/", (req, res) => {
    res.send("🔥 SnapFetch PRO API Running");
});

// ✅ GET VIDEO INFO (ALL QUALITIES)
app.get("/info", (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.json({ status: "error", message: "No URL" });
    }

    const command = `yt-dlp -J "${url}"`;

    exec(command, (error, stdout) => {
        if (error) {
            return res.json({ status: "error", message: "Failed" });
        }

        try {
            const data = JSON.parse(stdout);

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

        } catch {
            res.json({ status: "error", message: "Parsing failed" });
        }
    });
});

// ✅ DIRECT DOWNLOAD (BEST QUALITY)
app.get("/download", (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.json({ status: "error", message: "No URL" });
    }

    const command = `yt-dlp -f best -g "${url}"`;

    exec(command, (error, stdout) => {
        if (error) {
            return res.json({ status: "error", message: "Download failed" });
        }

        res.json({
            status: "success",
            video: stdout.trim()
        });
    });
});

app.listen(PORT, () => {
    console.log("🔥 Server running on port " + PORT);
});
