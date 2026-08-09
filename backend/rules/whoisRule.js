const { getWhois } = require("../services/whoisService");

module.exports = async (parsed) => {

    let score = 0;
    const findings = [];

    const domain = parsed.hostname;

    const data = await getWhois(domain);

    if (!data) {

        return {
            score,
            findings,
            metadata: {
                whois: {
                    registrar: null,
                    creationDate: null,
                    ageDays: null,
                    recentlyRegistered: false
                }
            }
        };

    }

    let ageDays = null;

    if (data.creationDate) {

        const created = new Date(data.creationDate);

        ageDays = Math.floor(
            (Date.now() - created.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (ageDays < 180) {

            score += 30;

            findings.push(
                `Newly registered domain (${ageDays} days old)`
            );

        }

    }

    return {

        score,

        findings,

        metadata: {
            whois: {
                registrar: data.registrar || null,
                creationDate: data.creationDate || null,
                ageDays,
                recentlyRegistered: ageDays !== null && ageDays < 180
            }
        }

    };

};