const protocolRule = require("./protocolRule");
const ipRule = require("./ipRule");
const lengthRule = require("./lengthRule");
const hyphenRule = require("./hyphenRule");
const subdomainRule = require("./subdomainRule");
const tldRule = require("./tldRule");
const brandRule = require("./brandRule");
const entropyRule = require("./entropyRule");
const punycodeRule = require("./punycodeRule");
const unicodeRule = require("./unicodeRule");
const keywordRule = require("./keywordRule");
const whoisRule = require("./whoisRule");
const dnsRule = require("./dnsRule");
const sslRule = require("./sslRule");
const redirectRule = require("./redirectRule");
const virusTotalRule = require("./virusTotalRule");
const googleSafeBrowsingRule = require("./googleSafeBrowsingRule");
const atSymbolRule = require("./atSymbolRule");

const calculateVerdict = require("../utils/scoreCalculator");

async function analyze(url) {

    const parsed = new URL(url);

    const rules = [
        { name: "Protocol", fn: protocolRule },
        { name: "IP Address", fn: ipRule },
        { name: "URL Length", fn: lengthRule },
        { name: "Hyphen", fn: hyphenRule },
        { name: "Subdomain", fn: subdomainRule },
        { name: "TLD", fn: tldRule },
        { name: "Brand", fn: brandRule },
        { name: "Entropy", fn: entropyRule },
        { name: "Punycode", fn: punycodeRule },
        { name: "Unicode", fn: unicodeRule },
        { name: "Keywords", fn: keywordRule },
        { name: "WHOIS", fn: whoisRule },
        { name: "DNS", fn: dnsRule },
        { name: "SSL", fn: sslRule },
        { name: "Redirect", fn: redirectRule },
        { name: "VirusTotal", fn: virusTotalRule },
        { name: "Google Safe Browsing", fn: googleSafeBrowsingRule },
        { name: "At Symbol", fn: atSymbolRule }
    ];

    const results = await Promise.all(

        rules.map(async ({ name, fn }) => {

            console.time(name);

            try {

                const result = await fn(parsed, url);

                console.timeEnd(name);

                return result;

            } catch (err) {

                console.timeEnd(name);

                console.error(`${name} failed: ${err.message}`);

                return {
                    score: 0,
                    findings: [],
                    metadata: {}
                };

            }

        })

    );

    let score = 0;
    let findings = [];
    let metadata = {};

    for (const result of results) {

        score += result.score || 0;

        if (result.findings) {
            findings.push(...result.findings);
        }

        if (result.metadata) {
            metadata = {
                ...metadata,
                ...result.metadata
            };
        }

    }

    return {

        score,

        verdict: calculateVerdict(score),

        findings,

        metadata

    };

}

module.exports = { analyze };