const { analyze } = require("../rules");
const { generatePDF } = require("../services/pdfService");

async function scanURL(req, res) {

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            success: false,
            message: "URL is required"
        });
    }

    try {

        // Analyze first
        const result = await analyze(url);

        console.log("RESULT =", result);

        // Generate PDF
        const pdfFile = generatePDF({
            scannedURL: url,
            ...result
        });

        // Send response
        res.json({
            success: true,
            scannedURL: url,
            pdf: pdfFile,
            ...result
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

module.exports = { scanURL };