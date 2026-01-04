
import React, { useState } from 'react';
import { CATEGORIES, INTEREST_TAGS } from '../constants';
import { getAIClarification, findSimilarQuestions } from '../services/geminiService';
import { db } from '../services/mockDatabase';
import { User, Category } from '../types';

interface Props {
  user: User;
  onQuestionPosted: (id: string) => void;
}

const AskQuestion: React.FC<Props> = ({ user, onQuestionPosted }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [similarQIndices, setSimilarQIndices] = useState<number[]>([]);

  const handleNextWithAI = async () => {
    if (step === 1) {
      if (category === 'Others' && !customCategory.trim()) {
        alert("Please specify the topic for your question.");
        return;
      }
      setLoadingAI(true);
      const existingQs = db.getQuestions();
      const [analysis, similar] = await Promise.all([
        getAIClarification(text),
        findSimilarQuestions(text, existingQs.map(q => q.title))
      ]);
      setAiAnalysis(analysis);
      setSimilarQIndices(similar);
      setLoadingAI(false);
      setStep(2);
    }
  };

  const finalCategory = category === 'Others' ? customCategory : category;

  const handlePostDirectly = () => {
    if (category === 'Others' && !customCategory.trim()) {
      alert("Please specify the topic for your question.");
      return;
    }
    const q = db.addQuestion({
      title: title || text.slice(0, 50) + (text.length > 50 ? '...' : ''),
      originalText: text,
      category: finalCategory,
      tags: selectedTags,
      anonymousDisplayName: `${user.batch.slice(-2)}'th Batch ${user.branch} Student`,
      userId: user.id,
      suggestedTags: []
    });
    onQuestionPosted(q.id);
  };

  const handleFinalSubmit = () => {
    const q = db.addQuestion({
      title: title || aiAnalysis?.neutralQuestion?.slice(0, 50) + '...',
      originalText: text,
      neutralText: aiAnalysis?.neutralQuestion,
      baselineAnswer: aiAnalysis?.baselineAnswer,
      suggestedTags: aiAnalysis?.suggestedTags || [],
      category: finalCategory,
      tags: [...selectedTags, ...(aiAnalysis?.suggestedTags || [])],
      anonymousDisplayName: `${user.batch.slice(-2)}'th Batch ${user.branch} Student`,
      userId: user.id
    });
    onQuestionPosted(q.id);
  };

  return (
    <div className="max-w-xl mx-auto py-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-indigo-950 tracking-tight">Seeking Clarity?</h2>
        <p className="text-sm font-medium text-indigo-900/40">Your question will be posted anonymously to the campus.</p>
      </div>

      <div className="flex gap-3 mb-10">
        {[1, 2].map(i => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo-600 shadow-sm shadow-indigo-100' : 'bg-indigo-50'}`} />
        ))}
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          <div className="relative">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-3 ml-1">Topic Category</label>
            <div className="relative">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-5 py-4 rounded-2xl border-2 border-indigo-100/50 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none bg-white text-indigo-950 font-bold appearance-none cursor-pointer shadow-sm transition-all hover:shadow-md"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-white text-indigo-950 py-2">{c}</option>)}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </div>
            </div>
          </div>

          {category === 'Others' && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-3 ml-1">Specific Topic</label>
              <input
                type="text"
                placeholder="What is the specific topic of your question?"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border-2 border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none bg-white text-indigo-950 font-bold placeholder:text-indigo-200 shadow-md transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-3 ml-1">Short Headline</label>
            <input
              type="text"
              placeholder="e.g., Choosing between Web Dev and Data Science"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-indigo-100/50 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none bg-white text-indigo-950 font-bold placeholder:text-indigo-200 shadow-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-3 ml-1">Full Context</label>
            <textarea
              rows={5}
              placeholder="Be specific! Mention your current year, what you've tried, and what's blocking you."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-indigo-100/50 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none resize-none bg-white text-indigo-950 font-medium placeholder:text-indigo-200 shadow-sm transition-all"
            />
          </div>

          <div className="flex flex-col gap-4">
            <button 
              disabled={!text || loadingAI || (category === 'Others' && !customCategory.trim())}
              onClick={handleNextWithAI}
              className={`w-full py-5 rounded-[1.5rem] font-black shadow-xl flex items-center justify-center gap-3 transition-all ${loadingAI || (category === 'Others' && !customCategory.trim()) ? 'bg-indigo-100 text-indigo-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-indigo-100'}`}
            >
              {loadingAI ? (
                <>
                  <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  AI Analysis in progress...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                  Analyze with AI Co-pilot
                </>
              )}
            </button>
            <button 
              disabled={!text || loadingAI || (category === 'Others' && !customCategory.trim())}
              onClick={handlePostDirectly}
              className="w-full py-4 rounded-[1.5rem] font-black text-indigo-600 bg-white border-2 border-indigo-100 hover:border-indigo-600 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              Quick Post (Skip AI)
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          {aiAnalysis && (
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-indigo-900 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200 relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
              </div>
              
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">AI Co-pilot Insight</h3>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 bg-violet-500/20 text-violet-400 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    </div>
                    <p className="text-[10px] font-black text-violet-300 uppercase tracking-widest">Refined Clarity</p>
                  </div>
                  <p className="text-white text-lg font-bold leading-tight italic">"{aiAnalysis.neutralQuestion}"</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                    </div>
                    <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Immediate Guidance</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {aiAnalysis.baselineAnswer.paths.map((p: string, i: number) => (
                      <div key={i} className="flex gap-4 items-start bg-indigo-50/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors">
                        <span className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-[10px] font-black text-indigo-300 border border-white/5 group-hover:scale-110 transition-transform">{i + 1}</span>
                        <p className="text-sm text-indigo-50 font-medium leading-relaxed">{p}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {similarQIndices.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-[2rem] flex items-start gap-4 shadow-sm">
               <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
               </div>
               <div>
                  <p className="text-sm font-black text-amber-900 mb-1">WAIT! SIMILAR TOPICS FOUND</p>
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">Seniors have already discussed something very similar. You might find your answer in the feed!</p>
               </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-50 shadow-sm">
             <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 ml-1">Relevant Expertise Tags</label>
             <div className="flex flex-wrap gap-2">
               {INTEREST_TAGS.map(tag => (
                 <button
                   key={tag}
                   onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                   className={`text-[10px] font-black px-4 py-2 rounded-xl border-2 transition-all ${selectedTags.includes(tag) ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105' : 'bg-white text-indigo-300 border-indigo-50 hover:border-indigo-200'}`}
                 >
                   {tag.toUpperCase()}
                 </button>
               ))}
             </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={() => setStep(1)} className="flex-1 py-5 bg-white border-2 border-indigo-100 text-indigo-400 font-black rounded-2xl hover:bg-indigo-50 transition-colors">Adjust Input</button>
            <button onClick={handleFinalSubmit} className="flex-[2] py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98]">Publish Anonymously</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskQuestion;
