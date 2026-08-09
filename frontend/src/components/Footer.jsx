export default function Footer() {
  return (
    <footer className="border-t border-base-border/80 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm text-ink-muted sm:flex-row">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Scan The URL logo" className="h-5 w-5 object-contain" />
          <span>Scan The URL</span>
        </div>
        <p>Automated analysis. Always use your own judgment with unfamiliar links.</p>
      </div>
    </footer>
  );
}