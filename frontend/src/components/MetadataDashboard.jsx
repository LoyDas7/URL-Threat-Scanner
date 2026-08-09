import UrlAnalysisCard from "./UrlAnalysisCard.jsx";
import PatternAnalysisCard from "./PatternAnalysisCard.jsx";
import WhoisCard from "./WhoisCard.jsx";
import DnsCard from "./DnsCard.jsx";
import SslCard from "./SslCard.jsx";
import RedirectCard from "./RedirectCard.jsx";
import VirusTotalCard from "./VirusTotalCard.jsx";
import GoogleSafeBrowsingCard from "./GoogleSafeBrowsingCard.jsx";

export default function MetadataDashboard({ metadata }) {
  console.log("MetadataDashboard metadata:", metadata);
  if (!metadata) return null;

  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-semibold text-ink-primary">
        Detailed Security Analysis
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <UrlAnalysisCard metadata={metadata} />
        <PatternAnalysisCard metadata={metadata} />
        <WhoisCard metadata={metadata} />
        <DnsCard metadata={metadata} />
        <SslCard metadata={metadata} />
        <RedirectCard metadata={metadata} />
        <VirusTotalCard metadata={metadata} />
        <GoogleSafeBrowsingCard metadata={metadata} />
      </div>
    </div>
  );
}
