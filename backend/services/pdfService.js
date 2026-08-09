const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generatePDF(scanResult) {

    // -----------------------------
    // Create reports folder
    // -----------------------------

    const reportsDir = path.join(__dirname, "../reports");

    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }

    // -----------------------------
    // File Name
    // -----------------------------

    const fileName = `report-${Date.now()}.pdf`;

    const filePath = path.join(
        reportsDir,
        fileName
    );

    // -----------------------------
    // Create PDF
    // -----------------------------

    const doc = new PDFDocument({

        size: "A4",

        margin: 40,

        bufferPages: true

    });

    doc.pipe(
        fs.createWriteStream(filePath)
    );

    // -----------------------------
    // Page Width & Height
    // -----------------------------

    const PAGE_WIDTH = doc.page.width;
    const PAGE_HEIGHT = doc.page.height;

    // -----------------------------
    // Theme Colors
    // -----------------------------

    const COLORS = {

        navy: "#0F172A",

        blue: "#2563EB",

        green: "#22C55E",

        orange: "#F59E0B",

        red: "#DC2626",

        white: "#FFFFFF",

        light: "#F8FAFC",

        border: "#D1D5DB",

        gray: "#6B7280",

        black: "#111827"

    };

    // ======================================================
    // HELPER FUNCTIONS
    // ======================================================
function ensureSpace(height) {

    const bottomMargin = 55;

    if (doc.y + height > doc.page.height - bottomMargin) {
        doc.addPage();
    }

}
function sectionTitle(title) {

    doc.moveDown(0.8);

    const x = 40;
    const width = PAGE_WIDTH - 80;

    doc.fillColor("#001b54")
        .font("Helvetica-Bold")
        .fontSize(16)
        .text(title, x, doc.y, {
            width: width,
            align: "left"
        });

    doc.moveTo(x, doc.y + 4)
        .lineTo(x + width, doc.y + 4)
        .lineWidth(1)
        .strokeColor("#BFDBFE")
        .stroke();

    doc.moveDown(0.8);

}

function infoRow(label, value) {

    const y = doc.y;

    // Label
    doc.fillColor(COLORS.gray)
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(
            label + " :",
            50,
            y,
            {
                width: 100,
                lineBreak: false
            }
        );

    // Value
    doc.fillColor(COLORS.black)
        .font("Helvetica")
        .fontSize(8)
        .text(
            String(value ?? "-"),
            150,
            y,
            {
                width: PAGE_WIDTH - 190
            }
        );

    doc.y = y + 16;
}
function infoCard(title, rows) {

    sectionTitle(title);

    const x = 40;
    const y = doc.y;
    const width = PAGE_WIDTH - 80;

    const height = rows.length * 18 + 24;

    doc.roundedRect(
        x,
        y,
        width,
        height,
        8
    )
    .fillAndStroke(
        COLORS.white,
        COLORS.border
    );

    let currentY = y + 12;

    rows.forEach(row => {

        doc.fillColor(COLORS.gray)
            .font("Helvetica-Bold")
            .fontSize(10)
            .text(
                row.label,
                x + 15,
                currentY,
                {
                    width: 120
                }
            );

        doc.fillColor(COLORS.black)
            .font("Helvetica")
            .fontSize(8)
            .text(
                ": " + (row.value ?? "-"),
                x + 140,
                currentY
            );

        currentY += 18;

    });

    doc.y = y + height + 12;

}

function verdictColor(verdict) {

    switch (verdict) {

        case "Safe":
            return COLORS.green;

        case "Medium Risk":
            return COLORS.orange;

        case "High Risk":
            return COLORS.red;

        case "Critical":
            return COLORS.red;

        default:
            return COLORS.black;

    }

}







    // ======================================================
    // REPORT STARTS HERE
    // ======================================================

// ======================================================
// HEADER
// ======================================================

doc.rect(
    0,
    0,
    PAGE_WIDTH,
    90
)
.fill(COLORS.navy);

// Logo

