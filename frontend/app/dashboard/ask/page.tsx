'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, Bot, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function AskPalsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! I'm PALS, your personal cycle and wellness assistant. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({ 
            role: m.role, 
            content: m.content 
          })) 
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Server error response:', errText);
        throw new Error('Failed to get response');
      }

      const data = JSON.parse(await response.text());
      
      setMessages(prev => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: data.text 
        }
      ]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: "I'm sorry, I'm having trouble connecting right now. Please try again later." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 dark:bg-[#050505] relative overflow-hidden transition-colors duration-300">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#e3000f] rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[150px] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[150px] opacity-[0.02] pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center gap-3 px-8 py-6 border-b border-gray-200 dark:border-[#1a1a1a] bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl z-10 transition-colors duration-300">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#e3000f] to-[#780014] text-white shadow-lg shadow-[#e3000f]/20">
          <Sparkles size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Ask PALS</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Google Gemini</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 z-10 custom-scrollbar">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-1 ${
                  msg.role === 'user' 
                    ? 'bg-gray-200 dark:bg-[#222] border border-gray-300 dark:border-[#333] text-gray-700 dark:text-gray-300' 
                    : 'bg-red-50 dark:bg-[#161616] border border-red-200 dark:border-[#e3000f]/30 text-[#e3000f]'
                }`}>
                  {msg.role === 'user' ? <UserIcon size={14} /> : <Bot size={14} />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm transition-colors duration-300 ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-b from-gray-100 to-gray-200 dark:from-[#2a2a2a] dark:to-[#222] text-gray-900 dark:text-white border border-gray-300 dark:border-[#333] rounded-tr-sm' 
                      : 'bg-white dark:bg-[#111] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#1a1a1a] rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                  }`}>
                    {/* Render newlines properly */}
                    {msg.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i !== msg.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-1 bg-red-50 dark:bg-[#161616] border border-red-200 dark:border-[#e3000f]/30 text-[#e3000f]">
                <Bot size={14} />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-tl-sm flex items-center gap-2">
                <Loader2 size={16} className="text-[#e3000f] animate-spin" />
                <span className="text-sm text-gray-500 dark:text-gray-400">PALS is thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white/90 dark:bg-[#050505]/90 backdrop-blur-xl border-t border-gray-200 dark:border-[#1a1a1a] z-10 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="flex items-end gap-3 rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-[#222] focus-within:border-gray-400 dark:focus-within:border-[#444] p-2 transition-colors shadow-lg"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask anything about your cycle, symptoms, or wellness..."
              className="w-full bg-transparent p-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none resize-none max-h-32 min-h-[44px] text-[15px]"
              rows={1}
              style={{
                height: input.length > 0 ? 'auto' : '44px',
                minHeight: '44px'
              }}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="mb-1 mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e3000f] text-white hover:bg-[#ff0015] disabled:opacity-50 disabled:hover:bg-[#e3000f] transition-all"
            >
              <Send size={18} className="ml-1" />
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[11px] text-gray-500 dark:text-gray-600">PALS can make mistakes. Consider verifying important health information.</span>
          </div>
        </div>
      </div>
      
      {/* Global styles for custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(150, 150, 150, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(150, 150, 150, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #222;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #333;
        }
      `}} />
    </div>
  );
}
