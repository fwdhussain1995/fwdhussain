import React, { useState } from 'react';
import { Layout, Plus, Search, BookOpen, Library, Settings } from 'lucide-react';
import { Paper, ViewState, PaperStatus } from './types';
import { MOCK_PAPERS, CURRENT_USER } from './constants';
import { PaperCard } from './components/PaperCard';
import { Editor } from './components/Editor';
import { Reader } from './components/Reader';

// App Layout Wrapper
const AppLayout: React.FC<{ 
  children: React.ReactNode; 
  activeView: ViewState; 
  onChangeView: (v: ViewState) => void; 
}> = ({ children, activeView, onChangeView }) => {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col shrink-0 transition-all duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
            <BookOpen size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden lg:block">ScholarAI</span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">
          <button 
            onClick={() => onChangeView(ViewState.DASHBOARD)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${activeView === ViewState.DASHBOARD ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Layout size={20} />
            <span className="hidden lg:block font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => onChangeView(ViewState.EDITOR)}
             className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${activeView === ViewState.EDITOR ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Plus size={20} />
            <span className="hidden lg:block font-medium">New Paper</span>
          </button>
          
          <div className="pt-4 mt-4 border-t border-slate-800 hidden lg:block">
            <h4 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Library</h4>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <Library size={18} />
              <span className="text-sm">My Publications</span>
            </button>
             <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <img src={CURRENT_USER.avatar} alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{CURRENT_USER.name}</p>
              <p className="text-xs text-slate-400 truncate">{CURRENT_USER.affiliation}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [papers, setPapers] = useState<Paper[]>(MOCK_PAPERS);
  const [activePaperId, setActivePaperId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activePaper = papers.find(p => p.id === activePaperId);

  const handleCreatePaper = () => {
    const newPaper: Paper = {
      id: Date.now().toString(),
      title: 'Untitled Draft',
      abstract: 'Add an abstract...',
      content: '# Introduction\n\nStart writing...',
      authors: [CURRENT_USER],
      status: PaperStatus.DRAFT,
      tags: [],
      citations: 0,
    };
    setPapers([newPaper, ...papers]);
    setActivePaperId(newPaper.id);
    setView(ViewState.EDITOR);
  };

  const handleSavePaper = (updated: Paper) => {
    setPapers(papers.map(p => p.id === updated.id ? updated : p));
  };

  const handlePaperClick = (id: string) => {
    setActivePaperId(id);
    setView(ViewState.READER);
  };

  const handleEditClick = (id: string) => {
    setActivePaperId(id);
    setView(ViewState.EDITOR);
  };

  const filteredPapers = papers.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.abstract.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout activeView={view} onChangeView={(v) => {
      if (v === ViewState.EDITOR) handleCreatePaper();
      else {
        setView(v);
        setActivePaperId(null);
      }
    }}>
      {view === ViewState.DASHBOARD && (
        <div className="flex flex-col h-full overflow-hidden bg-slate-50">
          <header className="px-8 py-6 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
              <p className="text-slate-500">Welcome back, {CURRENT_USER.name}</p>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            </div>
          </header>

          <div className="flex-grow overflow-y-auto px-8 pb-12">
            {filteredPapers.length === 0 ? (
               <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                 <Search size={48} className="mb-4 opacity-50"/>
                 <p>No papers found matching "{searchQuery}"</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredPapers.map(paper => (
                  <PaperCard 
                    key={paper.id} 
                    paper={paper} 
                    onClick={() => {
                        if (paper.status === PaperStatus.DRAFT) handleEditClick(paper.id);
                        else handlePaperClick(paper.id);
                    }} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === ViewState.EDITOR && activePaper && (
        <Editor 
          paper={activePaper} 
          onSave={handleSavePaper}
          onCancel={() => setView(ViewState.DASHBOARD)}
        />
      )}

      {view === ViewState.READER && activePaper && (
        <Reader 
          paper={activePaper} 
          onBack={() => setView(ViewState.DASHBOARD)} 
        />
      )}
    </AppLayout>
  );
}
