import { useRef, useState } from "react";
import { Sparkles, MessageCircle, X, Loader2, Send, AlertCircle } from "lucide-react";
import { askAI } from "../../services/api.js";

/**
 * Floating chat widget (WhatsApp/Messenger-style): a fixed round button
 * in the corner that toggles a popup panel. Scan-scoped, not a general
 * chatbot - every message includes the current scan's score/verdict/
 * findings/metadata so the backend (Groq) can answer in that context.
 * Nothing here calls Groq directly - only POST /api/ai/chat via api.js.
 */
export default function AISecurityAssistant({ scanResult }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  const hasStarted = messages.length > 0;

  if (!scanResult) return null;

  function buildScanSummary() {
    return {
      score: scanResult.score,
      verdict: scanResult.verdict,
      findings: scanResult.findings,
      metadata: scanResult.metadata,
    };
  }

  async function sendMessage(messageText) {
    if (inFlight.current || !messageText.trim()) return;
    inFlight.current = true;
    setLoading(true);
    setError("");

    setMessages((prev) => [...prev, { role: "user", content: messageText }]);

    try {
      const data = await askAI(messageText, buildScanSummary());
      setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
    } catch {
      setError("Sorry, the AI Assistant could not respond right now. Please try again.");
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }

  function handleExplainClick() {
    sendMessage("Explain this scan result in simple language.");
  }

  function handleFollowUpSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    sendMessage(trimmed);
  }

  return (
    <>
      {/* Floating launcher button, bottom-right - stays fixed to the
          viewport regardless of scroll position. */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close AI Security Assistant" : "Open AI Security Assistant"}
        aria-expanded={isOpen}
        className="btn-press fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-base-bg shadow-glow transition-colors duration-200 hover:bg-accent-glow sm:bottom-6 sm:right-6"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} strokeWidth={2.25} />}
        {!isOpen && !hasStarted && (
          <span
            className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-base-bg bg-risk-safe"
            aria-hidden="true"
          />
        )}
      </button>

      {/* Popup panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-[60] flex h-[28rem] max-h-[70vh] w-[calc(100vw-2.5rem)] max-w-sm origin-bottom-right animate-fade-scale-in flex-col overflow-hidden rounded-2xl border border-base-border bg-base-surface shadow-2xl sm:bottom-[6.5rem] sm:right-6">
          {/* Header */}
          <div className="flex items-center gap-2.5 border-b border-base-border/60 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Sparkles size={18} strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-sm font-semibold tracking-wide text-ink-primary">
                AI Security Assistant
              </h3>
              {!hasStarted && (
                <p className="mt-0.5 truncate text-xs text-ink-muted">
                  Understand your scan result in simple language.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI Security Assistant"
              className="rounded-md p-1.5 text-ink-muted transition-colors duration-150 hover:bg-base-raised hover:text-ink-primary"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {!hasStarted && !loading && (
              <button
                type="button"
                onClick={handleExplainClick}
                className="btn-press inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-base-bg transition-colors duration-200 hover:bg-accent-glow"
              >
                <Sparkles size={16} />
                Ask AI to Explain
              </button>
            )}

            {loading && (
              <p className="flex animate-fade-up items-center gap-2 text-sm text-ink-secondary">
                <Loader2 size={14} className="animate-spin text-accent" />
                AI is analyzing the scan result...
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`animate-card-in max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "ai"
                    ? "bg-base-raised text-ink-primary"
                    : "ml-auto bg-accent/10 text-ink-primary"
                }`}
              >
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                  {msg.role === "ai" ? "AI" : "You"}
                </span>
                {msg.content}
              </div>
            ))}

            {error && (
              <p className="flex animate-fade-up items-center gap-1.5 text-sm text-risk-critical" role="alert">
                <AlertCircle size={15} />
                {error}
              </p>
            )}
          </div>

          {/* Follow-up input */}
          {hasStarted && (
            <form onSubmit={handleFollowUpSubmit} className="flex items-center gap-2 border-t border-base-border/60 p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Ask something about this scan..."
                className="min-w-0 flex-1 rounded-lg border border-base-border bg-base-raised px-3.5 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted transition-colors duration-200 focus:border-accent/60 focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send question to AI Security Assistant"
                className="btn-press flex shrink-0 items-center justify-center rounded-lg bg-accent p-2.5 text-base-bg transition-colors duration-200 hover:bg-accent-glow disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}