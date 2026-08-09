const axios = require("axios");

async function analyzeRedirects(url) {

    const chain = [];
    const visited = new Set();

    let currentURL = url;

    const MAX_REDIRECTS = 5;

    try {

        for (let i = 0; i < MAX_REDIRECTS; i++) {

            if (visited.has(currentURL)) break;

            visited.add(currentURL);
            chain.push(currentURL);

            let response;

            try {

                // First try a HEAD request (much faster)
                response = await axios.head(currentURL, {
                    maxRedirects: 0,
                    timeout: 3000,
                    validateStatus: () => true
                });

            } catch {

                // Some servers don't support HEAD, so fall back to GET
                response = await axios.get(currentURL, {
                    maxRedirects: 0,
                    timeout: 3000,
                    validateStatus: () => true
                });

            }

            if (
                response.status >= 300 &&
                response.status < 400 &&
                response.headers.location
            ) {

                currentURL = new URL(
                    response.headers.location,
                    currentURL
                ).href;

            } else {

                break;

            }

        }

        return {
            success: true,
            chain
        };

    } catch (err) {

        console.log("Redirect Error:", err.message);

        return {
            success: false,
            chain
        };

    }

}

module.exports = {
    analyzeRedirects
};