import { Network } from "lucide-react";
import SectionCard from "./shared/SectionCard.jsx";
import MetadataField from "./shared/MetadataField.jsx";
import { prettifyKey } from "../utils/formatters.js";

export default function DnsCard({ metadata }) {
  const dns = metadata?.dns;
  if (!dns) return null;

  // Render whatever record types the API actually returned
  // (mxRecords, nsRecords, aRecords, or anything else) without assuming a fixed set.
  const entries = Object.entries(dns);

  return (
    <SectionCard icon={Network} title="DNS Analysis" description="Name server and mail records">
      {entries.length === 0 ? (
        <p className="text-sm text-ink-muted">No DNS records available.</p>
      ) : (
        entries.map(([key, value]) => (
          <MetadataField key={key} label={prettifyKey(key)} value={value} />
        ))
      )}
    </SectionCard>
  );
}
