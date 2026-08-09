// Central place for "how do we safely turn arbitrary API data into text"
// so components never write `value || "Not available"` inline.

export const NOT_AVAILABLE = "Not available";

export function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

/** Turns "creationDate" into "Creation Date", "mxRecords" into "Mx Records", etc. */
export function prettifyKey(key) {
  const withSpaces = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ");
  return withSpaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace(/\bIp\b/, "IP")
    .replace(/\bUrl\b/, "URL")
    .replace(/\bTld\b/, "TLD")
    .replace(/\bDns\b/, "DNS")
    .replace(/\bSsl\b/, "SSL")
    .replace(/\bNs\b/, "NS")
    .replace(/\bMx\b/, "MX");
}

export function formatBoolean(value) {
  if (typeof value !== "boolean") return NOT_AVAILABLE;
  return value ? "Yes" : "No";
}

export function formatValue(value) {
  if (isEmpty(value)) return NOT_AVAILABLE;
  if (typeof value === "boolean") return formatBoolean(value);
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return isLikelyDate(value) ? formatDate(value) : value;
  return String(value);
}

function isLikelyDate(str) {
  return /^\d{4}-\d{2}-\d{2}/.test(str) || /\d{4}\s+GMT$/.test(str) || /^[A-Z][a-z]{2}\s\d{1,2}\s\d{4}/.test(str);
}

export function formatDate(dateStr) {
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatAgeDays(ageDays) {
  if (typeof ageDays !== "number") return NOT_AVAILABLE;
  const years = Math.floor(ageDays / 365);
  if (years >= 1) {
    return `${ageDays.toLocaleString()} days (~${years} yr${years === 1 ? "" : "s"})`;
  }
  return `${ageDays.toLocaleString()} days`;
}

/** Verdict -> visual language. Unknown verdicts fall back gracefully. */
const VERDICT_MAP = {
  safe: { label: "Safe", color: "risk-safe", icon: "check" },
  low: { label: "Low Risk", color: "risk-low", icon: "info" },
  medium: { label: "Medium Risk", color: "risk-medium", icon: "alert-triangle" },
  high: { label: "High Risk", color: "risk-high", icon: "alert-triangle" },
  critical: { label: "Critical", color: "risk-critical", icon: "x-octagon" },
};

export function getVerdictStyle(verdict) {
  if (!verdict || typeof verdict !== "string") {
    return { label: "Unknown", color: "risk-unknown", icon: "help-circle" };
  }
  const key = verdict.trim().toLowerCase();
  return VERDICT_MAP[key] || { label: verdict, color: "risk-unknown", icon: "help-circle" };
}

export function truncateMiddle(str, max = 60) {
  if (!str || str.length <= max) return str;
  const half = Math.floor((max - 3) / 2);
  return `${str.slice(0, half)}...${str.slice(str.length - half)}`;
}

export function isValidUrlFormat(input) {
  if (!input || !input.trim()) return false;
  try {
    const candidate = input.match(/^https?:\/\//i) ? input : `https://${input}`;
    const url = new URL(candidate);
    return Boolean(url.hostname && url.hostname.includes("."));
  } catch {
    return false;
  }
}
