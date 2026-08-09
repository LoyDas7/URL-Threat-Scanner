import { useRef, useState } from "react";
import { Sparkles, Loader2, Send, AlertCircle } from "lucide-react";
import { askAI } from "../../services/api.js";

/**
 * Compact, scan-scoped chat card. Not a general-purpose chatbot -
 * every message it sends includes the current scan's score/verdict/findings
 * so the backend (Groq) can answer in that context. Nothing here calls
 * Groq directly, and no API key ever touches this file - it only talks
 * to POST /api/ai/chat through the shared api.js service.
 */
export default function AISecurityAssistant({ scanResult }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  const hasStarted = messages.length > 0;

  // Includes metadata (DNS, SSL, WHOIS, etc.) so the AI can explain those
  // sections specifically, not just the top-level score/verdict/findings.
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

  if (!scanResult) {
    return (
      <div className="rounded-xl border border-base-border bg-base-surface p-5">
        <div className="flex items-center gap-2.5">
          <Sparkles size={18} className="text-accent" />
          <h3 className="font-display text-sm font-semibold tracking-wide text-ink-primary">
            AI Security Assistant
          </h3>
        </div>
        <p className="mt-3 text-sm text-ink-muted">
          Scan a URL first to use the AI Security Assistant.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-base-border bg-base-surface p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Sparkles size={18} strokeWidth={2} />
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold tracking-wide text-ink-primary">
            AI Security Assistant
          </h3>
          {!hasStarted && (
            <p className="mt-0.5 text-xs text-ink-muted">
              Understand your scan result in simple language.
            </p>
          )}
        </div>
      </div>

      {!hasStarted && (
        <button
          type="button"
          onClick={handleExplainClick}
          disabled={loading}
          className="btn-press mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-base-bg transition-colors duration-200 hover:bg-accent-glow disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Ask AI to Explain
            </>
          )}
        </button>
      )}

      {loading && (
        <p className="mt-3 flex animate-fade-up items-center gap-2 text-sm text-ink-secondary">
          <Loader2 size={14} className="animate-spin text-accent" />
          AI is analyzing the scan result...
        </p>
      )}

      {hasStarted && (
        <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
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
        </div>
      )}

      {error && (
        <p className="mt-3 flex animate-fade-up items-center gap-1.5 text-sm text-risk-critical" role="alert">
          <AlertCircle size={15} />
          {error}
        </p>
      )}

      {hasStarted && (
        <form onSubmit={handleFollowUpSubmit} className="mt-4 flex items-center gap-2">
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
  );
}
