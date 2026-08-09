import { useEffect, useRef, useState } from "react";
import { getVerdictStyle } from "../utils/formatters.js";

const BAR_COLOR_CLASSES = {
  "risk-safe": "bg-risk-safe",
  "risk-low": "bg-risk-low",
  "risk-medium": "bg-risk-medium",
  "risk-high": "bg-risk-high",
  "risk-critical": "bg-risk-critical",
  "risk-unknown": "bg-risk-unknown",
};

const TEXT_COLOR_CLASSES = {
  "risk-safe": "text-risk-safe",
  "risk-low": "text-risk-low",
  "risk-medium": "text-risk-medium",
  "risk-high": "text-risk-high",
  "risk-critical": "text-risk-critical",
  "risk-unknown": "text-risk-unknown",
};

// The API doesn't guarantee a max of 100 - scores can exceed it.
// We scale the visual bar against a soft ceiling but always show the real number.
const VISUAL_CEILING = 120;

export default function RiskScore({ score, verdict }) {
  const style = getVerdictStyle(verdict);
  const numericScore = typeof score === "number" ? score : 0;
  const overflow = numericScore > VISUAL_CEILING;
  const fillPercent = Math.min(100, (numericScore / VISUAL_CEILING) * 100);

  const [displayScore, setDisplayScore] = useState(0);
  const [fillReady, setFillReady] = useState(false);
  const frameRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayScore(numericScore);
      setFillReady(true);
      return;
    }

    setDisplayScore(0);
    setFillReady(false);
    // Let the bar's width transition kick in on the next frame.
    const fillTimer = requestAnimationFrame(() => setFillReady(true));

    const duration = 900; // ms - fast enough to feel responsive, not a spectacle
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * numericScore));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameRef.current);
      cancelAnimationFrame(fillTimer);
    };
  }, [numericScore]);

  return (
    <div>
      <div className="mb-2 flex items-end justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          Risk score
        </span>
        <span className={`font-mono text-2xl font-semibold tabular-nums ${TEXT_COLOR_CLASSES[style.color]}`}>
          {displayScore}
          {overflow && displayScore === numericScore && <span className="text-sm">+</span>}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-base-raised">
        <div
          className={`h-full rounded-full transition-all duration-[900ms] ease-out ${BAR_COLOR_CLASSES[style.color]}`}
          style={{ width: fillReady ? `${fillPercent}%` : "0%" }}
        />
      </div>
      {overflow && (
        <p className="mt-1.5 text-xs text-ink-muted">
          Score exceeds the typical scale — multiple strong risk signals detected.
        </p>
      )}
    </div>
  );
}
