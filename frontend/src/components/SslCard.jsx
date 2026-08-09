import { Lock } from "lucide-react";
import SectionCard from "./shared/SectionCard.jsx";
import MetadataField from "./shared/MetadataField.jsx";
import { prettifyKey } from "../utils/formatters.js";

// Fields we know how to label nicely; anything else still renders via prettifyKey.
const KNOWN_ORDER = [
  "enabled",
  "reachable",
  "selfSigned",
  "issuer",
  "subject",
  "validFrom",
  "validTo",
  "serialNumber",
  "fingerprint",
];

export default function SslCard({ metadata }) {
  const ssl = metadata?.ssl;
  if (!ssl) return null;

  const keys = Object.keys(ssl);
  const orderedKeys = [
    ...KNOWN_ORDER.filter((k) => keys.includes(k)),
    ...keys.filter((k) => !KNOWN_ORDER.includes(k)),
  ];

  return (
    <SectionCard icon={Lock} title="SSL Analysis" description="Certificate details, when available">
      {orderedKeys.map((key) => (
        <MetadataField key={key} label={prettifyKey(key)} value={ssl[key]} mono={key === "fingerprint"} />
      ))}
    </SectionCard>
  );
}
