module.exports = {

    // =========================
    // URL Structure
    // =========================

    HTTP: 15,
    IP_ADDRESS: 30,
    LONG_URL: 10,
    HYPHEN: 5,
    SUBDOMAIN: 10,
    SUSPICIOUS_TLD: 15,
    SHORTENER: 15,
    AT_SYMBOL: 25,


    // =========================
    // Content Analysis
    // =========================

    BRAND_SPOOFING: 30,
    HIGH_ENTROPY: 15,
    PUNYCODE: 25,
    UNICODE: 20,
    SUSPICIOUS_KEYWORDS: 15,


    // =========================
    // Domain Analysis
    // =========================

    RECENT_DOMAIN: 20,
    NO_WHOIS: 10,


    // =========================
    // DNS Analysis
    // =========================

    NO_MX_RECORD: 5,
    NO_NS_RECORD: 10,


    // =========================
    // SSL Analysis
    // =========================

    NO_SSL: 30,
    SELF_SIGNED_SSL: 25,
    EXPIRED_SSL: 30,
    UNKNOWN_SSL_EXPIRATION: 10,


    // =========================
    // Redirect Analysis
    // =========================

    MULTIPLE_REDIRECTS: 10,
    MULTI_DOMAIN_REDIRECT: 15,


    // =========================
    // Reputation Services
    // =========================

    VIRUSTOTAL_LOW: 20,
    VIRUSTOTAL_MEDIUM: 40,
    VIRUSTOTAL_HIGH: 70,

    GOOGLE_SAFE_BROWSING: 80

};