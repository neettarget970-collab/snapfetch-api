const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ FIX 1 — HOME ROUTE
app.get("/", (req, res) => {
    res.send("SnapFetch API is running 🚀");
});

// ✅ DOWNLOAD ROUTE
app.get("/download", async (req, res) => {
    try {
        const videoUrl = req.query.url;

        if (!videoUrl) {
            return res.json({ status: "error", message: "No URL provided" });
        }

        const response = await fetch("https://api.cobalt.tools/api/json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: videoUrl })
        });

        const data = await response.json();

        console.log("API RESPONSE:", data);

        // ✅ FIX 2 — HANDLE DIFFERENT RESPONSE FORMATS
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

        return res.json({
            status: "error",
            message: "Failed to fetch video"
        });

    } catch (e) {
        console.log("ERROR:", e);
        res.json({ status: "error", message: "Server error" });
    }
});

// ✅ FIX 3 — USE RENDER PORT
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
