const {
    lookupDomain,
    getMX,
    getNS
} = require("../services/dnsService");

module.exports = async (parsed) => {

    let score = 0;
    const findings = [];

    const domain = parsed.hostname;

    const result = await lookupDomain(domain);

    if (!result.success) {

        score += 40;

        findings.push("Domain cannot be resolved");

        return {
            score,
            findings
        };
    }

    const mx = await getMX(domain);

    if (mx.length === 0) {

        score += 10;

        findings.push("No MX records found");

    }

    const ns = await getNS(domain);

    if (ns.length === 0) {

        score += 15;

        findings.push("No Name Server records");

    }

    return {
        score,
        findings
    };

};