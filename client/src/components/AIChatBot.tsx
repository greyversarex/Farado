import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Здравствуйте! Я ИИ-консультант FARADO. Чем могу помочь? Могу рассказать о наших услугах, логистике с Китаем или помочь с расчётом доставки.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Ошибка отправки сообщения");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error.message || "Извините, произошла ошибка. Попробуйте позже или свяжитесь с нами напрямую.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          data-testid="button-open-chat"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 h-12 w-12 md:h-14 md:w-14 rounded-full bg-primary shadow-lg hover-elevate"
          size="icon"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7">
            <path d="M12 2C6.48 2 2 5.58 2 10c0 2.03.94 3.87 2.47 5.26-.15 1.4-.74 2.67-1.16 3.44 1.72-.25 3.38-.9 4.65-1.73.33.04.68.03 1.04.03 5.52 0 10-3.58 10-8S17.52 2 12 2z" fill="white"/>
            <circle cx="8" cy="10" r="1.3" fill="currentColor"/>
            <circle cx="12" cy="10" r="1.3" fill="currentColor"/>
            <circle cx="16" cy="10" r="1.3" fill="currentColor"/>
          </svg>
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b bg-primary p-4 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">FARADO Консультант</span>
            </div>
            <Button
              data-testid="button-close-chat"
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="flex flex-col gap-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Печатаю...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                data-testid="input-chat-message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите сообщение..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                data-testid="button-send-message"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
