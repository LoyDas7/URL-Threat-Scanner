const { checkGoogleSafeBrowsing } = require("../services/googleSafeBrowsingService");
const SCORES = require("../config/ruleScores");

module.exports = async (parsed, url) => {

    let score = 0;
    const findings = [];

    const result = await checkGoogleSafeBrowsing(url);

    if (!result.success) {

        return {
            score,
            findings,
            metadata: {
                googleSafeBrowsing: {
                    available: false
                }
            }
        };

    }

    const threats = result.matches.map(match => match.threatType);

    if (threats.length > 0) {

        score += SCORES.GOOGLE_SAFE_BROWSING;

        findings.push(
            `Google Safe Browsing detected: ${threats.join(", ")}`
        );

    }

    return {

        score,

        findings,

        metadata: {

            googleSafeBrowsing: {

                available: true,

                safe: threats.length === 0,

                threats

            }

        }

    };

};