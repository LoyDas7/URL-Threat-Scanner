const SCORES = require("../config/ruleScores");
const { analyzeRedirects } = require("../services/redirectService");

module.exports = async (parsed, url) => {
console.log("Redirect Rule Started");
    let score = 0;
    const findings = [];

    const result = await analyzeRedirects(url);
    console.log("Redirect Rule Finished");

    // If redirect analysis failed, don't penalize the website.
    if (!result.success) {
        return {
            score,
            findings,
            metadata: {
                redirects: {
                    count: result.chain.length,
                    chain: result.chain
                }
            }
        };
    }

    // More than 3 redirects
    if (result.chain.length > 3) {

        score += SCORES.MULTIPLE_REDIRECTS;
        findings.push("Multiple redirects detected");

    }

    // Count unique domains in redirect chain
    const uniqueDomains = new Set(
        result.chain.map(link => new URL(link).hostname)
    );

    // Redirecting across many domains is suspicious
    if (uniqueDomains.size > 2) {

        score +=SCORES.MULTI_DOMAIN_REDIRECT;
        findings.push("Redirects across multiple domains");

    }

    return {

        score,

        findings,

        metadata: {

            redirects: {

                count: result.chain.length,

                chain: result.chain

            }

        }

    };

};