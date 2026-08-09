const SCORE = require("../config/riskConfig");

function calculateVerdict(score) {

    if (score >= SCORE.CRITICAL)
        return SCORE.VERDICTS.CRITICAL;

    if (score >= SCORE.HIGH)
        return SCORE.VERDICTS.HIGH_RISK;

    if (score >= SCORE.MEDIUM)
        return SCORE.VERDICTS.MEDIUM_RISK;

    return SCORE.VERDICTS.SAFE;
}

module.exports = calculateVerdict;