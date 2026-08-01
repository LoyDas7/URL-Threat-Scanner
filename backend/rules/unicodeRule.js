module.exports = (parsed) => {

    let score = 0;
    const findings = [];

    const hostname = parsed.hostname;

    // Detect any non-ASCII character
    const unicodeRegex = /[^\x00-\x7F]/;

    if (unicodeRegex.test(hostname)) {

        score += 25;

        findings.push(
            "Domain contains Unicode characters (possible homograph attack)"
        );

    }

    return {
        score,
        findings
    };

};