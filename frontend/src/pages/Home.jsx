// src/pages/Home.jsx
import { useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import Hero from "../components/Hero.jsx";
import UrlScanner from "../components/UrlScanner.jsx";
import ScanProgress from "../components/ScanProgress.jsx";
import ScanResult from "../components/ScanResult.jsx";

// Brief hold on the "Scan complete" checkmark before revealing results -
// this does not delay the real request, only the reveal of an already-
// arrived response, mirroring the same pattern already used for the
// backend-readiness screen's "Scanner Ready" moment.
const COMPLETE_HOLD_MS = 600;

export default function Home() {
  // idle | scanning | completing | done
  const [scanPhase, setScanPhase] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const pendingDataRef = useRef(null);
  const holdTimeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(holdTimeoutRef.current);
  }, []);

  function handleScanStart() {
    clearTimeout(holdTimeoutRef.current);
    setScanPhase("scanning");
    setError(null);
    setResult(null);
  }

  function handleScanSuccess(data) {
    if (!data || typeof data !== "object" || !("verdict" in data)) {
      setError({ message: "Received an unexpected response from the scanning service." });
      setScanPhase("done");
      return;
    }

    // The real response has already arrived here - this only delays
    // *revealing* it briefly so "Scan complete" can register visually.
    pendingDataRef.current = data;
    setScanPhase("completing");
    holdTimeoutRef.current = setTimeout(() => {
      setResult(pendingDataRef.current);
      setScanPhase("done");
    }, COMPLETE_HOLD_MS);
  }

  function handleScanError(err) {
    clearTimeout(holdTimeoutRef.current);
    setError(err);
    setScanPhase("done");
  }

  const isActive = scanPhase === "scanning" || scanPhase === "completing";

  return (
    <div>
      <Hero>
        <UrlScanner
          onScanStart={handleScanStart}
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
        />

        {isActive && (
          <ScanProgress status={scanPhase === "completing" ? "complete" : "running"} />
        )}

        {scanPhase === "done" && error && (
          <div
            className="mx-auto mt-4 flex max-w-2xl animate-fade-up items-start gap-2.5 rounded-lg border border-risk-critical/30 bg-risk-critical/10 px-4 py-3 text-sm text-risk-critical"
            role="alert"
          >
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            {error.message}
          </div>
        )}
      </Hero>

      {scanPhase === "done" && result && <ScanResult result={result} />}
    </div>
  );
}