// src/components/ScanResult.jsx
import VerdictBadge from "./VerdictBadge.jsx";
import RiskScore from "./RiskScore.jsx";
import FindingsList from "./FindingsList.jsx";
import MetadataDashboard from "./MetadataDashboard.jsx";
import DownloadReportButton from "./DownloadReportButton.jsx";
import AISecurityAssistant from "./AI/AISecurityAssistant.jsx";
import { truncateMiddle } from "../utils/formatters.js";

export default function ScanResult({ result }) {
  if (!result) return null;

  const { scannedURL, score, verdict, findings, metadata, pdf } = result;

  return (
    <>
      <section className="mx-auto mt-10 max-w-5xl animate-fade-up px-5 pb-20">
        <div className="card-hover rounded-xl border border-base-border bg-base-surface p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                Scanned URL
              </p>
              <p
                className="mt-1 break-anywhere font-mono text-sm text-ink-primary"
                title={scannedURL}
              >
                {truncateMiddle(scannedURL, 80)}
              </p>
            </div>
            <VerdictBadge verdict={verdict} size="lg" />
          </div>

          <div className="mt-6">
            <RiskScore score={score} verdict={verdict} />
          </div>

          {pdf && (
            <div className="mt-6 flex animate-fade-scale-in justify-end border-t border-base-border/60 pt-5">
              <DownloadReportButton key={pdf} fileName={pdf} scannedURL={scannedURL} />
            </div>
          )}
        </div>

        <div className="mt-6 animate-card-in" style={{ animationDelay: "80ms" }}>
          <FindingsList findings={findings} />
        </div>

        <div className="mt-8 animate-card-in" style={{ animationDelay: "140ms" }}>
          <MetadataDashboard metadata={metadata} />
        </div>
      </section>

      {/* AISecurityAssistant renders itself via a portal onto <body>, so its
          position: fixed button/panel stay pinned to the real viewport
          regardless of where it's placed here or what transforms exist
          on ancestors (e.g. route page-fade animations). */}
      <AISecurityAssistant key={scannedURL} scanResult={result} />
    </>
  );
}