const logo = path.join(
    __dirname,
    "../assets/logo.png"
);

if (fs.existsSync(logo)) {

    doc.image(
        logo,
        40,
        18,
        {
            width: 48
        }
    );

}

// Title

doc.fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .fontSize(22)
    .text(
        "SCAN THE URL",
        105,
        22
    );

doc.font("Helvetica")
    .fontSize(10)
    .text(
        "URL Threat Scanner Report",
        105,
        52
    );

doc.moveDown(4);
// ======================================================
// REPORT INFORMATION
// ======================================================

sectionTitle("REPORT INFORMATION");

doc.roundedRect(
    40,
    doc.y,
    PAGE_WIDTH - 80,
    65,
    8
)
.fillAndStroke(
    COLORS.light,
    COLORS.border
);

doc.y += 15;

infoRow(
    "Report ID",
    Date.now()
);

infoRow(
    "Generated",
    new Date().toLocaleString()
);

infoRow(
    "URL",
    scanResult.scannedURL
);

doc.moveDown(2);
// ======================================================
// OVERALL RESULT
// ======================================================

sectionTitle("OVERALL RESULT");

const cardX = 40;
const cardY = doc.y;
const cardWidth = PAGE_WIDTH - 80;
const cardHeight = 95;

doc.roundedRect(
    cardX,
    cardY,
    cardWidth,
    cardHeight,
    8
)
.fillAndStroke(
    "#FFFFFF",
    COLORS.border
);

// --------------------
// Verdict
// --------------------

doc.fillColor(verdictColor(scanResult.verdict))
    .font("Helvetica-Bold")
    .fontSize(22)
    .text(
        scanResult.verdict.toUpperCase(),
        cardX,
        cardY + 18,
        {
            width: cardWidth,
            align: "center"
        }
    );

// --------------------
// Score
// --------------------

doc.fillColor(COLORS.black)
    .font("Helvetica-Bold")
    .fontSize(15)
    .text(
        `${scanResult.score} / 100`,
        cardX,
        cardY + 52,
        {
            width: cardWidth,
            align: "center"
        }
    );
    // --------------------
// Risk Progress Bar
// --------------------

const barWidth = 320;
const barHeight = 10;

const barX = (PAGE_WIDTH - barWidth) / 2;
const barY = cardY + 88;

doc.roundedRect(
    barX,
    barY,
    barWidth,
    barHeight,
    5
)
.fill("#E5E7EB");

const progressWidth =
    (Math.min(scanResult.score, 100) / 100) * barWidth;

doc.roundedRect(
    barX,
    barY,
    progressWidth,
    barHeight,
    5
)
.fill(
    verdictColor(scanResult.verdict)
);

doc.y = cardY + cardHeight + 18;

// ============================================
// GENERAL INFORMATION
// ============================================

infoCard("GENERAL INFORMATION", [

    {
        label: "URL",
        value: scanResult.scannedURL
    },

    {
        label: "Hostname",
        value: scanResult.metadata.ipAddress.hostname
    },

    {
        label: "Protocol",
        value: scanResult.metadata.protocol.protocol.toUpperCase()
    },

    {
        label: "URL Length",
        value: scanResult.metadata.urlLength.length + " characters"
    },

    {
        label: "Redirects",
        value: scanResult.metadata.redirects.count
    },

    {
        label: "Subdomains",
        value: scanResult.metadata.subdomain.count
    }

]);
// ======================================================
// THREAT FINDINGS
// ======================================================

sectionTitle("THREAT FINDINGS");

const findingsX = 40;
const findingsY = doc.y;
const findingsWidth = PAGE_WIDTH - 80;

const findingsHeight =
    Math.max(scanResult.findings.length, 1) * 22 + 24;

doc.roundedRect(
    findingsX,
    findingsY,
    findingsWidth,
    findingsHeight,
    8
)
.fillAndStroke(
    COLORS.white,
    COLORS.border
);

doc.y = findingsY + 12;

