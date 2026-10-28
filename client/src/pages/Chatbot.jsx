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
} from 'lucide-react';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSleep } from '../context/SleepContext';

export default function Chatbot() {
  const { user } = useAuth();
  const { logs } = useSleep();

  const [conversations, setConversations] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [checkedTips, setCheckedTips] = useState({});

  const messagesEndRef = useRef(null);

  const quickPrompts = [
    'Why am I waking up around 3 AM and how can I fix it?',
    'Analyze my recent sleep logs and suggest 3 high-impact fixes',
    'How does my afternoon caffeine cutoff affect my sleep latency?',
    'Create an evidence-based 45-minute wind-down routine for high stress',
    'Explain the 4-7-8 breathing method and 90-minute sleep cycles',
  ];

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadConversations = async () => {
    try {
      const res = await chatAPI.getConversations();
      if (res.success && res.data) {
        setConversations(res.data);
        if (res.data.length > 0 && !currentConvId) {
          selectConversation(res.data[0].id);
        } else if (res.data.length === 0) {
          startNewConversation();
        }
      }
    } catch (err) {
      console.warn('Failed to load conversations:', err.message);
    }
  };

  const selectConversation = async (convId) => {
    setCurrentConvId(convId);
    try {
      const res = await chatAPI.getConversation(convId);
      if (res.success && res.data) {
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      console.warn('Failed to fetch conversation thread:', err.message);
    }
  };

  const startNewConversation = () => {
    setCurrentConvId(null);
    setMessages([
      {
        _id: 'welcome_' + Date.now(),
        sender: 'assistant',
        text: `Hello ${user?.name?.split(' ')[0] || 'there'}! I am SomnaAI, your evidence-based Sleep Guidance Specialist powered by the Gemini API. 

I have synchronized your profile (${user?.sleepProfile?.chronotype || 'Intermediate'} chronotype, ${user?.sleepProfile?.targetHours || 8}h goal) and recent sleep telemetry.

How can I help you improve your sleep quality or circadian alignment today?`,
        timestamp: new Date(),
        actionableTips: [
          'Ask about your recent sleep consistency score',
          'Optimize your caffeine cutoff window',
          'Design an evening blue-light detox protocol'
        ]
      },
    ]);
  };

  const handleSendMessage = async (textToSend = inputMessage) => {
    const text = textToSend.trim();
    if (!text || loading) return;

    // Append optimistic user message
    const tempUserMsg = {
      _id: 'user_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage(text, currentConvId);
      if (res.success) {
        if (!currentConvId && res.conversationId) {
          setCurrentConvId(res.conversationId);
          loadConversations();
        }
        setMessages((prev) => [...prev, res.message]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          _id: 'err_' + Date.now(),
          sender: 'assistant',
          text: `⚠️ **Error receiving guidance**: ${err.message}. Please verify the backend connection and try again.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (e, id) => {
    e.stopPropagation();
    try {
      await chatAPI.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (currentConvId === id) {
        startNewConversation();
      }
    } catch (err) {
      console.warn('Failed to delete conversation:', err.message);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const toggleCheckTip = (tip) => {
    setCheckedTips((prev) => ({
      ...prev,
      [tip]: !prev[tip],
    }));
  };

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col md:flex-row gap-4 animate-fadeIn">
      {/* Left Sidebar: Conversations & Telemetry Context */}
      <div className="hidden md:flex flex-col w-72 glass-card rounded-2xl border border-indigo-950 p-4 shrink-0 justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Conversations
            </h3>
            <button
              onClick={startNewConversation}
              className="p-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-all text-xs flex items-center gap-1 font-semibold"
              title="New Chat"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>

          {/* Conversation List */}
          <div className="space-y-1.5 overflow-y-auto max-h-[45vh] pr-1">
            {conversations.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No previous sessions</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                    currentConvId === conv.id
                      ? 'bg-indigo-600/30 border border-indigo-500/50 text-white font-medium'
                      : 'hover:bg-sleep-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="truncate flex-1 pr-2">
                    <p className="truncate font-semibold">{conv.title}</p>
                    <p className="text-[10px] text-slate-500 truncate">{conv.lastMessage}</p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Context Card at Bottom of Sidebar */}
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/60 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Gemini Context Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            The AI chatbot dynamically injects your last <strong className="text-slate-200">{logs.length} sleep logs</strong>, chronotype, and caffeine cutoff into each prompt.
          </p>
          <div className="pt-2 border-t border-indigo-950/80 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span>Model: Gemini 1.5</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 glass-card rounded-2xl border border-indigo-950 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-indigo-950 flex items-center justify-between bg-sleep-900/40">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-dream-purple flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Bot className="w-5 h-5" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-sleep-950 absolute -bottom-0.5 -right-0.5"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">SomnaAI Sleep Guidance Specialist</h2>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  CBT-I Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Personalized sleep science & circadian rhythm consultation
              </p>
            </div>
          </div>

          <button
            onClick={startNewConversation}
            className="md:hidden p-2 rounded-lg bg-indigo-600/30 text-indigo-300 text-xs font-semibold"
          >
            New Chat
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg._id || idx}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                    isUser
                      ? 'bg-indigo-600 shadow-md shadow-indigo-600/25'
                      : 'bg-gradient-to-tr from-indigo-700 to-purple-600'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Content Bubble */}
                <div
                  className={`relative p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                    isUser
                      ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none'
                      : 'bg-sleep-900/90 text-slate-200 border-indigo-900/50 rounded-tl-none shadow-xl'
                  }`}
                >
                  {/* Copy Button for Assistant */}
                  {!isUser && (
                    <button
                      onClick={() => copyToClipboard(msg.text, idx)}
                      className="absolute top-2 right-2 p-1 rounded text-slate-500 hover:text-white transition-colors"
                      title="Copy response"
                    >
                      {copiedIdx === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  {/* Render message text with paragraphs */}
                  <div className="space-y-2 whitespace-pre-wrap font-normal">
                    {msg.text}
                  </div>

                  {/* Actionable Tips Pills */}
                  {msg.actionableTips && msg.actionableTips.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-indigo-950/80 space-y-1.5">
                      <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" /> Actionable Protocols:
                      </p>
                      {msg.actionableTips.map((tip, tIdx) => {
                        const isChecked = !!checkedTips[tip];
                        return (
                          <div
                            key={tIdx}
                            onClick={() => toggleCheckTip(tip)}
                            className={`flex items-start gap-2 p-2 rounded-xl text-xs cursor-pointer transition-all border ${
                              isChecked
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 line-through'
                                : 'bg-sleep-950/60 border-indigo-950 hover:border-indigo-800 text-slate-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="mt-0.5 accent-emerald-500 cursor-pointer"
                            />
                            <span className="flex-1">{tip}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-2 text-[10px] text-slate-400/80 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {loading && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-700 to-purple-600 flex items-center justify-center shrink-0 text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-sleep-900 border border-indigo-900/50 rounded-tl-none flex items-center gap-2 text-indigo-300 text-xs">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-2 font-medium">Gemini is synthesizing sleep science telemetry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips (Visible when idle) */}
        <div className="px-4 py-2 bg-sleep-950/60 border-t border-indigo-950/80 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Prompts:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={loading}
              className="shrink-0 px-2.5 py-1 rounded-full text-xs bg-sleep-900 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-indigo-900/60 hover:border-indigo-600/40 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-sleep-950 border-t border-indigo-950 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about your sleep quality, circadian clock, late caffeine, or insomnia..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            className="flex-1 bg-sleep-900/90 border border-indigo-900/70 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
