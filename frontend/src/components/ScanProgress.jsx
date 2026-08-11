// src/components/ScanProgress.jsx
import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

// These describe the checks the backend is known to perform (per the
// existing metadata dashboard: URL/pattern analysis, DNS, WHOIS, SSL,
// redirects, threat intelligence). The backend only returns one final
// response - it doesn't report progress on each one individually - so
// this cycles through them as a visual approximation of a single in-flight
// request, and never marks anything "complete" that hasn't actually
// finished: the real completion signal always comes from the parent
// (status="complete"), not from this timer.
const STAGES = [
  { label: "Parsing URL structure...", subtext: "Breaking down the URL into security-relevant components." },
  { label: "Resolving domain information...", subtext: "Checking domain and network records." },
  { label: "Collecting DNS records...", subtext: "Analyzing available DNS information." },
  { label: "Inspecting domain registration...", subtext: "Reviewing WHOIS and registration details." },
  { label: "Inspecting SSL certificate...", subtext: "Verifying certificate validity and security properties." },
  { label: "Following redirect chain...", subtext: "Checking where the URL leads." },
  { label: "Analyzing URL patterns...", subtext: "Looking for suspicious structures and indicators." },
  { label: "Checking security signals...", subtext: "Comparing the URL against available threat intelligence sources." },
  { label: "Running threat analysis...", subtext: "Combining security indicators to assess the URL." },
  { label: "Finalizing security assessment...", subtext: "Preparing your scan results." },
];

const PREPARING_MS = 500;
const STAGE_INTERVAL_MS = 1000;

/**
 * status: "running" while the real request is in flight, "complete" once
 * the parent has confirmed the actual API response arrived. This component
 * never decides on its own that the scan is done - it only holds at the
 * last stage and waits to be told.
 */
export default function ScanProgress({ status }) {
  const [stageIndex, setStageIndex] = useState(-1); // -1 = "Preparing security scan..."
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (status !== "running") return;

    setStageIndex(-1);

    function advance(index) {
      setStageIndex(index);
      if (index < STAGES.length - 1) {
        timeoutRef.current = setTimeout(() => advance(index + 1), STAGE_INTERVAL_MS);
      }
      // At the last stage, we simply hold here - no further timer - until
      // the parent flips status to "complete" once the real response lands.
    }

    timeoutRef.current = setTimeout(() => advance(0), PREPARING_MS);

    return () => clearTimeout(timeoutRef.current);
  }, [status]);

  const isComplete = status === "complete";
  const previousStage = stageIndex > 0 ? STAGES[stageIndex - 1] : null;
  const currentStage = stageIndex >= 0 ? STAGES[stageIndex] : null;

  const progressPercent = isComplete
    ? 100
    : stageIndex < 0
      ? 4
      : ((stageIndex + 1) / STAGES.length) * 100;

  return (
    <div
      className="mx-auto mt-6 max-w-2xl animate-fade-up rounded-xl border border-base-border bg-base-surface p-5"
      role="status"
      aria-live="polite"
    >
      {/* Most recently completed stage - small, muted, fades as the next one takes over */}
      <div className="h-4">
        {!isComplete && previousStage && (
          <p
            key={`prev-${stageIndex}`}
            className="flex animate-fade-up items-center gap-1.5 text-xs text-ink-muted"
          >
            <CheckCircle2 size={12} className="text-risk-safe" />
            {previousStage.label.replace(/\.\.\.$/, "")}
          </p>
        )}
      </div>

      {/* Current line */}
      <div className="mt-1.5 flex items-start gap-2.5">
        {isComplete ? (
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-risk-safe" />
        ) : (
          <Loader2 size={18} className="mt-0.5 shrink-0 animate-spin text-accent" />
        )}
        <div key={isComplete ? "complete" : stageIndex} className="min-w-0 animate-fade-up">
          <p className="font-display text-sm font-semibold text-ink-primary">
            {isComplete
              ? "Scan complete"
              : currentStage
                ? currentStage.label
                : "Preparing security scan..."}
          </p>
          <p className="mt-0.5 text-xs text-ink-secondary">
            {isComplete
              ? "Security analysis finished."
              : currentStage
                ? currentStage.subtext
                : "Getting ready to analyze this URL."}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-base-raised">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isComplete ? "bg-risk-safe" : "bg-accent"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="mt-1.5 text-right text-[11px] text-ink-muted">
        {isComplete
          ? `${STAGES.length} of ${STAGES.length} checks`
          : stageIndex >= 0
            ? `Step ${stageIndex + 1} of ${STAGES.length}`
            : "Starting..."}
      </p>
    </div>
  );
}