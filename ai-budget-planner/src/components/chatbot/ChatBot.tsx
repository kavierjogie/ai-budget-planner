'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, MessageCircle } from 'lucide-react';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI financial advisor. Ask me anything about your spending, budgeting, or savings goals!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply,
          timestamp: new Date(),
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'How am I doing this month?',
    'How can I save more?',
    'Where am I overspending?',
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full',
          'bg-indigo-600 shadow-2xl shadow-indigo-500/40 hover:bg-indigo-500 transition-all duration-200',
          'hover:scale-105 active:scale-95',
          open && 'hidden'
        )}
        aria-label="Open financial advisor chat"
      >
        <MessageCircle size={24} className="text-white" />
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col w-80 sm:w-96 h-[520px] rounded-2xl border border-slate-700/50 bg-slate-800 shadow-2xl shadow-black/50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 bg-indigo-600 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Bot size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Financial Advisor</p>
              <p className="text-xs text-indigo-200">AI-powered • personalised to you</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'assistant' && (
                  <div className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600/20">
                    <Bot size={12} className="text-indigo-400" />
                  </div>
                )}
                <div className={cn(
                  'max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-slate-700/60 text-slate-200 rounded-tl-sm'
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600/20">
                  <Bot size={12} className="text-indigo-400" />
                </div>
                <div className="bg-slate-700/60 rounded-2xl rounded-tl-sm px-4 py-3">
                  <Loader2 size={16} className="animate-spin text-indigo-400" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {quickPrompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt); inputRef.current?.focus(); }}
                  className="rounded-full border border-slate-600/50 bg-slate-700/30 px-3 py-1 text-xs text-slate-400 hover:text-slate-200 hover:border-indigo-500/50 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-slate-700/50 p-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask about your finances..."
                className="flex-1 rounded-xl border border-slate-600/50 bg-slate-700/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
