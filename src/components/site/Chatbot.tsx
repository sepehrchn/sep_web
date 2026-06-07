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

  return (
    <div className="print:hidden">
      <motion.button
        ref={triggerRef}
        onClick={isOpen ? closeChat : openChat}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.3 }}
        aria-expanded={isOpen}
        aria-label={isOpen ? `${t('chatbot.label')} (close)` : `${t('chatbot.label')} (open)`}
        className="fixed bottom-6 right-6 z-50 flex h-12 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-white shadow-[0_0_24px_var(--accent-glow)] transition-colors hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {isOpen ? <X size={16} /> : <MessageSquare size={16} />}
        <span className="hidden sm:inline">{isOpen ? t('chatbot.close') : t('chatbot.label')}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Project intake chat"
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 flex h-[520px] max-h-[70vh] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-bg shadow-2xl md:right-6 md:w-[360px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div>
                <p className="font-mono-ui text-sm font-medium text-text-primary">{t('nav.logoLabel')}</p>
                <p className="font-mono-ui text-[10px] text-text-tertiary">{t('chatbot.responseTime')}</p>
              </div>
                  <button onClick={closeChat} aria-label={t('chatbot.close')} className="text-text-tertiary transition-colors hover:text-text-primary">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div role="log" aria-live="polite" className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`px-3 py-2.5 text-sm leading-relaxed rounded-lg max-w-[88%] ${
                    msg.role === "user"
                      ? "self-end bg-accent/10 border border-accent/20 text-text-primary font-sans"
                      : "self-start border border-[var(--border)] text-text-secondary font-sans"
                  }`}
                >
                  {msg.content}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="self-start border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-text-secondary">
                  <span className="animate-pulse text-text-tertiary">...</span>
                </div>
              )}

              {showFormCTA && (
                <div className="pt-2">
                  <button
                    onClick={prefillContactForm}
                    className="w-full rounded-md border border-accent text-accent px-3 py-2.5 text-xs font-mono-ui transition-colors hover:bg-accent hover:text-white"
                  >
                    {t('chatbot.fillFormCTA')}
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-[var(--border)] px-3 py-3">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={500}
                rows={2}
                placeholder={t('chatbot.openingMessage')}
                className="flex-1 resize-none rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-accent"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="h-[38px] rounded-md bg-accent px-3.5 py-2 text-xs font-mono-ui text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
              >
                {t('chatbot.send')}
              </button>
            </form>
            <div className="px-4 pb-2 text-center font-mono-ui text-[9px] text-text-tertiary">
              {t('chatbot.aiNotice')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
