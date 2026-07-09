import { useState, useCallback, useRef } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface CollectedData {
  name?: string;
  company?: string;
  project?: string;
}
export function useChatbot(openingMessage: string) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFormCTA, setShowFormCTA] = useState(false);
  const [collectedData, setCollectedData] = useState<CollectedData>({});
  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;

  const openChat = useCallback(() => {
    setIsOpen(true);
    if (messagesRef.current.length === 0) {
      setMessages([{ id: "initial", role: "assistant", content: openingMessage }]);
    }
  }, [openingMessage]);

  const closeChat = useCallback(() => setIsOpen(false), []);

  const runHeuristics = useCallback((text: string, isUser: boolean) => {
    if (!isUser) return;
    const updates: CollectedData = {};

    const nameMatch = text.match(/\b(?:my name is|i am|i'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
    if (nameMatch?.[1]) updates.name = nameMatch[1];
    const compMatch = text.match(/\b(?:at|for|from|company is|agency is)\s+([A-Z][a-zA-Z0-9_]+(?:\s+[A-Z][a-zA-Z0-9_]+)*)/i);
    if (compMatch?.[1] && !["The", "My", "Our", "A", "An"].includes(compMatch[1].trim())) {
      updates.company = compMatch[1].trim();
    }
    const userMsgCount = messagesRef.current.filter((m) => m.role === "user").length;
    if (userMsgCount === 0) updates.project = text;
    if (Object.keys(updates).length > 0) setCollectedData((prev) => ({ ...prev, ...updates }));
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      const userMessage: Message = { id: Math.random().toString(36).substring(7), role: "user", content: text };
      const updatedMessages = [...messagesRef.current, userMessage];
      setMessages(updatedMessages);
      setInputValue("");
      setIsLoading(true);
      runHeuristics(text, true);

      const assistantId = Math.random().toString(36).substring(7);
      const assistantMsg: Message = { id: assistantId, role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMsg]);

      try {
        const payloadMessages = updatedMessages.slice(-20).map((m) => ({ role: m.role, content: m.content }));
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: payloadMessages[payloadMessages.length - 1].content,
            history: payloadMessages.slice(0, -1).map((m) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
          }),
        });
        if (!res.ok) {
          let errMsg = "Service unavailable. Please use the contact form.";
          try {
            const errJSON = await res.json();
            if (errJSON.error) errMsg = errJSON.error;
          } catch (_) {}
          throw new Error(errMsg);
        }
        const data = await res.json();
        const content = data.reply ?? "Sorry, I could not generate a response.";
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content } : m)));
        const normalized = content.toLowerCase();
        if (normalized.includes("#contact") || normalized.includes("contact form")) {
          setShowFormCTA(true);
        }
      } catch (err: any) {
        const errText = err.message || "Service unavailable. Please use the contact form.";
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: errText } : m)));
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, runHeuristics]
  );

  const prefillContactForm = useCallback(() => {
    const section = document.getElementById("contact");
    if (section) section.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      if (collectedData.name) {
        const el = document.querySelector('input[name="name"]') as HTMLInputElement | null;
        if (el) { el.value = collectedData.name; el.dispatchEvent(new Event("input", { bubbles: true })); }
      }
      if (collectedData.company) {
        const el = document.querySelector('input[name="company"]') as HTMLInputElement | null;
        if (el) { el.value = collectedData.company; el.dispatchEvent(new Event("input", { bubbles: true })); }
      }
      if (collectedData.project) {
        const el = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement | null;
        if (el) { el.value = collectedData.project; el.dispatchEvent(new Event("input", { bubbles: true })); }
      }

    }, 500);
    setIsOpen(false);
  }, [collectedData]);

  return {
    isOpen, messages, inputValue, isLoading, showFormCTA, collectedData,
    openChat, closeChat, setInputValue, sendMessage, prefillContactForm,
  };
}
