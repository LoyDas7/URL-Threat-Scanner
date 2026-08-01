const whois = require("whois-json");

async function getWhois(domain) {

    try {

        const result = await whois(domain);

        return result;

    } catch (err) {

        return null;

    }

}

module.exports = {
    getWhois
};