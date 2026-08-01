const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const scanRoutes = require("./routes/scan");

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "URL Threat Scanner API is running"
    });
});

app.use("/api/scan", scanRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});