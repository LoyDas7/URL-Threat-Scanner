const SCORES = require("../config/ruleScores");

module.exports = (parsed) => {

    let score = 0;
    const findings = [];

    if (parsed.href.includes("@")) {

        score += SCORES.AT_SYMBOL;

        findings.push(
            "URL contains '@' symbol which is commonly used in phishing URLs."
        );

    }

    return {
        score,
        findings,
        metadata: {
            atSymbol: {
                present: parsed.href.includes("@")
            }
        }
    };

};