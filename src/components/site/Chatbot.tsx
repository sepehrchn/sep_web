import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbot } from "@/hooks/useChatbot";
import { useTranslation } from "@/hooks/useTranslation";
import { MessageSquare, X } from "lucide-react";

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
    <motion.div
      className="fixed bottom-6 left-6 z-50 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.4 }}
    >
      <button
        ref={triggerRef}
        onClick={isOpen ? closeChat : openChat}
        aria-expanded={isOpen}
        aria-label={isOpen ? `${t('chatbot.label')} (close)` : `${t('chatbot.label')} (open)`}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] shadow-lg transition-all hover:scale-110 hover:shadow-[var(--shadow-glow)]"
      >
        {/* Copper ring accent on hover */}
        <div className="absolute -inset-1 rounded-full border-2 border-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-40" />
        
        {/* Pulsing glow */}
        <span className="absolute inset-0 rounded-full bg-[var(--accent)] opacity-20 animate-ping" />
        
        {/* Icon */}
        <MessageSquare size={24} className="relative z-10 text-white" />
      </button>
      
      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--primary)] px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
        Chat Bot
      </div>
    </motion.div>
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
      className="fixed bottom-20 left-6 z-40 flex h-[520px] max-h-[70vh] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-bg shadow-2xl md:left-6 md:w-[360px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--primary)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--accent)]" />
            <div className="absolute inset-[3px] rounded-full bg-white flex items-center justify-center">
              <MessageSquare size={14} className="text-[var(--primary)]" />
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
          placeholder={t('chatbot.openingMessage')}
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