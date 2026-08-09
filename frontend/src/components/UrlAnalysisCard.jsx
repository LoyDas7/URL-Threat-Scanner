import { Link2 } from "lucide-react";
import SectionCard from "./shared/SectionCard.jsx";
import MetadataField from "./shared/MetadataField.jsx";

export default function UrlAnalysisCard({ metadata }) {
  const { protocol, ipAddress, urlLength, domain, subdomain, tld, atSymbol } = metadata || {};

  return (
    <SectionCard icon={Link2} title="URL Analysis" description="Structure of the scanned link">
      <MetadataField label="Protocol" value={protocol?.protocol} mono />
      <MetadataField label="Secure (HTTPS)" value={protocol?.secure} />
      <MetadataField label="Hostname" value={ipAddress?.hostname} mono />
      <MetadataField label="Is IP Address" value={ipAddress?.isIPAddress} />
      <MetadataField label="URL Length" value={urlLength?.length} />
      <MetadataField label="Domain" value={domain?.hostname} mono />
      <MetadataField label="Contains Hyphen" value={domain?.hasHyphen} />
      <MetadataField label="Subdomain Count" value={subdomain?.count} />
      <MetadataField label="TLD" value={tld?.value} mono />
      <MetadataField label="Suspicious TLD" value={tld?.suspicious} />
      <MetadataField label="Contains '@' Symbol" value={atSymbol?.present} />
    </SectionCard>
  );
}
