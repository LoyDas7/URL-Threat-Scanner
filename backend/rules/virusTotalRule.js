const { scanURL } = require("../services/virusTotalService");
const SCORES = require("../config/ruleScores");

module.exports = async (parsed, url) => {

    let score = 0;

    const findings = [];

    const result = await scanURL(url);

    if (!result.success) {

        return {

            score,

            findings,

            metadata: {

                virusTotal: {

                    available: false

                }

            }

        };

    }

    const stats = result.stats;

    if (stats.malicious >= 5) {

        score += SCORES.VIRUSTOTAL_HIGH;

        findings.push(
            `${stats.malicious} security vendors marked this URL as malicious`
        );

    }

    else if (stats.malicious >= 3) {

        score += SCORES.VIRUSTOTAL_MEDIUM;

        findings.push(
            `${stats.malicious} security vendors marked this URL as malicious`
        );

    }

    else if (stats.malicious >= 1) {

        score += SCORES.VIRUSTOTAL_LOW;

        findings.push(
            `${stats.malicious} security vendors marked this URL as malicious`
        );

    }

    return {

        score,

        findings,

        metadata: {

            virusTotal: {

                available: true,

                malicious: stats.malicious,

                suspicious: stats.suspicious,

                harmless: stats.harmless,

                undetected: stats.undetected

            }

        }

    };

};