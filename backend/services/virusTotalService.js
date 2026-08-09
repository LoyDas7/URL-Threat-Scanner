const axios = require("axios");

const API_KEY = process.env.VIRUSTOTAL_API_KEY;


async function scanURL(url) {

    try {

        // Submit URL
        const submit = await axios.post(
            "https://www.virustotal.com/api/v3/urls",
            new URLSearchParams({
                url
            }),
            {
                headers: {
                    "x-apikey": API_KEY,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        const analysisId = submit.data.data.id;

        // Get analysis result
        let analysis;

        for (let i = 0; i < 8; i++) {

            analysis = await axios.get(
                `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
                {
                    headers: {
                        "x-apikey": API_KEY
                    }
                }
            );

            if (analysis.data.data.attributes.status === "completed") {
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        return {
            success: true,
            stats: analysis.data.data.attributes.stats
        };

    } catch (err) {

    console.log("VirusTotal Error:");

    console.log(err.response?.status);

    console.log(err.response?.data);

    console.log(err.message);

    return {
        success: false,
        error: err.response?.data || err.message
    };

}

}

module.exports = {
    scanURL
};