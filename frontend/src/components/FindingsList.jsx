import { ShieldCheck, TriangleAlert } from "lucide-react";

export default function FindingsList({ findings }) {
  const hasFindings = Array.isArray(findings) && findings.length > 0;

  return (
    <div className="rounded-xl border border-base-border bg-base-surface p-5">
      <h3 className="mb-3 font-display text-sm font-semibold tracking-wide text-ink-primary">
        Findings
      </h3>

      {!hasFindings ? (
        <div className="flex animate-card-in items-center gap-2.5 rounded-lg bg-risk-safe/10 px-4 py-3 text-sm text-risk-safe">
          <ShieldCheck size={18} />
          No suspicious indicators detected.
        </div>
      ) : (
        <ul className="space-y-2">
          {findings.map((finding, i) => (
            <li
              key={i}
              className="flex animate-card-in items-start gap-2.5 rounded-lg bg-risk-high/10 px-4 py-2.5 text-sm text-ink-primary"
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              <TriangleAlert size={16} className="mt-0.5 shrink-0 text-risk-high" />
              <span>{finding}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