if (scanResult.findings.length === 0) {

    doc.fillColor(COLORS.green)
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(
            "✓ No suspicious indicators detected",
            findingsX + 15,
            doc.y
        );

}
else {

    scanResult.findings.forEach(finding => {

        doc.fillColor(COLORS.orange)
            .font("Helvetica-Bold")
            .fontSize(10)
            .text(
                "⚠",
                findingsX + 15,
                doc.y
            );

        doc.fillColor(COLORS.black)
            .font("Helvetica")
            .fontSize(10)
            .text(
                finding,
                findingsX + 35,
                doc.y - 12
            );

        doc.moveDown(0.6);

    });

}

doc.y = findingsY + findingsHeight + 15;
// ======================================================
// DOMAIN INFORMATION
// ======================================================

sectionTitle("DOMAIN INFORMATION");

const domainX = 40;
const domainY = doc.y;
const domainWidth = PAGE_WIDTH - 80;
const domainHeight = 90;

doc.roundedRect(
    domainX,
    domainY,
    domainWidth,
    domainHeight,
    8
)
.fillAndStroke(
    COLORS.white,
    COLORS.border
);

doc.y = domainY + 12;

infoRow(
    "Registrar",
    scanResult.metadata.whois?.registrar || "Unknown"
);

infoRow(
    "Creation Date",
    scanResult.metadata.whois?.creationDate || "Unknown"
);

infoRow(
    "Domain Age",
    scanResult.metadata.whois?.ageDays != null
        ? `${scanResult.metadata.whois.ageDays} Days`
        : "Unknown"
);

infoRow(
    "Top Level Domain",
    scanResult.metadata.tld?.value?.toUpperCase() || "-"
);

doc.y = domainY + domainHeight + 15;
// ======================================================
// DNS INFORMATION
// ======================================================

sectionTitle("DNS INFORMATION");

const dnsX = 40;
const dnsY = doc.y;
const dnsWidth = PAGE_WIDTH - 80;
const dnsHeight = 110;

doc.roundedRect(
    dnsX,
    dnsY,
    dnsWidth,
    dnsHeight,
    8
)
.fillAndStroke(
    COLORS.white,
    COLORS.border
);

doc.y = dnsY + 12;

// MX Records
infoRow(
    "MX Records",
    scanResult.metadata.dns?.mxRecords?.length
        ? scanResult.metadata.dns.mxRecords.join(", ")
        : "None"
);

// Name Servers
infoRow(
    "Name Servers",
    scanResult.metadata.dns?.nsRecords?.length
        ? scanResult.metadata.dns.nsRecords.join(", ")
        : "None"
);

// Total MX
infoRow(
    "Total MX",
    scanResult.metadata.dns?.mxRecords?.length || 0
);

// Total Name Servers
infoRow(
    "Total NS",
    scanResult.metadata.dns?.nsRecords?.length || 0
);

doc.y = dnsY + dnsHeight + 15;
// ======================================================
// SSL CERTIFICATE
// ======================================================

sectionTitle("SSL CERTIFICATE");

const sslX = 40;
const sslY = doc.y;
const sslWidth = PAGE_WIDTH - 80;
const sslHeight = 115;

doc.roundedRect(
    sslX,
    sslY,
    sslWidth,
    sslHeight,
    8
)
.fillAndStroke(
    COLORS.white,
    COLORS.border
);

doc.y = sslY + 12;

infoRow(
    "Reachable",
    scanResult.metadata.ssl?.reachable ? "Yes" : "No"
);

infoRow(
    "Issuer",
    scanResult.metadata.ssl?.issuer?.O || "Unknown"
);

infoRow(
    "Common Name",
    scanResult.metadata.ssl?.issuer?.CN || "Unknown"
);

infoRow(
    "Country",
    scanResult.metadata.ssl?.issuer?.C || "Unknown"
);

infoRow(
    "Valid Until",
    scanResult.metadata.ssl?.validTo || "Unknown"
);

