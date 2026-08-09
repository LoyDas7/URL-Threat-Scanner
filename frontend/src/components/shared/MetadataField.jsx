import {
  prettifyKey,
  formatValue,
  isEmpty,
  NOT_AVAILABLE,
} from "../../utils/formatters.js";

/**
 * Renders one label/value row for whatever data the API actually returned.
 * Handles:
 * - null / undefined
 * - booleans
 * - numbers
 * - strings
 * - arrays of strings
 * - arrays of objects (e.g. DNS mxRecords, redirect chain)
 * - nested objects
 */
export default function MetadataField({ label, value, mono = false }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-base-border/50 py-2 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="shrink-0 text-xs font-medium text-ink-muted">
        {label}
      </span>

      <div
        className={`min-w-0 text-left text-sm text-ink-primary sm:text-right ${
          mono ? "font-mono" : ""
        }`}
      >
        <ValueRenderer value={value} />
      </div>
    </div>
  );
}

function ValueRenderer({ value }) {
  // null, undefined, empty string, etc.
  if (isEmpty(value)) {
    return <span className="text-ink-muted">{NOT_AVAILABLE}</span>;
  }

  // Arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-ink-muted">{NOT_AVAILABLE}</span>;
    }

    // Array of primitives
    // Example: nsRecords, aRecords, redirect chain
    if (typeof value[0] !== "object" || value[0] === null) {
      return (
        <span className="flex flex-col items-start gap-1 sm:items-end">
          {value.map((item, i) => (
            <span
              key={i}
              className="rounded bg-base-raised px-2 py-0.5 font-mono text-xs text-ink-secondary"
            >
              {String(item)}
            </span>
          ))}
        </span>
      );
    }

    // Array of objects
    // Example: mxRecords: [{ exchange, priority }]
    return (
      <span className="flex flex-col items-start gap-1.5 sm:items-end">
        {value.map((item, i) => (
          <span
            key={i}
            className="rounded bg-base-raised px-2 py-1 font-mono text-xs text-ink-secondary"
          >
            {Object.entries(item)
              .map(
                ([k, v]) =>
                  `${prettifyKey(k)}: ${formatValue(v)}`
              )
              .join("  ·  ")}
          </span>
        ))}
      </span>
    );
  }

  // Nested object
  if (typeof value === "object") {
    return (
      <span className="flex flex-col items-start gap-1 sm:items-end">
        {Object.entries(value).map(([k, v]) => (
          <span
            key={k}
            className="text-xs text-ink-secondary"
          >
            <span className="font-medium text-ink-muted">
              {prettifyKey(k)}:
            </span>{" "}
            {formatValue(v)}
          </span>
        ))}
      </span>
    );
  }

  // String / number / boolean
  return <>{formatValue(value)}</>;
}