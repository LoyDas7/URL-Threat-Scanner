import { GitBranch } from "lucide-react";
import SectionCard from "./shared/SectionCard.jsx";
import MetadataField from "./shared/MetadataField.jsx";

export default function RedirectCard({ metadata }) {
  const redirects = metadata?.redirects;
  if (!redirects) return null;

  return (
    <SectionCard icon={GitBranch} title="Redirect Analysis" description="Where the link ultimately leads">
      <MetadataField label="Redirect Count" value={redirects.count} />
      <MetadataField label="Chain" value={redirects.chain} mono />
    </SectionCard>
  );
}
