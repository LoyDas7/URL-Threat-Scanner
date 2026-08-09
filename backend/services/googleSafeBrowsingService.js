const axios = require("axios");

const API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

async function checkGoogleSafeBrowsing(url) {
    try {
        const response = await axios.post(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
            {
                client: {
                    clientId: "url-threat-scanner",
                    clientVersion: "1.0"
                },
                threatInfo: {
                    threatTypes: [
                        "MALWARE",
                        "SOCIAL_ENGINEERING",
                        "UNWANTED_SOFTWARE",
                        "POTENTIALLY_HARMFUL_APPLICATION"
                    ],
                    platformTypes: ["ANY_PLATFORM"],
                    threatEntryTypes: ["URL"],
                    threatEntries: [
                        {
                            url
                        }
                    ]
                }
            }
        );

        return {
            success: true,
            matches: response.data.matches || []
        };

    } catch (err) {

        return {
            success: false,
            error: err.response?.data || err.message
        };

    }
}

module.exports = {
    checkGoogleSafeBrowsing
};