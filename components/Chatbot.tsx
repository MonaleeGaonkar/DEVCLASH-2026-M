
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Radio, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import { ChatMessage } from '../types';
import { GenerateContentResponse } from '@google/genai';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Do you copy? This is Hawkins Radio. How can I assist you with DevClash?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    chatSessionRef.current = createChatSession(useThinking);
  }, [useThinking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const streamResult = await sendMessageStream(chatSessionRef.current, userMsg.text);
      
      let fullText = '';
      const botMsgId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '' }]);

      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text || '';
        fullText += textChunk;
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMsgId ? { ...msg, text: fullText } : msg
          )
        );
      }
    } catch (error) {
      console.error("Transmission error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: '*Static noise* Signal lost. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 bg-stranger-red text-white p-4 rounded-full shadow-[0_0_15px_#ff0033] hover:shadow-[0_0_25px_#ff0033] border-2 border-black transition-all"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X /> : <MessageCircle />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-black border-2 border-stranger-red rounded-lg shadow-[0_0_20px_rgba(231,29,54,0.3)] flex flex-col font-mono overflow-hidden"
          >
            {/* Header */}
            <div className="bg-stranger-red p-3 flex items-center justify-between border-b-2 border-black">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 animate-pulse text-black" />
                <span className="font-bold text-black uppercase tracking-wider text-xs">Hawkins Radio</span>
              </div>
              <button 
                onClick={() => setUseThinking(!useThinking)}
                className={`flex items-center gap-1 px-2 py-1 rounded border border-black/20 transition-all ${useThinking ? 'bg-black text-stranger-red' : 'bg-transparent text-black/50 hover:text-black'}`}
                title="Toggle Thinking Mode (Gemini 3 Pro)"
              >
                <Brain size={14} className={useThinking ? 'animate-pulse' : ''} />
                <span className="text-[8px] font-bold uppercase">{useThinking ? 'Deep Think' : 'Fast'}</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900 bg-opacity-90 relative">
               <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 text-sm rounded-lg border ${
                      msg.role === 'user'
                        ? 'bg-stranger-red text-white border-stranger-red rounded-tr-none'
                        : 'bg-zinc-800 text-green-400 border-green-700 border-opacity-50 rounded-tl-none font-mono shadow-[0_0_5px_rgba(74,222,128,0.2)]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 text-green-400 p-3 rounded-lg border border-green-700 text-xs animate-pulse">
                    *{useThinking ? 'Deep processing' : 'Receiving transmission'}*...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 bg-black border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 bg-zinc-900 border border-zinc-700 text-white rounded px-3 py-2 focus:outline-none focus:border-stranger-red font-mono text-sm"
              />
              <button
                type="submit"
                disabled={isTyping}
                className="bg-zinc-800 hover:bg-zinc-700 text-stranger-red p-2 rounded border border-zinc-700 transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
