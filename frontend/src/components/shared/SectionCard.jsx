import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Collapsible card shell used by every metadata analysis card.
 * Closed by default - clicking the header (or focusing + Enter/Space,
 * since it's a real <button>) expands it with a smooth height animation.
 * Each card toggles independently.
 */
export default function SectionCard({ icon: Icon, title, description, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="card-hover animate-card-in overflow-hidden rounded-xl border border-base-border bg-base-surface">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 p-5 text-left transition-colors duration-200 hover:bg-base-raised/50 focus-visible:bg-base-raised/50"
      >
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-sm font-semibold tracking-wide text-ink-primary">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 truncate text-xs text-ink-muted">{description}</p>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 text-ink-muted transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180 text-accent" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* grid-rows 0fr -> 1fr gives a smooth, auto-height accordion animation
          without measuring pixel heights in JS. */}
      <div
        id={panelId}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="space-y-2.5 border-t border-base-border/60 px-5 pb-5 pt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
