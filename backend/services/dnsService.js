const dns = require("dns").promises;

async function lookupDomain(domain) {
    try {
        const addresses = await dns.resolve(domain);

        return {
            success: true,
            addresses
        };
    } catch (err) {
        return {
            success: false,
            addresses: []
        };
    }
}

async function getMX(domain) {
    try {
        return await dns.resolveMx(domain);
    } catch {
        return [];
    }
}

async function getNS(domain) {
    try {
        return await dns.resolveNs(domain);
    } catch {
        return [];
    }
}

module.exports = {
    lookupDomain,
    getMX,
    getNS
};