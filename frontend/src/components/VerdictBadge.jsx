import { CheckCircle2, Info, AlertTriangle, XOctagon, HelpCircle } from "lucide-react";
import { getVerdictStyle } from "../utils/formatters.js";

const ICONS = {
  check: CheckCircle2,
  info: Info,
  "alert-triangle": AlertTriangle,
  "x-octagon": XOctagon,
  "help-circle": HelpCircle,
};

const COLOR_CLASSES = {
  "risk-safe": "bg-risk-safe/10 text-risk-safe border-risk-safe/30",
  "risk-low": "bg-risk-low/10 text-risk-low border-risk-low/30",
  "risk-medium": "bg-risk-medium/10 text-risk-medium border-risk-medium/30",
  "risk-high": "bg-risk-high/10 text-risk-high border-risk-high/30",
  "risk-critical": "bg-risk-critical/10 text-risk-critical border-risk-critical/30",
  "risk-unknown": "bg-risk-unknown/10 text-risk-unknown border-risk-unknown/30",
};

export default function VerdictBadge({ verdict, size = "md" }) {
  const style = getVerdictStyle(verdict);
  const Icon = ICONS[style.icon] || HelpCircle;
  const sizeClasses =
    size === "lg"
      ? "px-4 py-2 text-base gap-2"
      : "px-3 py-1.5 text-sm gap-1.5";

  return (
    <span
      className={`inline-flex animate-fade-scale-in items-center rounded-full border font-semibold ${COLOR_CLASSES[style.color]} ${sizeClasses}`}
    >
      <Icon size={size === "lg" ? 18 : 15} strokeWidth={2.25} />
      {style.label}
    </span>
  );
}
