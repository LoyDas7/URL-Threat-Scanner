
const SCORES = require("../config/ruleScores");
module.exports = (parsed) => {

    let score = 0;
    const findings = [];

    // Extract main domain
    const parts = parsed.hostname.split(".");
    const domain =
        parts.length >= 2
            ? parts[parts.length - 2].toLowerCase()
            : parsed.hostname.toLowerCase();

    // Character frequency
    const freq = {};

    for (const ch of domain) {
        freq[ch] = (freq[ch] || 0) + 1;
    }

    let entropy = 0;

    for (const ch in freq) {
        const p = freq[ch] / domain.length;
        entropy -= p * Math.log2(p);
    }

    // Threshold
    if (entropy > 3.5) {
        score += SCORES.HIGH_ENTROPY;

        findings.push(
            `High domain entropy (${entropy.toFixed(2)})`
        );
    }

    return {
        score,
        findings,
        metadata: {
    entropy: {
        value: entropy
    }
}
    };

};