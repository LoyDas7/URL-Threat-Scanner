import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  // Fails loudly in dev instead of silently sending requests to "undefined/api/scan"
  console.error(
    "VITE_API_URL is not set. Create a .env file with VITE_API_URL=<your backend url>."
  );
}

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // scans can take a while (WHOIS/DNS/SSL/VirusTotal lookups)
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Sends a URL to the real backend for security analysis.
 * Returns the raw response payload from POST /api/scan.
 * Throws a normalized error object: { type, message } so the UI
 * never has to inspect axios internals.
 */
export async function scanUrl(url) {
  try {
    const response = await client.post("/api/scan", { url });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

/**
 * Builds the download URL for a previously generated PDF report.
 * Does not call the backend itself - the browser navigates/downloads
 * directly from this URL. Points at the existing report route,
 * `${VITE_API_URL}/api/report/:fileName`.
 */
export function getReportUrl(fileName) {
  if (!fileName) return null;
  return `${API_BASE_URL}/api/report/${encodeURIComponent(fileName)}`;
}

/**
 * Sends a message (initial explanation request or a follow-up question)
 * to the AI Security Assistant, along with the current scan's summary.
 * Returns the raw response payload from POST /api/ai/chat, e.g. { reply }.
 * Throws the same normalized error shape as scanUrl.
 */
export async function askAI(message, scanResult) {
  try {
    const response = await client.post("/api/ai/chat", { message, scanResult });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

function normalizeError(error) {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return {
        type: "timeout",
        message: "The scan is taking longer than expected. Please try again.",
      };
    }

    if (!error.response) {
      return {
        type: "network",
        message:
          "Unable to connect to the scanning service. Please check your connection and try again.",
      };
    }

    const status = error.response.status;
    const backendMessage =
      error.response.data?.message || error.response.data?.error;

    if (status === 400) {
      return {
        type: "validation",
        message: backendMessage || "That URL could not be processed. Please check it and try again.",
      };
    }

    if (status === 429) {
      return {
        type: "rate_limit",
        message: "Too many scan requests right now. Please wait a moment and try again.",
      };
    }

    if (status >= 500) {
      return {
        type: "server",
        message: "The scanning service ran into a problem. Please try again shortly.",
      };
    }

    return {
      type: "unknown",
      message: backendMessage || "Something went wrong while scanning this URL.",
    };
  }

  return {
    type: "unknown",
    message: "An unexpected error occurred. Please try again.",
  };
}
