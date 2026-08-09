const { askAI } = require("../services/aiService");

async function chatWithAI(req, res) {

    try {

        const { message, scanResult } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        if (!scanResult) {
            return res.status(400).json({
                error: "Scan result is required"
            });
        }

        const reply = await askAI(message, scanResult);

        res.json({
            reply
        });

    } catch (error) {

        console.error("AI Error:", error);

        res.status(500).json({
            error: "Failed to get AI response"
        });

    }
}

module.exports = {
    chatWithAI
};