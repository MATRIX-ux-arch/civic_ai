import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RotateCcw } from "lucide-react";
import { TamboProvider, useTamboThread } from "@tambo-ai/react";
import type { TamboThreadMessage } from "@tambo-ai/react";
import { tamboComponents, tamboTools, tamboContextHelpers } from "@/lib/tambo";

// ── Helpers ────────────────────────────────────────────────────────────────

function getMessageText(msg: TamboThreadMessage): string {
  if (Array.isArray(msg.content)) {
    return msg.content
      .filter((part: any) => part.type === "text")
      .map((part: any) => part.text || "")
      .join("");
  }
  return String(msg.content || "");
}

// ── Page wrapper – owns TamboProvider key for thread reset ─────────────────

export default function Index() {
  const [threadKey, setThreadKey] = useState(0);

  return (
    <TamboProvider
      key={threadKey}
      apiKey={import.meta.env.VITE_TAMBO_API_KEY || ""}
      components={tamboComponents}
      tools={tamboTools}
      contextHelpers={tamboContextHelpers}
      streaming={true}
    >
      <CivicChat onReset={() => setThreadKey((k) => k + 1)} />
    </TamboProvider>
  );
}

// ── Chat UI (identical visual output, powered by Tambo) ────────────────────

function CivicChat({ onReset }: { onReset: () => void }) {
  const [input, setInput] = useState("");
  const { thread, sendThreadMessage, isIdle, generationStatusMessage } =
    useTamboThread();
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = (thread?.messages ?? []).filter(
    (msg: TamboThreadMessage) =>
      msg.role === "user" || msg.role === "assistant"
  );
  const isThinking = !isIdle;
  const isEmpty = messages.length === 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    sendThreadMessage(msg, { streamResponse: true });
  };

  return (
    <div className="min-h-screen bg-background gradient-mesh flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center neon-glow overflow-hidden">
            <img src="/logo.svg" alt="Civic AI" className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wide text-foreground">CIVIC AI</h1>
            <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
              Form Discovery & Preparation
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted/50"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-0">
        <div className="max-w-2xl mx-auto py-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {isEmpty && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center pt-[15vh] text-center"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 neon-glow-strong overflow-hidden">
                  <img src="/logo.svg" alt="Civic AI" className="w-16 h-16" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  What do you need help with?
                </h2>
                <p className="text-muted-foreground text-base max-w-md mb-8">
                  Describe what form or service you need in plain English. I'll find the right form, show you the required documents, and generate a downloadable blank PDF.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "I need income certificate",
                    "Apply for scholarship",
                    "Report garbage problem",
                    "Birth certificate correction",
                  ].map((q) => (
                    <motion.button
                      key={q}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSend(q)}
                      className="glass-subtle px-4 py-2.5 text-sm text-foreground/70 hover:text-primary hover:neon-border transition-all"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((msg: TamboThreadMessage, idx: number) => {
              const text = getMessageText(msg);

              // Hide text-only assistant messages that follow a component message
              if (
                msg.role === "assistant" &&
                !msg.renderedComponent &&
                idx > 0
              ) {
                const prev = messages[idx - 1];
                if (prev?.role === "assistant" && prev.renderedComponent) {
                  return null;
                }
              }

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                  className={`${msg.role === "user" ? "flex justify-end" : ""}`}
                >
                  {msg.role === "user" ? (
                    <div className="glass-subtle px-4 py-2.5 max-w-[80%] text-base text-foreground">
                      {text}
                    </div>
                  ) : msg.renderedComponent ? (
                    <div>
                      {msg.renderedComponent}
                    </div>
                  ) : (
                    <div className="glass-subtle px-4 py-3 text-base text-foreground/80 max-w-[85%]">
                      {text}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {isThinking && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 text-primary text-base"
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <span className="font-mono text-sm animate-pulse-neon">
                  {generationStatusMessage || "Finding your form..."}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border/50 p-4">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="glass flex items-center gap-2 p-2 neon-border"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what form or service you need..."
              className="flex-1 bg-transparent px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              disabled={isThinking}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!input.trim() || isThinking}
              className="bg-primary text-primary-foreground p-2.5 rounded-xl disabled:opacity-30 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-2 font-mono">
            CIVIC AI helps you discover forms — it does not submit applications
          </p>
        </div>
      </div>
    </div>
  );
}
