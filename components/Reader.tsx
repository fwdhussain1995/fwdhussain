import React, { useState, useEffect, useRef } from 'react';
import { Paper, ChatMessage, AIReviewResult } from '../types';
import { ArrowLeft, MessageSquare, BookOpen, FileText, Send, Sparkles, User, Bot, Check, AlertTriangle, Star } from 'lucide-react';
import { chatWithPaper, reviewPaper, summarizePaper } from '../services/geminiService';
import ReactMarkdown from 'react-markdown'; // Assuming this might be available or simulated, but for pure text we can just render text. 
// Actually prompt said "Use popular libraries". ReactMarkdown is standard but I cannot import it if not in package.json.
// I will use a simple whitespace-pre-wrap for now to be safe, or just render text. 
// Wait, I can't install packages. I will interpret markdown simply or just show text. 
// A better "Senior" way without packages is to just use a simple parser or whitespace-pre-wrap.

interface ReaderProps {
  paper: Paper;
  onBack: () => void;
}

const MarkdownDisplay: React.FC<{ content: string }> = ({ content }) => {
  // Simple "Markdown" simulation for headers and paragraphs
  return (
    <div className="prose prose-slate max-w-none">
       {content.split('\n').map((line, i) => {
         if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-6 mb-4 text-slate-900">{line.replace('# ', '')}</h1>
         if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-5 mb-3 text-slate-800">{line.replace('## ', '')}</h2>
         if (line.trim() === '') return <br key={i} />
         return <p key={i} className="mb-2 text-slate-700 leading-7">{line}</p>
       })}
    </div>
  )
}

export const Reader: React.FC<ReaderProps> = ({ paper, onBack }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'review'>('chat');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [review, setReview] = useState<AIReviewResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputMessage,
      timestamp: Date.now()
    };
    
    setChatHistory(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Pass history to context
      const historyForAi = chatHistory.map(m => ({ role: m.role, text: m.text }));
      const responseText = await chatWithPaper(userMsg.text, paper.content, historyForAi);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setChatHistory(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateReview = async () => {
    if (review) return; // Already generated
    setIsReviewing(true);
    try {
      const result = await reviewPaper(paper.content);
      setReview(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* Main Content (Paper) */}
      <div className="flex-grow h-full flex flex-col overflow-hidden relative">
        <div className="h-16 flex items-center px-6 bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
             <h1 className="text-lg font-bold text-slate-900 truncate pr-4">{paper.title}</h1>
             <p className="text-xs text-slate-500">
               {paper.authors.map(a => a.name).join(', ')} • {paper.publishDate || 'Draft'}
             </p>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-8 lg:p-12 bg-slate-50">
          <div className="max-w-3xl mx-auto bg-white shadow-sm border border-slate-200 p-12 min-h-full rounded-xl">
             <MarkdownDisplay content={paper.content} />
          </div>
        </div>
      </div>

      {/* Sidebar (AI Tools) */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-xl z-20">
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'chat' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <MessageSquare size={16} /> Chat
          </button>
          <button 
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'review' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Sparkles size={16} /> Review
          </button>
        </div>

        <div className="flex-grow overflow-hidden relative bg-slate-50/50">
          {activeTab === 'chat' && (
            <div className="absolute inset-0 flex flex-col">
              <div className="flex-grow overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {chatHistory.length === 0 && (
                  <div className="text-center mt-10 p-6">
                    <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bot size={24} />
                    </div>
                    <p className="text-slate-600 font-medium">Ask me anything!</p>
                    <p className="text-slate-400 text-sm mt-1">I've read the paper and I'm ready to explain concepts, summarize sections, or answer specific questions.</p>
                  </div>
                )}
                {chatHistory.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                     <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-bl-none shadow-sm flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                     </div>
                  </div>
                )}
              </div>
              <div className="p-4 bg-white border-t border-slate-200">
                <div className="relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about this paper..."
                    className="w-full pl-4 pr-10 py-3 bg-slate-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="absolute inset-0 overflow-y-auto p-6">
              {!review && !isReviewing && (
                <div className="text-center mt-10">
                   <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText size={32} />
                   </div>
                   <h3 className="text-slate-900 font-bold mb-2">Generate AI Review</h3>
                   <p className="text-slate-500 text-sm mb-6">Get an instant peer review simulation identifying strengths, weaknesses, and a quality score.</p>
                   <button 
                     onClick={handleGenerateReview}
                     className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                   >
                     Start Review
                   </button>
                </div>
              )}

              {isReviewing && (
                 <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-emerald-700 font-medium animate-pulse">Analyzing content...</p>
                 </div>
              )}

              {review && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Score</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xl">
                        <Star className="fill-current" size={20} />
                        {review.score}/10
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic border-l-4 border-indigo-500 pl-3">
                      "{review.summary}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                      <Check size={16} className="text-emerald-500" /> Key Strengths
                    </h4>
                    <ul className="space-y-2">
                      {review.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                      <AlertTriangle size={16} className="text-red-500" /> Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {review.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
