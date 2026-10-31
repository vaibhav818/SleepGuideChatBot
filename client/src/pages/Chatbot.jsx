import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Plus,
  Trash2,
  CheckCircle,
  Copy,
  Check,
  Moon,
  Zap,
  Info,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSleep } from '../context/SleepContext';
import { useTheme } from '../context/ThemeContext';

export default function Chatbot() {
  const { user } = useAuth();
  const { logs } = useSleep();
  const { theme, selectedPalette } = useTheme();

  const [conversations, setConversations] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'Why am I waking up around 3 AM and how can I fix it?',
    'Analyze my recent sleep logs and suggest 3 high-impact circadian fixes',
    'How does my afternoon caffeine cutoff affect my slow-wave sleep latency?',
    'Create an evidence-based 45-minute wind-down routine for high stress',
    'Explain the 4-7-8 breathing method and 90-minute ultradian sleep cycles',
  ];

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadConversations = async () => {
    try {
      const res = await chatAPI.getConversations();
      if (res.success && res.data) {
        setConversations(res.data);
        if (res.data.length > 0 && !currentConvId) {
          const firstId = res.data[0].id || res.data[0]._id;
          if (firstId) selectConversation(firstId);
        } else if (res.data.length === 0) {
          startNewConversation();
        }
      }
    } catch (err) {
      console.warn('Failed to load conversations:', err.message);
    }
  };

  const selectConversation = async (convId) => {
    if (!convId) return;
    setCurrentConvId(convId);
    try {
      const res = await chatAPI.getConversation(convId);
      if (res.success && res.data) {
        const rawList = res.data.messages || [];
        const normalized = rawList.map((m) => {
          const isUser = m.role === 'user' || m.sender === 'user';
          const textVal = m.content || m.text || '';
          return {
            ...m,
            role: isUser ? 'user' : 'assistant',
            sender: isUser ? 'user' : 'assistant',
            content: textVal,
            text: textVal,
            timestamp: m.timestamp || new Date(),
            actionableTips: m.actionableTips || [],
          };
        });
        setMessages(normalized);
      }
    } catch (err) {
      console.warn('Failed to fetch conversation thread:', err.message);
    }
  };

  const startNewConversation = () => {
    setCurrentConvId(null);
    setMessages([
      {
        role: 'assistant',
        content: `Greetings, ${user?.name?.split(' ')[0] || 'Friend'}. I am your SomnaAI Circadian Science Guide, powered by Google Gemini. I analyze your biological chronotype (${user?.sleepProfile?.chronotype || 'Intermediate'}), nocturnal telemetry, and adenosine clearance curves. How is your sleep restoration feeling today?`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async (customPrompt) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage(textToSend.trim(), currentConvId);
      if (res && (res.success || res.message || res.response)) {
        const replyText = typeof res.message === 'string'
          ? res.message
          : (res.response || res.message?.text || res.message?.content || 'I have analyzed your query based on clinical sleep protocols.');

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: replyText,
            timestamp: new Date(),
            contextUsed: 'SomnaAI',
          },
        ]);
        if (!currentConvId && res.conversationId) {
          setCurrentConvId(res.conversationId);
          loadConversations();
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      const isOffline = err.message?.includes('Cannot reach') || err.message?.includes('Backend server') || err.message?.includes('Failed to fetch');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: isOffline
            ? '⚠️ SomnaAI Backend server is not reachable on port 5000. Please run "npm run dev" or "node server/server.js" in your project directory.'
            : `Unable to complete request: ${err.message || 'Please verify Gemini API key and backend server.'}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col md:flex-row gap-4 pb-4 animate-fadeIn">
      {/* Sidebar: Threads & History */}
      <div
        className="w-full md:w-72 rounded-3xl p-4 flex flex-col justify-between border backdrop-blur-xl transition-colors duration-700"
        style={{
          backgroundColor: theme.cardGlass,
          borderColor: theme.border,
        }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              CIRCADIAN SESSIONS
            </span>
            <button
              onClick={startNewConversation}
              className="p-1.5 rounded-xl font-bold transition-transform active:scale-95 shadow-md"
              style={{
                backgroundColor: theme.accentPrimary,
                color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                boxShadow: `0 4px 14px ${theme.glowColor}`,
              }}
              title="New Session"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-[45vh] md:max-h-[60vh] overflow-y-auto pr-1">
            {conversations.map((c) => {
              const convId = c.id || c._id;
              const isSelected = currentConvId === convId;
              return (
                <button
                  key={convId}
                  onClick={() => selectConversation(convId)}
                  className={`w-full text-left p-3 rounded-2xl text-xs transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'border font-semibold shadow-sm'
                      : 'bg-white/[0.02] border border-white/[0.05] text-slate-300 hover:bg-white/[0.05]'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: theme.accentMuted,
                          borderColor: theme.border,
                          color: theme.accentPrimary,
                        }
                      : {}
                  }
                >
                  <span className="truncate flex-1">{c.title || 'Circadian Sleep Consultation'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-[10px] text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: theme.accentPrimary }} />
          <span>Gemini AI guidance grounds advice in clinical polysomnography & circadian rhythms.</span>
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        className="flex-1 rounded-3xl border backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl transition-colors duration-700"
        style={{
          backgroundColor: theme.cardGlass,
          borderColor: theme.border,
        }}
      >
        {/* Thread Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center border"
              style={{
                backgroundColor: theme.accentMuted,
                borderColor: theme.border,
                color: theme.accentPrimary,
              }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Somna AI Sleep Science Guide</h2>
              <p className="text-[11px]" style={{ color: theme.accentPrimary }}>Gemini Flash-Lite Nocturnal Intelligence</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/5">
            {user?.sleepProfile?.chronotype || 'Intermediate'} Chronotype
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user' || m.sender === 'user';
            const messageText = typeof m.content === 'string' && m.content
              ? m.content
              : (typeof m.text === 'string' && m.text ? m.text : (typeof m === 'string' ? m : ''));

            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div
                    className="w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: theme.accentMuted,
                      borderColor: theme.border,
                      color: theme.accentPrimary,
                    }}
                  >
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'font-medium shadow-lg'
                      : 'bg-white/[0.04] border border-white/[0.08] text-slate-200'
                  }`}
                  style={
                    isUser
                      ? {
                          backgroundColor: theme.accentPrimary,
                          color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                          boxShadow: `0 4px 18px ${theme.glowColor}`,
                        }
                      : {}
                  }
                >
                  <div className="whitespace-pre-wrap">{messageText}</div>

                  {!isUser && m.actionableTips && m.actionableTips.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/[0.08] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: theme.accentPrimary }}>
                        Key Sleep Protocol:
                      </span>
                      <ul className="space-y-0.5">
                        {m.actionableTips.map((tip, tipIdx) => (
                          <li key={tipIdx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                            <span style={{ color: theme.accentPrimary }}>•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!isUser && (
                    <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" style={{ color: theme.accentPrimary }} />
                        SomnaAI
                      </span>
                      <button
                        onClick={() => handleCopy(messageText, idx)}
                        className="hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div
                className="w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: theme.accentMuted,
                  borderColor: theme.border,
                  color: theme.accentPrimary,
                }}
              >
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: theme.accentPrimary }}
                ></div>
                <span>Gemini is synthesizing physiological sleep telemetry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-6 py-2 flex items-center gap-2 overflow-x-auto border-t border-white/[0.04] bg-black/10">
          {quickPrompts.slice(0, 3).map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300 transition-all flex-shrink-0 hover:text-white"
              style={{ borderColor: theme.border }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-black/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about sleep stages, morning grogginess, or circadian timing..."
              className="flex-1 bg-white/[0.04] border rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
              style={{ borderColor: theme.border }}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-3 rounded-2xl font-bold shadow-lg transition-all disabled:opacity-40"
              style={{
                backgroundColor: theme.accentPrimary,
                color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                boxShadow: `0 4px 18px ${theme.glowColor}`,
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
