import { Eye } from "lucide-react";
import SectionCard from "./shared/SectionCard.jsx";
import MetadataField from "./shared/MetadataField.jsx";

export default function GoogleSafeBrowsingCard({ metadata }) {
  const gsb = metadata?.googleSafeBrowsing;

  if (!gsb) return null;

  if (gsb.available === false) {
    return (
      <SectionCard
        icon={Eye}
        title="Google Safe Browsing"
        description="Google's threat list check"
      >
        <p className="text-sm text-ink-muted">
          Google Safe Browsing data was not available for this scan.
        </p>
      </SectionCard>
    );
  }

  const threats = Array.isArray(gsb.threats)
    ? gsb.threats
    : gsb.threats
      ? [gsb.threats]
      : [];

  const status = gsb.safe ? "No threats found" : "Threats detected";

  return (
    <SectionCard
      icon={Eye}
      title="Google Safe Browsing"
      description="Google's threat list check"
    >
      <MetadataField label="Status" value={status} />

      <MetadataField
        label="Available"
        value={gsb.available ? "Yes" : "No"}
      />

      <MetadataField
        label="Threats"
        value={threats.length > 0 ? threats : "None"}
      />
    </SectionCard>
  );
}