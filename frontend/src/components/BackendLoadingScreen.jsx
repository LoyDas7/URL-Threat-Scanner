import { CheckCircle2, WifiOff } from "lucide-react";

/**
 * Full-screen overlay shown only during the initial backend-readiness
 * check. Purely presentational - all retry/status logic lives in
 * useBackendHealth. isLeaving triggers the fade/scale exit transition
 * once the parent decides it's time to reveal the real app.
 */
export default function BackendLoadingScreen({ status, message, onRetry, isLeaving }) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-base-bg px-6 transition-opacity duration-500 ${
        isLeaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Same faint grid used site-wide, kept static (no motion) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(45, 212, 191, 0.1), transparent), linear-gradient(rgba(45, 212, 191, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(45, 212, 191, 0.06) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 44px 44px, 44px 44px",
        }}
        aria-hidden="true"
      />

      <div
        className={`relative flex flex-col items-center text-center transition-transform duration-500 ${
          isLeaving ? "scale-95" : "scale-100"
        }`}
      >
        {/* Logo with a rotating ring while checking, still + checkmark once ready */}
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
          {status === "checking" && (
            <span
              className="absolute inset-0 animate-spin rounded-full border-2 border-base-border border-t-accent"
              aria-hidden="true"
            />
          )}
          {status === "ready" && (
            <span
              className="absolute inset-0 animate-fade-scale-in rounded-full border-2 border-risk-safe/60"
              aria-hidden="true"
            />
          )}
          <img
            src="/logo.png"
            alt="Scan The URL logo"
            className="h-12 w-12 object-contain drop-shadow-[0_0_18px_rgba(45,212,191,0.35)]"
          />
        </div>

        <h1 className="font-brand text-2xl font-semibold tracking-tight text-ink-primary">
          Scan The URL
        </h1>

        <div className="mt-4 min-h-[3.5rem]" aria-live="polite">
          {status === "checking" && (
            <>
              <p className="font-display text-base font-semibold text-ink-primary">
                Initializing Security Scanner
              </p>
              <p key={message} className="mt-1.5 animate-fade-up text-sm text-ink-secondary">
                {message}
              </p>
            </>
          )}

          {status === "ready" && (
            <>
              <p className="flex animate-fade-scale-in items-center justify-center gap-2 font-display text-base font-semibold text-risk-safe">
                <CheckCircle2 size={20} />
                Scanner Ready
              </p>
              <p className="mt-1.5 text-sm text-ink-secondary">You're ready to scan.</p>
            </>
          )}

          {status === "error" && (
            <>
              <p className="flex items-center justify-center gap-2 font-display text-base font-semibold text-risk-critical">
                <WifiOff size={20} />
                Unable to connect to the scanner
              </p>
              <p className="mt-1.5 text-sm text-ink-secondary">
                Please check your internet connection and try again.
              </p>
            </>
          )}
        </div>

        {status === "error" && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-press mt-5 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-base-bg transition-colors duration-200 hover:bg-accent-glow"
          >
            Retry Connection
          </button>
        )}
      </div>
    </div>
  );
}
