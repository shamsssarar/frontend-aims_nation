"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  MessageCircle,
  X,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  role: "user" | "model";
  text: string;
};

export default function AiTutor() {
  // NEW: State to control whether the chat window is open or closed
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I am your AiMS Nation Assistant. How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom only when chat is open and new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      const response = await fetch(`${baseUrl}/api/v1/ai/tutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(1).map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.text }],
          })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "I'm having trouble connecting to my servers. Please try again!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* The Chat Window (Only visible when isOpen is true) */}
      {isOpen && (
        <Card className="flex flex-col h-[500px] w-[350px] sm:w-[400px] shadow-2xl border border-slate-200 mb-4 overflow-hidden animate-in slide-in-from-bottom-5">
          <CardHeader className="border-b bg-primary p-4 text-primary-foreground flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-secondary" />
              AiMS Assistant
            </CardTitle>
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary/80 p-1 rounded-md transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`p-2 rounded-full flex-shrink-0 ${msg.role === "user" ? "bg-primary text-white" : "bg-secondary text-slate-900"}`}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`rounded-2xl p-3 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-white border shadow-sm text-slate-700 rounded-tl-none"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-secondary text-slate-900">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white border shadow-sm rounded-2xl rounded-tl-none p-4 flex items-center gap-2 text-slate-500 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />{" "}
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="p-3 border-t bg-white">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      {/* The Floating Action Button (Always visible) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? "bg-secondary text-slate-900" : "bg-primary text-white"} hover:opacity-90 shadow-xl rounded-full p-4 transition-all duration-300 hover:scale-105`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
