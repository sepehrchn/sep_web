import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbot } from "@/hooks/useChatbot";
import { useTranslation } from "@/hooks/useTranslation";
import { X } from "lucide-react";

export function Chatbot() {
  const { t } = useTranslation();
  const {
    isOpen, messages, inputValue, isLoading, showFormCTA,
    openChat, closeChat, setInputValue, sendMessage, prefillContactForm,
  } = useChatbot(t('chatbot.openingMessage'));

  const triggerRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) textareaRef.current?.focus();
    else triggerRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) sendMessage(inputValue.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) sendMessage(inputValue.trim());
  };

  /* Floating action button trigger */
  const TriggerButton = (
    <motion.button
      ref={triggerRef}
      onClick={isOpen ? closeChat : openChat}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.4 }}
      aria-expanded={isOpen}
      aria-label={isOpen ? `${t('chatbot.label')} (close)` : `${t('chatbot.label')} (open)`}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-[var(--accent)] bg-[var(--primary)] shadow-md transition-all hover:shadow-[var(--shadow-glow)] overflow-hidden"
    >
      <img src="/assets/chat.webp" alt="Chat" className="h-full w-full object-cover rounded-full" />
      <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
        <span className="absolute inset-0 animate-ping rounded-full bg-[var(--c-success)] opacity-70" />
        <span className="relative h-3 w-3 rounded-full bg-[var(--c-success)] border-2 border-white" />
      </span>
    </motion.button>
  );

  /* Chat dialog */
  const ChatDialog = (
    <motion.div
      role="dialog"
      aria-label="Project intake chat"
      aria-modal="true"
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-[4.5rem] sm:bottom-20 right-2 sm:right-6 z-40 flex h-[480px] sm:h-[520px] max-h-[75vh] w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-bg shadow-2xl md:right-6 md:w-[360px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--primary)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--accent)]" />
            <div className="absolute inset-[3px] rounded-full overflow-hidden">
              <img src="/assets/chat.webp" alt="Chat" className="h-full w-full object-cover" />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{t('nav.logoLabel')}</div>
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[var(--c-success)] opacity-70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--c-success)]" />
              </span>
              {t('chatbot.responseTime')}
            </div>
          </div>
        </div>
        <button onClick={closeChat} aria-label={t('chatbot.close')} className="text-white/70 transition-colors hover:text-white rounded-full p-1 hover:bg-white/10">
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div role="log" aria-live="polite" className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-[var(--bg-card)]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`px-3 py-2.5 text-sm leading-relaxed rounded-xl max-w-[88%] ${msg.role === "user"
                ? "self-end bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-text-primary"
                : "self-start border-l-2 border-[var(--accent)] bg-white text-text-secondary shadow-sm"
              }`}
          >
            {msg.content}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="self-start border-l-2 border-[var(--accent)] rounded-xl px-3 py-2 text-sm text-text-secondary bg-white shadow-sm">
            <span className="animate-pulse text-text-tertiary">...</span>
          </div>
        )}

        {showFormCTA && (
          <div className="pt-2">
            <button
              onClick={prefillContactForm}
              className="w-full rounded-md border border-[var(--accent)] text-[var(--accent)] px-3 py-2.5 text-xs font-mono-ui transition-colors hover:bg-[var(--accent)] hover:text-white"
            >
              {t('chatbot.fillFormCTA')}
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-[var(--border)] bg-white px-3 py-3">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
          rows={2}
          placeholder={t('chatbot.inputPlaceholder')}
          className="flex-1 resize-none rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="h-[38px] rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white transition-all hover:bg-[var(--accent-hover)] hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('chatbot.send')}
        </button>
      </form>
    </motion.div>
  );

  return (
    <div className="print:hidden">
      {TriggerButton}
      <AnimatePresence>
        {isOpen && ChatDialog}
      </AnimatePresence>
    </div>
  );
}