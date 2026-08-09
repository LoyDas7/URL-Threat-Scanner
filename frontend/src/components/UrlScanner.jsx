import { useState, useRef } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { scanUrl } from "../services/api.js";
import { isValidUrlFormat } from "../utils/formatters.js";

/**
 * Props:
 *  - onScanStart(): called right before the request goes out
 *  - onScanSuccess(data): called with the raw API response
 *  - onScanError(error): called with a normalized { type, message }
 */
export default function UrlScanner({ onScanStart, onScanSuccess, onScanError }) {
  const [value, setValue] = useState("");
  const [localError, setLocalError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inFlight = useRef(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");

    const trimmed = value.trim();

    if (!trimmed) {
      setLocalError("Please enter a URL.");
      return;
    }

    if (!isValidUrlFormat(trimmed)) {
      setLocalError("That doesn't look like a valid URL. Try something like example.com.");
      return;
    }

    if (inFlight.current) return; // prevent duplicate requests
    inFlight.current = true;
    setIsScanning(true);
    onScanStart?.();

    const normalizedUrl = trimmed.match(/^https?:\/\//i) ? trimmed : `https://${trimmed}`;

    try {
      const data = await scanUrl(normalizedUrl);
      onScanSuccess?.(data);
    } catch (err) {
      onScanError?.(err);
    } finally {
      setIsScanning(false);
      inFlight.current = false;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`relative overflow-hidden rounded-xl border bg-base-surface transition-all duration-300 ${
          isFocused ? "border-accent/60 shadow-glow" : "border-base-border shadow-none"
        }`}
      >
        {isScanning && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-accent/25 to-transparent animate-scanbeam" />
          </div>
        )}

        <div className="relative flex flex-col gap-2 p-2 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2.5 px-3 py-2.5">
            <span className="font-mono text-sm text-accent" aria-hidden="true">
              &gt;
            </span>
            <label htmlFor="url-input" className="sr-only">
              URL to scan
            </label>
            <input
              id="url-input"
              type="text"
              inputMode="url"
              autoComplete="off"
              spellCheck="false"
              placeholder="paste-a-url-to-scan.com"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isScanning}
              className="w-full min-w-0 bg-transparent font-mono text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isScanning}
            className="btn-press flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-base-bg transition-colors duration-200 hover:bg-accent-glow disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100 sm:py-2.5"
          >
            {isScanning ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search size={16} />
                Scan URL
              </>
            )}
          </button>
        </div>
      </div>

      {localError && (
        <p
          className="mt-2.5 flex animate-fade-up items-center gap-1.5 text-sm text-risk-critical"
          role="alert"
        >
          <AlertCircle size={15} />
          {localError}
        </p>
      )}

      {isScanning && (
        <p className="mt-2.5 animate-fade-up text-sm text-ink-secondary">
          Analyzing URL... running DNS, WHOIS, SSL, and threat-intelligence checks.
        </p>
      )}
    </form>
  );
}
