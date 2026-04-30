import { useState, useEffect, useRef } from 'react';
import { useDemo } from '../../contexts/DemoContext';
import { useFirstTimer } from '../../contexts/FirstTimerContext';
import { getGeminiResponse } from '../../services/gemini';
import { Send, User, Bot, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

import { SUGGESTED_QUESTIONS, DEMO_CHAT } from '../../constants/componentData';

export default function Chatbot() {
  const { isDemoMode } = useDemo();
  const { isFirstTimer } = useFirstTimer();
  const { t } = useTranslation();
  const { speak, stop, isSpeaking, supported } = useTextToSpeech();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [readingIdx, setReadingIdx] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isDemoMode) {
      setMessages(DEMO_CHAT.map(msg => ({ ...msg, content: t(msg.content) })));
    } else {
      setMessages([
        { role: 'assistant', content: t("Hello! I'm VoteWise, your AI election assistant. How can I help you understand the voting process today?") }
      ]);
    }
  }, [isDemoMode, t]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isSpeaking) {
      setReadingIdx(null);
    }
  }, [isSpeaking]);

  const handleSend = async (messageText) => {
    const text = messageText || input;
    if (!text.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setError('');
    setIsLoading(true);

    if (isDemoMode) {
      // Simulate network delay for demo mode
      setTimeout(() => {
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: t("Demo Mode is active. To get real AI responses from Gemini, disable Demo Mode and ensure your API key is set in the .env file.") 
        }]);
        setIsLoading(false);
      }, 1500);
      return;
    }

    try {
      // Create chat history for API (excluding the current one we just added, well actually passing all)
      const aiResponse = await getGeminiResponse(messages, text, isFirstTimer);
      setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
      console.error(err);
      setError(err.message || t("Couldn't connect to the assistant. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadAloud = (text, idx) => {
    if (readingIdx === idx && isSpeaking) {
      stop();
      setReadingIdx(null);
    } else {
      setReadingIdx(idx);
      // Strip basic markdown syntax before reading
      const cleanText = text.replace(/\*\*/g, '');
      speak(cleanText);
    }
  };

  const parseMarkdownLike = (text) => {
    // Simple basic parsing for bold text and newlines for the chatbot UI
    return text.split('\n').map((line, i) => {
      if (!line) return <br key={i}/>;
      
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i} className="block mb-1">
          {parts.map((p, j) => {
            if (p.startsWith('**') && p.endsWith('**')) {
              return <strong key={j}>{p.slice(2, -2)}</strong>;
            }
            return p;
          })}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="bg-[var(--color-navy)] px-6 py-4 flex items-center shadow-sm z-10">
        <Bot className="w-8 h-8 text-white mr-3 bg-white/20 p-1.5 rounded-full" />
        <div>
          <h2 className="text-white font-bold text-lg leading-tight">{t('VoteWise Assistant')}</h2>
          <p className="text-[var(--color-saffron)] text-xs font-medium">{t('Powered by Gemini AI')}</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 flex flex-col gap-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full mt-1 ${
                msg.role === 'user' ? 'bg-gray-200 ml-3' : 'bg-[var(--color-saffron)] text-white mr-3'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-gray-500" /> : <Bot className="w-5 h-5" />}
              </div>
              
              {/* Message Bubble */}
              <div className={`px-4 py-3 rounded-2xl relative group ${
                msg.role === 'user' 
                  ? 'bg-[var(--color-navy)] text-white rounded-tr-sm' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm pr-10'
              }`}>
                <div className="text-[15px] leading-relaxed">
                   {msg.role === 'assistant' ? parseMarkdownLike(msg.content) : msg.content}
                </div>
                
                {/* Text-to-Speech Button (Assistant Only) */}
                {msg.role === 'assistant' && supported && (
                  <button
                    onClick={() => handleReadAloud(msg.content, idx)}
                    className={`absolute right-2 top-2 p-1.5 rounded-full transition-opacity ${readingIdx === idx ? 'opacity-100 bg-blue-100 text-blue-600' : 'opacity-0 group-hover:opacity-100 hover:bg-gray-100 text-gray-400'}`}
                    aria-label={readingIdx === idx ? "Stop reading" : "Read message aloud"}
                  >
                    {readingIdx === idx ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[85%] flex-row">
              <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full mt-1 bg-[var(--color-saffron)] text-white mr-3">
                <Bot className="w-5 h-5" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200 rounded-tl-sm shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length < 3 && !isLoading && (
        <div className="px-4 pt-2 pb-1 bg-white border-t border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex gap-2">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button 
                key={idx} 
                onClick={() => handleSend(t(q))}
                className="inline-block px-3 py-1.5 text-xs font-medium bg-blue-50 text-[var(--color-navy)] border border-blue-100 rounded-full hover:bg-blue-100 transition-colors"
                aria-label={`Ask: ${t(q)}`}
              >
                {t(q)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-600 text-xs font-medium flex items-center border-t border-red-100">
          <AlertCircle className="w-4 h-4 mr-1 shrink-0" />
          {error}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={t("Type your question...")}
            className="flex-1 px-4 py-2 sm:py-3 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] focus:bg-white transition-all disabled:opacity-60"
            aria-label="Chatbot input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="shrink-0 flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-[var(--color-saffron)] hover:bg-[var(--color-saffron-dark)] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
