import React from 'react';
import { StructuredAnswer } from '../types';

interface Props {
  answer: StructuredAnswer;
  currentUserId: string;
  onUpvote: (id: string) => void;
  onHelped: (id: string) => void;
  onViewProfile: (id: string) => void;
}

const StructuredAnswerCard: React.FC<Props> = ({ answer, currentUserId, onUpvote, onHelped, onViewProfile }) => {
  const isUpvoted = answer.upvotedBy.includes(currentUserId);
  const isHelped = answer.helpedBy.includes(currentUserId);

  return (
    <div className="bg-white border border-indigo-50 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all mb-8 relative group overflow-hidden">
      {/* Decorative background - kept as first child for base level rendering */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 blur-2xl rounded-full -mr-10 -mt-10 group-hover:bg-indigo-100/40 transition-colors pointer-events-none" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div 
          onClick={() => onViewProfile(answer.userId)}
          className="flex items-center gap-4 cursor-pointer group/mentor"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 border-2 border-white flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-100 group-hover/mentor:scale-110 transition-transform">
            {answer.userRole.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-black text-indigo-950 group-hover/mentor:text-indigo-600 transition-colors">
              {answer.userRole.charAt(0).toUpperCase() + answer.userRole.slice(1)} Mentor
            </h4>
            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">{answer.userBranch} • Batch {new Date(answer.createdAt).getFullYear() + 2}</p>
          </div>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="bg-indigo-50/20 p-6 rounded-[2rem] border border-indigo-50/50">
          <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-3">Core Insight</h5>
          <p className="text-indigo-950 font-bold leading-relaxed text-lg">{answer.shortAnswer}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-emerald-50/40 p-6 rounded-[2rem] border border-emerald-100/50 group/pro">
            <div className="flex items-center gap-2 mb-3">
               <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
               </div>
               <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-700">The Upsides</h5>
            </div>
            <ul className="text-xs text-emerald-900/70 font-bold space-y-2 list-none">
              {answer.pros.map((p, i) => <li key={i} className="flex gap-2"><span>•</span>{p}</li>)}
            </ul>
          </div>
          <div className="bg-rose-50/40 p-6 rounded-[2rem] border border-rose-100/50 group/con">
            <div className="flex items-center gap-2 mb-3">
               <div className="w-6 h-6 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
               </div>
               <h5 className="text-[10px] font-black uppercase tracking-widest text-rose-700">The Risks</h5>
            </div>
            <ul className="text-xs text-rose-900/70 font-bold space-y-2 list-none">
              {answer.cons.map((c, i) => <li key={i} className="flex gap-2"><span>•</span>{c}</li>)}
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
          <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-5 relative z-10">30-Day Execution Plan</h5>
          <ol className="text-sm text-white/90 font-medium space-y-4 relative z-10">
            {answer.actionPlan.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-white/10 backdrop-blur rounded flex items-center justify-center text-[10px] font-black text-indigo-300 border border-white/5">{i + 1}</span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4 border-t border-indigo-50 pt-6 relative z-10">
        <button 
          type="button"
          onClick={() => onUpvote(answer.id)}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all text-xs font-black active:scale-90 ${
            isUpvoted 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
              : 'text-indigo-400 hover:bg-indigo-50 hover:text-indigo-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
          {answer.upvotes}
        </button>
        <button 
          type="button"
          onClick={() => onHelped(answer.id)}
          className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-2xl transition-all text-xs font-black border hover:scale-[1.02] active:scale-[0.98] ${
            isHelped
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100'
              : 'bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 hover:from-emerald-500/20 hover:to-indigo-500/20 text-indigo-700 border-indigo-100'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>
          {isHelped ? 'Marked as Helpful' : 'Mark as Helpful'}
          {answer.helpedCount > 0 && <span className={`px-2 py-0.5 rounded-full text-[9px] ml-1 ${isHelped ? 'bg-white text-emerald-600' : 'bg-indigo-600 text-white'}`}>{answer.helpedCount}</span>}
        </button>
      </div>
    </div>
  );
};

export default StructuredAnswerCard;