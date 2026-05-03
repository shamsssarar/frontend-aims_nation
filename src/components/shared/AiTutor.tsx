"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { aiService } from "@/services/ai.services"; // 👉 Importing your new service
import {
  Send,
  Bot,
  User,
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

  // Scroll to bottom when chat opens or new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]); // Added isLoading so it scrolls when typing indicator appears

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput(""); // 👉 Clear input immediately for snappy UX

    // 1. Add user message to UI
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      // 2. Format history exactly how the Gemini API expects it
      // We skip the first greeting message to save tokens, or keep it if you want.
      const formattedHistory = messages.slice(1).map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

      // 3. Call your clean frontend service
      const aiResponseText = await aiService.askTutor(userMessage, formattedHistory);

      // 4. Update UI with the AI's response
      setMessages((prev) => [...prev, { role: "model", text: aiResponseText }]);
      
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
      {/* The Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-4"
          >
            <Card className="flex flex-col h-[520px] w-[350px] sm:w-[400px] shadow-2xl border-slate-200 overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl dark:bg-slate-950/80 dark:border-slate-800">
              {/* Header */}
              <CardHeader className="bg-gradient-to-r from-[#6A8D52] to-[#587843] p-4 text-white flex flex-row items-center justify-between space-y-0 shadow-sm z-10">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <Sparkles className="h-4 w-4 text-[#E8AD31]" />
                  </div>
                  AiMS Tutor
                </CardTitle>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </CardHeader>

              {/* Chat Area */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50/50 dark:bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                {messages.map((msg, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    key={index}
                    className={`flex items-end gap-2 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-full flex-shrink-0 shadow-sm ${
                        msg.role === "user"
                          ? "bg-[#6A8D52] text-white"
                          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#6A8D52]"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-[#6A8D52] text-white rounded-br-sm"
                          : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* Industry Standard Typing Indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2"
                  >
                    <div className="p-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#6A8D52] shadow-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm rounded-2xl rounded-bl-sm p-4 py-4 flex items-center gap-1.5">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input Area */}
              <CardFooter className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-10">
                <form
                  onSubmit={handleSendMessage}
                  className="flex w-full items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-1.5 focus-within:ring-2 focus-within:ring-[#6A8D52]/20 focus-within:border-[#6A8D52] transition-all"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me about a course..."
                    disabled={isLoading}
                    className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 px-3 text-sm dark:text-white"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    className="h-8 w-8 rounded-full bg-[#6A8D52] hover:bg-[#587843] transition-transform active:scale-95 disabled:opacity-50 text-white"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 bg-[#6A8D52] text-white shadow-xl shadow-[#6A8D52]/30 rounded-full transition-colors hover:bg-[#587843] z-50"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}