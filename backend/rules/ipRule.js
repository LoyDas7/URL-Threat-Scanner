const SCORES = require("../config/ruleScores");
const net = require("net");
module.exports = (parsed) => {

    let score = 0;
    const findings = [];

    const isIPAddress = net.isIP(parsed.hostname) !== 0;

    if (isIPAddress) {

        score += SCORES.IP_ADDRESS;
        findings.push("IP Address used instead of domain");

    }

    return {
        score,
        findings,
        metadata: {
            ipAddress: {
                hostname: parsed.hostname,
                isIPAddress
            }
        }
    };

};