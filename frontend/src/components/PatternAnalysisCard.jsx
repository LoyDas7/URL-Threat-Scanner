import { ScanSearch } from "lucide-react";
import SectionCard from "./shared/SectionCard.jsx";
import MetadataField from "./shared/MetadataField.jsx";
import { isEmpty } from "../utils/formatters.js";

export default function PatternAnalysisCard({ metadata }) {
  const { brand, entropy, punycode, unicode, keywords } = metadata || {};

  return (
    <SectionCard
      icon={ScanSearch}
      title="Pattern Analysis"
      description="Signals commonly used to spot impersonation"
    >
      <MetadataField
        label="Brand Match"
        value={isEmpty(brand?.matched) ? "None detected" : brand.matched}
      />
      <MetadataField label="Entropy" value={entropy?.value} />
      <MetadataField label="Punycode Detected" value={punycode?.detected} />
      <MetadataField label="Unicode Detected" value={unicode?.detected} />
      <MetadataField
        label="Suspicious Keywords"
        value={isEmpty(keywords?.matched) ? "None detected" : keywords.matched}
      />
    </SectionCard>
  );
}
