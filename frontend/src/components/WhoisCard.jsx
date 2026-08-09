import { FileSearch } from "lucide-react";
import SectionCard from "./shared/SectionCard.jsx";
import MetadataField from "./shared/MetadataField.jsx";
import { formatAgeDays, formatValue } from "../utils/formatters.js";

export default function WhoisCard({ metadata }) {
  const whois = metadata?.whois;
  if (!whois) return null;

  return (
    <SectionCard icon={FileSearch} title="WHOIS Analysis" description="Domain registration details">
      <MetadataField label="Registrar" value={whois.registrar} />
      <MetadataField label="Creation Date" value={whois.creationDate} />
      <MetadataField
        label="Domain Age"
        value={typeof whois.ageDays === "number" ? formatAgeDays(whois.ageDays) : formatValue(whois.ageDays)}
      />
      <MetadataField label="Recently Registered" value={whois.recentlyRegistered} />
    </SectionCard>
  );
}
