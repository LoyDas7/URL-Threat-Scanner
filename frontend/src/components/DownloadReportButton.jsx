import { useEffect, useState } from "react";
import { FileDown, CheckCircle2 } from "lucide-react";
import { getReportUrl } from "../services/api.js";

/**
 * Renders nothing when there's no report filename - callers don't need
 * to guard this themselves.
 *
 * The backend deletes each report file from disk after it's downloaded
 * once (see downloadReport controller), so a second click on the same
 * filename would fail. Rather than let that happen silently, the button
 * flips to a "Downloaded" state after the first click and stays that way
 * until a new scan produces a new filename.
 */
export default function DownloadReportButton({ fileName, scannedURL }) {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const href = getReportUrl(fileName);

  // If the parent re-renders with a new report (a fresh scan), reset state.
  useEffect(() => {
    setIsDownloaded(false);
  }, [fileName]);

  if (!href) return null;

  if (isDownloaded) {
    return (
      <span
        className="inline-flex w-full animate-fade-scale-in cursor-default items-center justify-center gap-2 rounded-lg border border-risk-safe/40 bg-risk-safe/10 px-4 py-2.5 text-sm font-semibold text-risk-safe sm:w-auto"
        role="status"
      >
        <CheckCircle2 size={16} />
        Downloaded
      </span>
    );
  }

  return (
    <a
      href={href}
      download={fileName}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => setIsDownloaded(true)}
      aria-label={`Download PDF security report${scannedURL ? ` for ${scannedURL}` : ""}`}
      className="btn-press inline-flex w-full items-center justify-center gap-2 rounded-lg border border-accent/40 bg-accent/5 px-4 py-2.5 text-sm font-semibold text-accent transition-colors duration-200 hover:bg-accent/10 sm:w-auto"
    >
      <FileDown size={16} />
      Download PDF Report
    </a>
  );
}