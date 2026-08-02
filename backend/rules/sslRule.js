const { getCertificate } = require("../services/sslService");

module.exports = async (parsed) => {

    let score = 0;
    const findings = [];

    if (parsed.protocol !== "https:") {

        return {
            score,
            findings
        };

    }

    const result = await getCertificate(parsed.hostname);

    if (!result.success) {

        score += 30;

        findings.push("Unable to retrieve SSL certificate");

        return {
            score,
            findings
        };

    }

    const cert = result.certificate;

    if (!cert.valid_to) {

        score += 20;

        findings.push("Certificate expiration unknown");

    } else {

        const expiry = new Date(cert.valid_to);

        if (expiry < new Date()) {

            score += 40;

            findings.push("SSL certificate has expired");

        }

    }

    if (cert.issuer && cert.subject) {

        if (JSON.stringify(cert.issuer) === JSON.stringify(cert.subject)) {

            score += 25;

            findings.push("Self-signed certificate");

        }

    }

    return {

        score,

        findings

    };

};