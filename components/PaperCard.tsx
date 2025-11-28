import React from 'react';
import { Paper, PaperStatus } from '../types';
import { Calendar, Users, Eye, FileText } from 'lucide-react';

interface PaperCardProps {
  paper: Paper;
  onClick: () => void;
}

const StatusBadge: React.FC<{ status: PaperStatus }> = ({ status }) => {
  const colors = {
    [PaperStatus.PUBLISHED]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    [PaperStatus.DRAFT]: 'bg-amber-100 text-amber-800 border-amber-200',
    [PaperStatus.UNDER_REVIEW]: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status]}`}>
      {status}
    </span>
  );
};

export const PaperCard: React.FC<PaperCardProps> = ({ paper, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
        {paper.coverImage ? (
          <img src={paper.coverImage} alt={paper.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <FileText size={48} />
          </div>
        )}
        <div className="absolute top-3 right-3">
            <StatusBadge status={paper.status} />
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif font-bold text-lg leading-tight text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {paper.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-grow">
          {paper.abstract}
        </p>
        
        <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Users size={14} />
            <span>{paper.authors[0].name} {paper.authors.length > 1 && `+${paper.authors.length - 1}`}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{paper.citations}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{paper.publishDate || 'Not published'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
