const { distance } = require("fastest-levenshtein");
const BRANDS = require("../config/brands");

module.exports = (parsed) => {

    let score = 0;
    const findings = [];

    // Extract main domain
    const parts = parsed.hostname.split(".");
    const domain = parts.length >= 2 ? parts[parts.length - 2].toLowerCase() : parsed.hostname.toLowerCase();

    for (const brand of BRANDS) {

        const dist = distance(domain, brand);

        // Detect close lookalikes
        if (dist > 0 && dist <= 2) {

            score += 35;

            findings.push(
                `Possible brand spoofing: "${domain}" resembles "${brand}"`
            );

            break;
        }
    }

    return {
        score,
        findings
    };

};