infoRow(
    "Self Signed",
    scanResult.metadata.ssl?.selfSigned ? "Yes" : "No"
);

doc.y = sslY + sslHeight + 15;
// ======================================================
// VIRUSTOTAL
// ======================================================

sectionTitle("VIRUSTOTAL");

const vtX = 40;
const vtY = doc.y;
const vtWidth = PAGE_WIDTH - 80;
const vtHeight = 120;

doc.roundedRect(
    vtX,
    vtY,
    vtWidth,
    vtHeight,
    8
)
.fillAndStroke(
    COLORS.white,
    COLORS.border
);

doc.y = vtY + 12;

const vt = scanResult.metadata.virusTotal || {};

infoRow(
    "Available",
    vt.available ? "Yes" : "No"
);

infoRow(
    "Malicious",
    vt.malicious ?? "-"
);

infoRow(
    "Suspicious",
    vt.suspicious ?? "-"
);

infoRow(
    "Harmless",
    vt.harmless ?? "-"
);

infoRow(
    "Undetected",
    vt.undetected ?? "-"
);

// Status
let vtStatus = "Not Available";

if (vt.available) {

    if ((vt.malicious || 0) > 0) {

        vtStatus = "Malicious URL Detected";

    } else if ((vt.suspicious || 0) > 0) {

        vtStatus = "Suspicious";

    } else {

        vtStatus = "Clean";

    }

}

infoRow(
    "Status",
    vtStatus
);

doc.y = vtY + vtHeight + 15;
// ======================================================
// GOOGLE SAFE BROWSING
// ======================================================

ensureSpace(155);

sectionTitle("GOOGLE SAFE BROWSING");

const gsbX = 40;
const gsbY = doc.y;
const gsbWidth = PAGE_WIDTH - 80;
const gsbHeight = 90;

doc.roundedRect(
    gsbX,
    gsbY,
    gsbWidth,
    gsbHeight,
    8
)
.fillAndStroke(
    COLORS.white,
    COLORS.border
);

const gsb = scanResult.metadata.googleSafeBrowsing || {};


// --------------------
// Values
// --------------------

let gsbStatus = "Not Available";

if (gsb.available) {

    gsbStatus = gsb.safe
        ? "No phishing or malware detected"
        : "Threat detected";

}


// --------------------
// Row function
// --------------------

function gsbRow(label, value, y) {

    doc.fillColor(COLORS.gray)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(
            label + " :",
            gsbX + 12,
            y,
            {
                width: 100,
                lineBreak: false
            }
        );

    doc.fillColor(COLORS.black)
        .font("Helvetica")
        .fontSize(9)
        .text(
            String(value ?? "-"),
            gsbX + 115,
            y,
            {
                width: gsbWidth - 130,
                lineBreak: false
            }
        );
}


// --------------------
// Rows
// --------------------

gsbRow(
    "Available",
    gsb.available ? "Yes" : "No",
    gsbY + 15
);

gsbRow(
    "Safe",
    gsb.safe ? "Yes" : "No",
    gsbY + 33
);

gsbRow(
    "Threats",
    gsb.threats && gsb.threats.length
        ? gsb.threats.join(", ")
        : "None",
    gsbY + 51
);

gsbRow(
    "Status",
    gsbStatus,
    gsbY + 69
);


// --------------------
// Move below card
// --------------------

doc.y = gsbY + gsbHeight + 15;
// ======================================================
// REDIRECT CHAIN
// ======================================================

sectionTitle("REDIRECT CHAIN");

const redirectX = 40;
const redirectY = doc.y;
const redirectWidth = PAGE_WIDTH - 80;

const redirects =
    scanResult.metadata.redirects?.chain || [];


    const redirectHeight =
    Math.max(
        45,
        redirects.length * 18 + 30
    );

doc.roundedRect(
    redirectX,
    redirectY,
    redirectWidth,
    redirectHeight,
    8
)
.fillAndStroke(
    COLORS.white,
    COLORS.border
);

