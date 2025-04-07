'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Moon, Clock, Bed, Zap, MonitorSmartphone, Moon as MoonIcon, Coffee } from 'lucide-react';
import Markdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const initialMessages: Message[] = [
  {
    role: 'assistant',
    content: "Hello! I'm your Sleep Guide Assistant. I'm here to help you improve your sleep quality and develop healthy sleep habits. How can I assist you today?",
  },
];

// Popular sleep questions
const popularQuestions = [
  { 
    icon: <Clock className="w-5 h-5 text-purple-600" />,
    text: "How many hours of sleep do I need?" 
  },
  { 
    icon: <Clock className="w-5 h-5 text-purple-600" />,
    text: "What's a good bedtime routine?" 
  },
  { 
    icon: <MoonIcon className="w-5 h-5 text-purple-600" />,
    text: "How can I fall asleep faster?" 
  },
  { 
    icon: <Zap className="w-5 h-5 text-purple-600" />,
    text: "Why do I wake up during the night?" 
  },
  { 
    icon: <Bed className="w-5 h-5 text-purple-600" />,
    text: "Is napping good for you?" 
  },
  { 
    icon: <MonitorSmartphone className="w-5 h-5 text-purple-600" />,
    text: "How does screen time affect sleep?" 
  },
  { 
    icon: <Coffee className="w-5 h-5 text-purple-600" />,
    text: "What foods help with sleep?" 
  },
  { 
    icon: <Zap className="w-5 h-5 text-purple-600" />,
    text: "How can I stop snoring?" 
  }
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // For streaming responses
  const [currentResponse, setCurrentResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Track the accumulated response for proper saving
  const accumulatedResponseRef = useRef('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setError(null);
    setCurrentResponse('');
    accumulatedResponseRef.current = '';
    setShowSuggestions(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        let done = false;
        setCurrentResponse('');
        
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          
          if (value) {
            const chunkText = decoder.decode(value);
            accumulatedResponseRef.current += chunkText;
            setCurrentResponse(accumulatedResponseRef.current);
          }
        }
        
        // When stream is complete, add the accumulated message to history
        const finalResponse = accumulatedResponseRef.current;
        if (finalResponse) {
          setMessages((prev) => [...prev, { role: 'assistant', content: finalResponse }]);
          // Clear the current response display after adding to history
          setCurrentResponse('');
        }
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
    handleSubmit(new Event('submit') as any);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Header */}
      <div className="bg-purple-700 text-white p-6 rounded-t-lg">
        <div className="flex items-center">
          <Moon className="h-6 w-6 mr-3" />
          <div>
            <h1 className="text-xl font-semibold">Sleep Guide Assistant</h1>
            <p className="text-sm text-purple-100">Your personal guide to better sleep and rest</p>
          </div>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto pb-24 bg-slate-50">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {/* Render messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-2 mt-1">
                  <Moon className="h-5 w-5 text-purple-600" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <div className="prose prose-sm">
                  <Markdown>{message.content}</Markdown>
                </div>
              </div>
            </div>
          ))}
          
          {/* Current streaming response */}
          {currentResponse && (
            <div className="flex justify-start">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-2 mt-1">
                <Moon className="h-5 w-5 text-purple-600" />
              </div>
              
              <div className="max-w-[85%] rounded-2xl p-4 bg-white border border-gray-200 text-gray-800">
                <div className="prose prose-sm">
                  <Markdown>{currentResponse}</Markdown>
                </div>
              </div>
            </div>
          )}
          
          {/* Loading indicator */}
          {loading && !currentResponse && (
            <div className="flex justify-start">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-2 mt-1">
                <Moon className="h-5 w-5 text-purple-600" />
              </div>
              
              <div className="max-w-[85%] rounded-2xl p-4 bg-white border border-gray-200 text-gray-800">
                <div className="flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                  <span className="ml-2 text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="flex justify-center">
              <div className="max-w-[85%] rounded-lg p-4 bg-red-50 border border-red-200 text-red-700">
                <p>{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-sm underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          
          {/* Popular questions */}
          {showSuggestions && messages.length <= 1 && (
            <>
              <div className="text-gray-600 font-medium mt-6 mb-2">
                Popular sleep questions:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {popularQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question.text)}
                    className="flex items-center p-3 rounded-lg bg-white border border-gray-200 hover:bg-purple-50 transition-colors text-left"
                  >
                    <span className="mr-2">{question.icon}</span>
                    <span className="text-gray-800">{question.text}</span>
                  </button>
                ))}
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4 text-blue-700 text-sm">
                <strong>Note:</strong> I'm specialized in sleep-related topics only. For other questions, I'll need to redirect you to a more appropriate resource.
              </div>
            </>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex items-center space-x-2 rounded-full p-2 bg-white shadow-sm border border-gray-200"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about sleep..."
              className="flex-1 outline-none bg-transparent px-4 py-2"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || input.trim() === ''}
              className={`rounded-full p-3 ${
                loading || input.trim() === ''
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              } transition-colors`}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          
          <div className="mt-2 text-center text-xs text-gray-500">
            <p>
              Sleep Guide Assistant • Helping you rest better
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 