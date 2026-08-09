import { Link2, ScanSearch, ShieldQuestion, ListChecks } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Enter a URL",
    description: "Paste any link into the scanner on the home page.",
  },
  {
    icon: ScanSearch,
    title: "The backend analyzes it",
    description:
      "The URL is sent to the Scan The URL API, which runs a series of automated security checks.",
  },
  {
    icon: ListChecks,
    title: "Multiple signals are checked",
    description:
      "Checks span URL structure and patterns, DNS records, WHOIS registration data, SSL certificate details, redirect behavior, and threat-intelligence sources.",
  },
  {
    icon: ShieldQuestion,
    title: "A risk score and verdict are calculated",
    description:
      "Findings are combined into a numeric risk score and an overall verdict, from Safe through Critical.",
  },
];

const categories = [
  "URL structure and pattern analysis",
  "DNS records",
  "WHOIS registration data",
  "SSL certificate details",
  "Redirect chain",
  "Threat intelligence (VirusTotal, Google Safe Browsing)",
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink-primary">How it works</h1>
      <p className="mt-3 text-ink-secondary">
        Scan The URL runs a real, multi-step security analysis on every link you submit.
        Here's the process, end to end.
      </p>

      <ol className="mt-10 space-y-6">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                <step.icon size={18} />
              </div>
              {i < steps.length - 1 && <div className="mt-2 h-full w-px flex-1 bg-base-border" />}
            </div>
            <div className="pb-2">
              <h2 className="font-display text-base font-semibold text-ink-primary">
                {step.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 rounded-xl border border-base-border bg-base-surface p-6">
        <h2 className="font-display text-base font-semibold text-ink-primary">
          What gets analyzed
        </h2>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {categories.map((c) => (
            <li key={c} className="flex items-center gap-2 text-sm text-ink-secondary">
              <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
