import { Loader2 } from "lucide-react";

export default function LoadingState({ label = "Analyzing URL..." }) {
  return (
    <div
      className="mx-auto mt-6 flex max-w-2xl animate-fade-up items-center justify-center gap-3 rounded-lg border border-base-border bg-base-surface px-5 py-4 text-sm text-ink-secondary"
      role="status"
      aria-live="polite"
    >
      <Loader2 size={18} className="animate-spin text-accent" />
      <span>{label}</span>
    </div>
  );
}
