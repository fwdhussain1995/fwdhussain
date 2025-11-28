import React, { useState, useCallback } from 'react';
import { Paper } from '../types';
import { Save, Wand2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { improveWriting } from '../services/geminiService';

interface EditorProps {
  paper: Paper;
  onSave: (updatedPaper: Paper) => void;
  onCancel: () => void;
}

export const Editor: React.FC<EditorProps> = ({ paper, onSave, onCancel }) => {
  const [title, setTitle] = useState(paper.title);
  const [content, setContent] = useState(paper.content);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleImprove = async (type: 'grammar' | 'clarity' | 'academic') => {
    // In a real editor, we would get the selected text. 
    // Here we'll just simulate improving the whole content or the last paragraph for simplicity.
    // Let's improve the whole content if short, or warn user.
    if (content.length > 5000) {
        setNotification("Content too long for full auto-improve. Please select a section (Not implemented in demo).");
        return;
    }

    setIsAiProcessing(true);
    setNotification("AI is rewriting your text...");
    
    try {
      const improved = await improveWriting(content, type);
      setContent(improved);
      setNotification("Text updated successfully!");
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {
      setNotification("Failed to improve text.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSave = () => {
    onSave({ ...paper, title, content });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-slate-200 p-4 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-serif text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400 w-96"
            placeholder="Enter Paper Title..."
          />
          <span className="text-xs px-2 py-1 bg-slate-200 rounded text-slate-600 font-medium">Draft Mode</span>
        </div>
        
        <div className="flex items-center gap-2">
            {notification && (
                <span className="text-sm text-indigo-600 animate-pulse mr-4 flex items-center gap-1">
                   <Wand2 size={14} /> {notification}
                </span>
            )}
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Save size={16} />
            Save Draft
          </button>
        </div>
      </div>

      {/* AI Toolbar */}
      <div className="bg-indigo-50 border-b border-indigo-100 p-2 flex items-center justify-center gap-3">
        <span className="text-xs font-semibold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
          <Wand2 size={12} /> AI Tools:
        </span>
        <button 
          disabled={isAiProcessing}
          onClick={() => handleImprove('grammar')}
          className="px-3 py-1 bg-white border border-indigo-200 text-indigo-700 rounded text-xs font-medium hover:bg-indigo-50 disabled:opacity-50 transition-colors"
        >
          Fix Grammar
        </button>
        <button 
           disabled={isAiProcessing}
           onClick={() => handleImprove('clarity')}
          className="px-3 py-1 bg-white border border-indigo-200 text-indigo-700 rounded text-xs font-medium hover:bg-indigo-50 disabled:opacity-50 transition-colors"
        >
          Improve Clarity
        </button>
        <button 
           disabled={isAiProcessing}
           onClick={() => handleImprove('academic')}
          className="px-3 py-1 bg-white border border-indigo-200 text-indigo-700 rounded text-xs font-medium hover:bg-indigo-50 disabled:opacity-50 transition-colors"
        >
          Make Academic
        </button>
      </div>

      {/* Edit Area */}
      <div className="flex-grow p-8 overflow-y-auto bg-slate-50">
        <div className="max-w-4xl mx-auto bg-white min-h-[800px] shadow-sm p-12 border border-slate-100">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[700px] resize-none border-none focus:outline-none focus:ring-0 text-lg leading-relaxed font-serif text-slate-800 placeholder-slate-300"
            placeholder="Start writing your paper here..."
          />
        </div>
      </div>
    </div>
  );
};
