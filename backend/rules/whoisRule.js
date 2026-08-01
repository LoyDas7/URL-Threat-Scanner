const { getWhois } = require("../services/whoisService");

module.exports = async (parsed) => {

    let score = 0;

    const findings = [];

    const domain = parsed.hostname;

    const data = await getWhois(domain);

    if (!data) {

        return {
            score,
            findings
        };

    }

    if (data.creationDate) {

        const created = new Date(data.creationDate);

        const age =
            (Date.now() - created.getTime()) /
            (1000 * 60 * 60 * 24);

        if (age < 180) {

            score += 30;

            findings.push(
                `Newly registered domain (${Math.floor(age)} days old)`
            );

        }

    }

    return {

        score,

        findings

    };

};