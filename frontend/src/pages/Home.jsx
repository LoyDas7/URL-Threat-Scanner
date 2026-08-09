import { useState } from "react";
import { AlertCircle } from "lucide-react";
import Hero from "../components/Hero.jsx";
import UrlScanner from "../components/UrlScanner.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ScanResult from "../components/ScanResult.jsx";

export default function Home() {
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  function handleScanStart() {
    setIsScanning(true);
    setError(null);
    setResult(null);
  }

  function handleScanSuccess(data) {
    setIsScanning(false);

    if (!data || typeof data !== "object" || !("verdict" in data)) {
      setError({ message: "Received an unexpected response from the scanning service." });
      return;
    }

    setResult(data);
  }

  function handleScanError(err) {
    setIsScanning(false);
    setError(err);
  }

  return (
    <div>
      <Hero>
        <UrlScanner
          onScanStart={handleScanStart}
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
        />

        {isScanning && <LoadingState />}

        {error && !isScanning && (
          <div
            className="mx-auto mt-4 flex max-w-2xl animate-fade-up items-start gap-2.5 rounded-lg border border-risk-critical/30 bg-risk-critical/10 px-4 py-3 text-sm text-risk-critical"
            role="alert"
          >
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            {error.message}
          </div>
        )}
      </Hero>

      {result && !isScanning && <ScanResult result={result} />}
    </div>
  );
}
