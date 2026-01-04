
import React, { useState } from 'react';
import { db } from '../services/mockDatabase';
import { Question, Category, User } from '../types';
import { CATEGORIES } from '../constants';

interface Props {
  user: User;
  onViewQuestion: (id: string) => void;
  onAskQuestion: () => void;
}

const Dashboard: React.FC<Props> = ({ user, onViewQuestion, onAskQuestion }) => {
  const [tab, setTab] = useState<'feed' | 'my-stats' | 'mentions'>('feed');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  
  const questions = db.getQuestions();
  const filteredQuestions = selectedCategory === 'All' 
    ? questions 
    : questions.filter(q => {
        if (selectedCategory === 'Others') {
          const standardCategories = CATEGORIES.filter(c => c !== 'Others');
          return !standardCategories.includes(q.category as Category);
        }
        return q.category === selectedCategory;
      });

  const mentions = db.getMentions(user.id);

  // Reputation Logic
  const calculateProgress = () => {
    const totalPoints = user.stats.answersGiven * 10 + user.stats.helpedCount * 20 + user.stats.totalUpvotes * 5;
    const nextLevelAt = 500;
    return Math.min(100, (totalPoints / nextLevelAt) * 100);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex bg-indigo-50/50 p-1 rounded-2xl border border-indigo-100">
        <button 
          onClick={() => setTab('feed')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${
            tab === 'feed' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-indigo-300 hover:text-indigo-500 hover:bg-white/40'
          }`}
        >
          WISDOM FEED
        </button>
        <button 
          onClick={() => setTab('my-stats')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${
            tab === 'my-stats' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-indigo-300 hover:text-indigo-500 hover:bg-white/40'
          }`}
        >
          MY DASHBOARD
        </button>
        <button 
          onClick={() => setTab('mentions')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all relative ${
            tab === 'mentions' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-indigo-300 hover:text-indigo-500 hover:bg-white/40'
          }`}
        >
          MENTIONS
          {mentions.some(m => !m.isRead) && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
        </button>
      </div>

      {tab === 'feed' && (
        <>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-indigo-950 tracking-tight">Wisdom Feed</h2>
              <p className="text-sm font-medium text-indigo-900/40">Verified campus insights</p>
            </div>
            <button 
              onClick={onAskQuestion}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg hover:scale-105 transition-all"
            >
              Ask Question
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {['All', ...CATEGORIES].map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`whitespace-nowrap px-5 py-2 rounded-xl text-[11px] font-bold transition-all border-2 ${selectedCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-300 border-indigo-50 hover:border-indigo-200'}`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="space-y-5">
            {filteredQuestions.map((q, idx) => (
              <div 
                key={q.id}
                onClick={() => onViewQuestion(q.id)}
                className="bg-white border border-indigo-100/60 rounded-[2rem] p-7 cursor-pointer hover:border-indigo-300 hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">{q.category}</span>
                  <span className="text-[10px] font-bold text-indigo-200">{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-extrabold text-indigo-950 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">{q.title}</h3>
                <div className="flex items-center justify-between pt-4 border-t border-indigo-50 mt-4">
                   <div className="flex gap-2">
                     {q.tags.slice(0, 2).map(t => <span key={t} className="text-[9px] font-black text-indigo-300 bg-indigo-50 px-2 py-0.5 rounded">#{t}</span>)}
                   </div>
                   <span className="text-[10px] font-black text-indigo-950/40">{db.getAnswers(q.id).length} ANSWERS</span>
                </div>
              </div>
            ))}
            {filteredQuestions.length === 0 && (
              <div className="text-center py-20 bg-indigo-50/20 rounded-[2rem] text-indigo-200 font-bold uppercase tracking-widest text-xs italic">
                No questions found in this category.
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'my-stats' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-2 gap-4">
            {/* Questions Card */}
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2.5rem] relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-600/10 transition-colors" />
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">Questions</p>
               </div>
               <h4 className="text-4xl font-black text-indigo-950">{user.stats.questionsAsked}</h4>
            </div>

            {/* Answers Card */}
            <div className="bg-violet-50 border border-violet-100 p-6 rounded-[2.5rem] relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-20 h-20 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/10 transition-colors" />
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-violet-600 text-white rounded-2xl shadow-lg shadow-violet-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-400">Answers</p>
               </div>
               <h4 className="text-4xl font-black text-indigo-950">{user.stats.answersGiven}</h4>
            </div>

            {/* Helped Card */}
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2.5rem] relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-600/5 rounded-full blur-2xl group-hover:bg-emerald-600/10 transition-colors" />
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600/60">Impact</p>
               </div>
               <h4 className="text-4xl font-black text-emerald-700">{user.stats.helpedCount}</h4>
            </div>

            {/* Likes Card */}
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2.5rem] relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-600/5 rounded-full blur-2xl group-hover:bg-amber-600/10 transition-colors" />
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600/60">Likes</p>
               </div>
               <h4 className="text-4xl font-black text-amber-700">{user.stats.totalUpvotes}</h4>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-50 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/40 rounded-full blur-3xl -mr-20 -mt-20" />
             <div className="flex items-center justify-between mb-6 relative z-10">
                <h4 className="text-xs font-black text-indigo-950 uppercase tracking-widest">Campus Reputation</h4>
                <span className="text-[10px] font-black text-indigo-400">LEVEL 1</span>
             </div>
             <div className="flex items-center gap-6 mb-8 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-indigo-200">🏆</div>
                <div className="flex-1">
                   <p className="font-black text-indigo-950 text-lg leading-tight">Campus Path-Finder</p>
                   <p className="text-xs text-indigo-400 mt-1 font-medium">Contribute more to reach <span className="font-black">Academic Sage</span></p>
                </div>
             </div>
             
             <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-end mb-1">
                   <span className="text-[10px] font-black text-indigo-400">REPUTATION POINTS</span>
                   <span className="text-[10px] font-black text-indigo-600">{Math.floor(calculateProgress() * 5)} / 500</span>
                </div>
                <div className="h-3 w-full bg-indigo-50 rounded-full overflow-hidden border border-indigo-100">
                   <div 
                     className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full shadow-lg shadow-indigo-100/50 transition-all duration-1000 ease-out"
                     style={{ width: `${calculateProgress()}%` }}
                   />
                </div>
             </div>
          </div>
        </div>
      )}

      {tab === 'mentions' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-indigo-950 px-2">Recent Follow-ups</h2>
          {mentions.length === 0 ? (
            <div className="text-center py-20 bg-indigo-50/20 rounded-[2rem] text-indigo-200 font-bold uppercase tracking-widest text-xs italic">
              No one has questioned you yet. Keep it up!
            </div>
          ) : (
            mentions.map(m => (
              <div 
                key={m.id} 
                onClick={() => onViewQuestion(m.questionId)}
                className="bg-white p-6 rounded-[2rem] border border-indigo-100 hover:border-indigo-400 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-[10px] font-black">@</div>
                   <p className="text-sm font-black text-indigo-950">
                     <span className="text-indigo-600">{m.fromUserName}</span> mentioned you
                   </p>
                </div>
                <p className="text-sm text-indigo-900/60 font-medium mb-3 italic">"{m.text}"</p>
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">View thread →</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
