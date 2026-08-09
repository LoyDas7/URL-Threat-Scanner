export default function Hero({ children }) {
  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-16 sm:pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <div
          className="mb-5 inline-flex animate-fade-up items-center gap-2 rounded-full border border-base-border bg-base-surface px-3.5 py-1.5 text-xs text-ink-secondary"
          style={{ animationDelay: "0ms" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Live threat analysis
        </div>

        <h1
          className="text-balance animate-fade-up font-display text-4xl font-semibold leading-tight tracking-tight text-ink-primary sm:text-5xl"
          style={{ animationDelay: "70ms" }}
        >
          Scan URLs before you trust them
        </h1>

        <p
          className="mx-auto mt-4 max-w-xl animate-fade-up text-balance text-base leading-relaxed text-ink-secondary"
          style={{ animationDelay: "140ms" }}
        >
          Paste any link and Scan The URL checks it against DNS, WHOIS, SSL,
          redirect, and threat-intelligence signals to flag phishing and
          malicious characteristics before you click.
        </p>
      </div>

      <div
        className="mx-auto mt-10 max-w-2xl animate-fade-up"
        style={{ animationDelay: "210ms" }}
      >
        {children}
      </div>
    </section>
  );
}
