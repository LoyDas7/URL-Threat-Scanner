const { SUSPICIOUS_KEYWORDS } = require("../config/constants");

module.exports = (parsed) => {

    let score = 0;
    const findings = [];

    const url = parsed.href.toLowerCase();

    const matchedKeywords = SUSPICIOUS_KEYWORDS.filter(keyword =>
        url.includes(keyword)
    );

    if (matchedKeywords.length > 0) {

        score += Math.min(matchedKeywords.length * 5, 20);

        findings.push(
            `Suspicious keywords found: ${matchedKeywords.join(", ")}`
        );

    }

    return {
        score,
        findings
    };

};