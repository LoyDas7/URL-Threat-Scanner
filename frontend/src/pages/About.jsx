export default function About() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink-primary">About</h1>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-ink-secondary">
        <p>
          Scan The URL is a URL security analysis tool. You give it a link, and it runs an
          automated set of checks — spanning URL structure, DNS, WHOIS, SSL, redirect
          behavior, and threat-intelligence sources — to surface signs of phishing or
          malicious intent before you visit the site.
        </p>

        <p>
          Malicious links often disguise themselves through techniques like brand
          impersonation, lookalike domains, unusual characters, or hidden redirects.
          Scan The URL exists to make those signals visible at a glance instead of
          requiring you to inspect a link by hand.
        </p>

        <div className="rounded-xl border border-base-border bg-base-surface p-5">
          <h2 className="font-display text-sm font-semibold text-ink-primary">
            A note on automated results
          </h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Every result on this site is an automated security assessment, not a guarantee.
            No scanner can catch every threat. Treat a "Safe" verdict as one useful data
            point, not certainty — continue to exercise caution with unfamiliar links,
            especially ones asking for credentials, payment, or personal information.
          </p>
        </div>
      </div>
    </div>
  );
}
