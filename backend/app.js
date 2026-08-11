require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const scanRoutes = require("./routes/scan");
const reportRoutes = require("./routes/report");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Health check / Render wake-up endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

// Routes
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "URL Threat Scanner API is running"
    });
});

app.use("/api/scan", scanRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/ai", aiRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Periodically clean up old PDF reports that were never downloaded,
// so disk usage doesn't grow unbounded. Doesn't touch scan/download logic.
const REPORTS_DIR = path.join(__dirname, "reports");
const MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

function cleanupOldReports() {
    fs.readdir(REPORTS_DIR, (err, files) => {
        if (err) return console.error("Cleanup readdir error:", err);

        files.forEach((file) => {
            const filePath = path.join(REPORTS_DIR, file);
            fs.stat(filePath, (statErr, stats) => {
                if (statErr) return;
                if (Date.now() - stats.mtimeMs > MAX_AGE_MS) {
                    fs.unlink(filePath, (unlinkErr) => {
                        if (!unlinkErr) console.log(`Cleaned up stale report: ${file}`);
                    });
                }
            });
        });
    });
}

cleanupOldReports();
setInterval(cleanupOldReports, 30 * 60 * 1000);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});