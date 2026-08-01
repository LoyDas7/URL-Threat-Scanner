const SCORES = require("../config/ruleScores");
module.exports = (parsed) => {

    let score = 0;
    const findings = [];

    const hostname = parsed.hostname.toLowerCase();

    if (hostname.startsWith("xn--") || hostname.includes(".xn--")) {

        score += 30;

        findings.push(
            "Uses Punycode (possible Unicode homograph attack)"
        );

    }

    return {
        score,
        findings
    };

};