doc.y = redirectY + 15;

if (redirects.length === 0) {

    doc.fillColor(COLORS.gray)
        .font("Helvetica")
        .fontSize(10)
        .text(
            "No redirects detected",
            redirectX + 15,
            doc.y
        );

}
else {

    let currentY = doc.y;

    redirects.forEach((link, index) => {

        const urlObj = new URL(link);

        const hostname = urlObj.hostname;

        doc.fillColor(COLORS.black)
            .font("Helvetica")
            .fontSize(10)
            .text(
                hostname,
                redirectX + 20,
                currentY,
                {
                    width: redirectWidth - 40,
                    lineBreak: false
                }
            );

        currentY += 16;

        if (index < redirects.length - 1) {

            doc.fillColor(COLORS.blue)
                .font("Helvetica-Bold")
                .fontSize(11)
                .text(
                    "↓",
                    redirectX + 24,
                    currentY,
                    {
                        lineBreak: false
                    }
                );

            currentY += 14;

        }

    });

    doc.y = currentY;

}

doc.y = redirectY + redirectHeight + 15;
// ======================================================
// ANALYSIS SUMMARY
// ======================================================

sectionTitle("ANALYSIS SUMMARY");

const summaryX = 40;
const summaryY = doc.y;
const summaryWidth = PAGE_WIDTH - 80;
const summaryHeight = 120;

doc.roundedRect(
    summaryX,
    summaryY,
    summaryWidth,
    summaryHeight,
    8
)
.fillAndStroke(
    COLORS.white,
    COLORS.border
);

doc.y = summaryY + 12;

infoRow(
    "Overall Risk",
    scanResult.verdict
);

let confidence = "High";

if (scanResult.score >= 60)
    confidence = "Very High";
else if (scanResult.score >= 30)
    confidence = "High";
else
    confidence = "High";

infoRow(
    "Confidence",
    confidence
);

infoRow(
    "Risk Score",
    `${scanResult.score} / 100`
);

infoRow(
    "Scan Engine",
    "Scan The URL v1.0"
);

// Recommendation

let recommendation;

switch (scanResult.verdict) {

    case "Safe":
        recommendation =
            "Safe to visit.";
        break;

    case "Medium Risk":
        recommendation =
            "Proceed with caution.";
        break;

    case "High Risk":
        recommendation =
            "Avoid opening this URL.";
        break;

    default:
        recommendation =
            "-";

}

infoRow(
    "Recommendation",
    recommendation
);

doc.y = summaryY + summaryHeight + 15;

console.log("doc.y =", doc.y);
console.log("page.height =", doc.page.height);

// ======================================================
// FOOTER (LAST PAGE ONLY)
// ======================================================

const footerY = doc.y

// Line
doc.moveTo(40, footerY - 8)
    .lineTo(PAGE_WIDTH - 40, footerY - 8)
    .strokeColor(COLORS.border)
    .lineWidth(0.8)
    .stroke();

// Left
doc.fillColor(COLORS.gray)
    .font("Helvetica")
    .fontSize(8);

doc.text(
    "Generated by Scan The URL",
    40,
    footerY
);

doc.text(
    "Developed by LoyDas",
    40,
    footerY + 10
);

// Center
doc.fillColor(COLORS.black)
    .font("Helvetica-Bold")
    .fontSize(8);

doc.text(
    "End of Report",
    0,
    footerY + 5,
    {
        width: PAGE_WIDTH,
        align: "center"
    }
);

// Right
doc.fillColor(COLORS.gray)
    .font("Helvetica")
    .fontSize(8);

doc.text(
    new Date().toLocaleString(),
    PAGE_WIDTH - 180,
    footerY,
    {
        width: 140,
        align: "right"
    }
);

doc.text(
    "© 2026 Scan The URL",
    PAGE_WIDTH - 180,
    footerY + 10,
    {
        width: 140,
        align: "right"
    }
);

doc.end();





    return fileName;

}

module.exports = {

    generatePDF

};