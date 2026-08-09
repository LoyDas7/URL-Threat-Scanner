import { Radar } from "lucide-react";
import SectionCard from "./shared/SectionCard.jsx";
import MetadataField from "./shared/MetadataField.jsx";

export default function VirusTotalCard({ metadata }) {
  const vt = metadata?.virusTotal;

  if (!vt) return null;

  if (vt.available === false) {
    return (
      <SectionCard
        icon={Radar}
        title="VirusTotal"
        description="Multi-engine URL reputation check"
      >
        <p className="text-sm text-ink-muted">
          VirusTotal data was not available for this scan.
        </p>
      </SectionCard>
    );
  }

  const malicious = Number(vt.malicious) || 0;
  const suspicious = Number(vt.suspicious) || 0;
  const harmless = Number(vt.harmless) || 0;
  const undetected = Number(vt.undetected) || 0;

  const total =
    malicious +
    suspicious +
    harmless +
    undetected;

  return (
    <SectionCard
      icon={Radar}
      title="VirusTotal"
      description="Multi-engine URL reputation check"
    >
      <div className="grid grid-cols-2 gap-3">
        <MetadataField
          label="Malicious"
          value={malicious}
        />

        <MetadataField
          label="Suspicious"
          value={suspicious}
        />

        <MetadataField
          label="Harmless"
          value={harmless}
        />

        <MetadataField
          label="Undetected"
          value={undetected}
        />
      </div>

      {total > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-ink-muted">
              Detection distribution
            </span>

            <span className="text-xs text-ink-muted">
              {total} engines
            </span>
          </div>

          <div className="flex h-2 w-full overflow-hidden rounded-full bg-base-border">
            {malicious > 0 && (
              <div
                className="h-full bg-risk-critical"
                style={{
                  width: `${(malicious / total) * 100}%`,
                }}
              />
            )}

            {suspicious > 0 && (
              <div
                className="h-full bg-risk-medium"
                style={{
                  width: `${(suspicious / total) * 100}%`,
                }}
              />
            )}

            {harmless > 0 && (
              <div
                className="h-full bg-risk-safe"
                style={{
                  width: `${(harmless / total) * 100}%`,
                }}
              />
            )}

            {undetected > 0 && (
              <div
                className="h-full bg-base-border"
                style={{
                  width: `${(undetected / total) * 100}%`,
                }}
              />
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}