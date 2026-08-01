const SUSPICIOUS_TLDS = [
    "xyz",
    "top",
    "click",
    "gq",
    "tk",
    "ml"
];

const SHORTENERS = [
    "bit.ly",
    "tinyurl.com",
    "goo.gl",
    "t.co",
    "is.gd",
    "ow.ly",
    "buff.ly",
    "cutt.ly",
    "rb.gy",
    "tiny.cc",
    "rebrand.ly"
];

const SUSPICIOUS_KEYWORDS = [
    "login",
    "signin",
    "verify",
    "verification",
    "secure",
    "account",
    "bank",
    "update",
    "password",
    "confirm",
    "payment",
    "wallet",
    "billing",
    "support",
    "reset",
    "auth",
    "unlock"
];

module.exports = {
    SUSPICIOUS_TLDS,
    SHORTENERS,
    SUSPICIOUS_KEYWORDS
};