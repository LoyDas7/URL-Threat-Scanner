require("dotenv").config();
const express = require("express");

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const scanRoutes = require("./routes/scan");
const reportRoutes = require("./routes/report");



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
app.use("/api/report", reportRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});