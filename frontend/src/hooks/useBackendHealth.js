import { useEffect, useRef, useState } from "react";
import { checkHealth } from "../services/api.js";

// Attempt schedule: try immediately, then back off if it fails.
// Not a fixed artificial delay - the app only leaves "checking" once
// /health actually responds (or every attempt below is exhausted).
const RETRY_DELAYS_MS = [0, 2000, 4000];

const ROTATING_MESSAGES = [
  "Initializing Security Scanner...",
  "Connecting to Scan The URL...",
  "Waking up the security engine...",
  "Establishing secure connection...",
  "Preparing the security scanner...",
  "Almost ready...",
];

const MESSAGE_INTERVAL_MS = 2800;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Drives the startup backend-readiness check.
 * status: "checking" | "ready" | "error"
 * Runs once on mount, and again whenever retry() is called - never polls
 * on an interval once the backend is confirmed ready.
 */
export default function useBackendHealth() {
  const [status, setStatus] = useState("checking");
  const [messageIndex, setMessageIndex] = useState(0);
  const [retryToken, setRetryToken] = useState(0);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    setStatus("checking");
    setMessageIndex(0);

    async function runHealthCheck() {
      for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
        if (cancelledRef.current) return;
        if (RETRY_DELAYS_MS[attempt] > 0) {
          await sleep(RETRY_DELAYS_MS[attempt]);
          if (cancelledRef.current) return;
        }

        try {
          const data = await checkHealth();
          if (cancelledRef.current) return;
          if (data?.status === "ok") {
            setStatus("ready");
            return;
          }
        } catch (err) {
          // Expected during Render cold starts / transient network issues -
          // logged for local debugging only, never surfaced to the user.
          console.error(`Health check attempt ${attempt + 1} failed:`, err);
        }
      }

      if (!cancelledRef.current) {
        setStatus("error");
      }
    }

    runHealthCheck();

    return () => {
      cancelledRef.current = true;
    };
  }, [retryToken]);

  // Rotate the status message only while actively checking.
  useEffect(() => {
    if (status !== "checking") return;

    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % ROTATING_MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [status]);

  function retry() {
    setRetryToken((t) => t + 1);
  }

  return {
    status,
    message: ROTATING_MESSAGES[messageIndex],
    retry,
  };
}
