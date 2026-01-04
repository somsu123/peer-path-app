
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/mockDatabase';
import { getThreadSummary } from '../services/geminiService';
import StructuredAnswerCard from '../components/StructuredAnswerCard';
import { User, Question, StructuredAnswer, ThreadSummary } from '../types';

interface Props {
  user: User;
  questionId: string;
  onViewProfile: (id: string) => void;
  onNavigateHome: () => void;
}

const QuestionDetail: React.FC<Props> = ({ user, questionId, onViewProfile, onNavigateHome }) => {
  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [answers, setAnswers] = useState<StructuredAnswer[]>([]);
  const [summary, setSummary] = useState<ThreadSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Answer Form State
  const [shortAnswer, setShortAnswer] = useState('');
  const [pros, setPros] = useState(['', '']);
  const [cons, setCons] = useState(['', '']);
  const [plan, setPlan] = useState(['Days 1-10: ', 'Days 11-20: ', 'Days 21-30: ']);

  useEffect(() => {
    refreshData();
  }, [questionId]);

  const refreshData = () => {
    const q = db.getQuestion(questionId);
    const a = db.getAnswers(questionId);
    setQuestion(q ? { ...q } : undefined);
    setAnswers([...a]);
  };

  const submitAnswer = () => {
    if (user.role === 'junior') {
      alert("Only seniors and alumni can provide structured mentorship answers.");
      return;
    }

    if (!shortAnswer.trim()) {
      alert("Please provide a core insight before publishing.");
      return;
    }

    db.addAnswer({
      questionId, 
      userId: user.id, 
      userRole: user.role,
      userBranch: user.branch, 
      shortAnswer,
      pros: pros.filter(p => p.trim() !== ''),
      cons: cons.filter(c => c.trim() !== ''),
      actionPlan: plan.filter(s => s.trim() !== '' && s !== 'Days 1-10: ' && s !== 'Days 11-20: ' && s !== 'Days 21-30: ')
    });

    refreshData();
    setShowAnswerForm(false);
    setShortAnswer('');
    setPros(['', '']);
    setCons(['', '']);
    setPlan(['Days 1-10: ', 'Days 11-20: ', 'Days 21-30: ']);
  };

  const handlePostComment = (ansId: string) => {
    if (!commentText.trim()) return;
    db.addComment(ansId, user.id, commentText, questionId);
    setCommentText('');
    setCommentingOn(null);
    refreshData();
  };

  const handleReplyToUser = (ansId: string, userName: string) => {
    setCommentingOn(ansId);
    setCommentText(`@${userName} `);
    // Use timeout to wait for input field rendering
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        // Move cursor to end
        const val = inputRef.current.value;
        inputRef.current.value = '';
        inputRef.current.value = val;
      }
    }, 100);
  };

  const handleGenerateSummary = async () => {
    if (!question || answers.length < 2) return;
    setLoadingSummary(true);
    try {
      const summaryData = await getThreadSummary(question.originalText, answers);
      if (summaryData) {
        setSummary(summaryData);
      }
    } catch (error) {
      console.error("Gemini Synthesis Error:", error);
    } finally {
      setLoadingSummary(false);
    }
  };

  if (!question) return <div className="p-10 text-center font-black text-indigo-200">Wisdom being archived...</div>;

  const isMentor = user.role === 'senior' || user.role === 'alumni';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase bg-indigo-600 text-white px-3 py-1 rounded-full">{question.category}</span>
            <span className="text-xs font-bold text-indigo-300">• {question.anonymousDisplayName}</span>
          </div>
        </div>
        <h2 className="text-4xl font-black text-indigo-950 leading-tight">{question.title}</h2>
        <div className="bg-white/60 p-8 rounded-[2.5rem] border border-indigo-50 shadow-sm backdrop-blur-sm">
           <p className="text-indigo-900/70 leading-relaxed font-medium italic text-lg">"{question.originalText}"</p>
        </div>
      </div>

      {question.baselineAnswer && (
        <div className="relative group p-1 rounded-[2.6rem] bg-gradient-to-tr from-indigo-500 via-violet-500 to-indigo-500">
           <div className="bg-indigo-950 p-8 rounded-[2.5rem] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 blur-3xl rounded-full" />
             <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-[10px] text-white font-black shadow-lg shadow-indigo-500/40">AI</div>
               <h3 className="text-sm font-black text-indigo-100 uppercase tracking-[0.2em]">Neural Clarity Point</h3>
             </div>
             <p className="text-indigo-100/80 mb-6 font-medium leading-relaxed">{question.baselineAnswer.summary}</p>
             <div className="flex flex-wrap gap-2">
               {question.baselineAnswer.paths.map((p, i) => (
                 <span key={i} className="text-[10px] font-black bg-white/10 text-indigo-200 border border-white/10 px-4 py-1.5 rounded-full">{p}</span>
               ))}
             </div>
           </div>
        </div>
      )}

      {summary && (
        <div className="bg-white border-2 border-indigo-950 p-8 rounded-[2.5rem] shadow-2xl relative">
          <div className="absolute -top-3 left-8 bg-indigo-950 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest">THREAD SYNTHESIS</div>
          <p className="text-lg font-bold text-indigo-950 mb-6 leading-tight">{summary.tldr}</p>
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-indigo-50">
             <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase mb-2">The Consensus</p>
                <p className="text-xs text-indigo-900/60 font-medium">{summary.consensus}</p>
             </div>
             <div>
                <p className="text-[10px] font-black text-rose-500 uppercase mb-2">Conflict Points</p>
                <p className="text-xs text-indigo-900/60 font-medium">{summary.differences}</p>
             </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-2xl font-black text-indigo-950">{answers.length} Mentorship Insights</h3>
          {isMentor && (
            <button 
              type="button"
              onClick={() => setShowAnswerForm(!showAnswerForm)} 
              className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all uppercase tracking-widest ${showAnswerForm ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
            >
              {showAnswerForm ? 'Cancel' : 'Contribute Wisdom'}
            </button>
          )}
        </div>

        {showAnswerForm && isMentor && (
          <div className="bg-white border-4 border-indigo-50 rounded-[2.5rem] p-8 space-y-6 shadow-xl animate-in slide-in-from-top-4">
             <h4 className="font-black text-indigo-950 uppercase tracking-widest text-sm mb-2">Draft Your Structured Answer</h4>
             
             <div className="space-y-4">
                <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest">The Core Insight</label>
                <textarea 
                  placeholder="The main takeaway for the student..." 
                  className="w-full p-5 bg-white rounded-2xl border-2 border-indigo-50 focus:border-indigo-600 outline-none font-bold text-sm text-indigo-950 shadow-inner block"
                  value={shortAnswer}
                  onChange={e => setShortAnswer(e.target.value)}
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest">Pros</label>
                   <input className="p-4 bg-white rounded-xl text-xs font-bold outline-none border-2 border-indigo-50 focus:border-emerald-200 text-indigo-950 block w-full" placeholder="Upside 1" value={pros[0]} onChange={e => setPros([e.target.value, pros[1]])} />
                   <input className="p-4 bg-white rounded-xl text-xs font-bold outline-none border-2 border-indigo-50 focus:border-emerald-200 text-indigo-950 block w-full" placeholder="Upside 2" value={pros[1]} onChange={e => setPros([pros[0], e.target.value])} />
                </div>
                <div className="space-y-2">
                   <label className="block text-[10px] font-black text-rose-600 uppercase tracking-widest">Risks</label>
                   <input className="p-4 bg-white rounded-xl text-xs font-bold outline-none border-2 border-indigo-50 focus:border-rose-200 text-indigo-950 block w-full" placeholder="Risk 1" value={cons[0]} onChange={e => setCons([e.target.value, cons[1]])} />
                   <input className="p-4 bg-white rounded-xl text-xs font-bold outline-none border-2 border-indigo-50 focus:border-rose-200 text-indigo-950 block w-full" placeholder="Risk 2" value={cons[1]} onChange={e => setCons([cons[0], e.target.value])} />
                </div>
             </div>

             <div className="space-y-4 pt-2">
                <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest">30-Day Execution Plan</label>
                <div className="space-y-3">
                   {plan.map((step, idx) => (
                      <input 
                        key={idx}
                        className="w-full p-4 bg-indigo-50/30 rounded-xl text-xs font-bold outline-none border-2 border-transparent focus:border-indigo-600 text-indigo-950 block"
                        value={step}
                        onChange={e => {
                           const newPlan = [...plan];
                           newPlan[idx] = e.target.value;
                           setPlan(newPlan);
                        }}
                      />
                   ))}
                </div>
             </div>

             <button type="button" onClick={submitAnswer} className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-lg hover:shadow-indigo-200 transition-all hover:scale-[1.01] active:scale-[0.99]">Publish Structured Answer</button>
          </div>
        )}

        {answers.map(ans => (
          <div key={ans.id} className="space-y-4">
            <StructuredAnswerCard 
              answer={ans} 
              currentUserId={user.id}
              onUpvote={id => { db.upvoteAnswer(id, user.id); refreshData(); }}
              onHelped={id => { db.markHelped(id, user.id); refreshData(); }}
              onViewProfile={onViewProfile}
            />
            
            <div className="px-6 space-y-3">
              {ans.comments.map(c => (
                <div key={c.id} className="flex gap-3 bg-white border border-indigo-50 p-4 rounded-3xl animate-in fade-in shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-[10px] font-black text-indigo-600 uppercase flex-shrink-0 shadow-sm">
                    {c.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {/* Name click also triggers reply if not self */}
                        <button 
                          type="button"
                          onClick={() => c.userId !== user.id ? handleReplyToUser(ans.id, c.userName) : null}
                          className={`text-[11px] font-black text-indigo-950 transition-colors ${c.userId !== user.id ? 'hover:text-indigo-600 cursor-pointer' : 'cursor-default'}`}
                        >
                          {c.userName}
                        </button>
                        {c.userId !== user.id && (
                          <button 
                            type="button"
                            onClick={() => handleReplyToUser(ans.id, c.userName)}
                            className="text-[9px] font-black text-indigo-400 hover:text-indigo-600 uppercase tracking-widest bg-indigo-50/50 px-2 py-0.5 rounded-md transition-all active:scale-95"
                          >
                            Reply back
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-[12px] text-indigo-950 font-medium leading-relaxed mt-1.5">
                      {c.text.startsWith('@') ? (
                        <>
                          <span className="text-indigo-600 font-extrabold">{c.text.split(' ')[0]}</span>
                          {c.text.substring(c.text.split(' ')[0].length)}
                        </>
                      ) : c.text}
                    </p>
                  </div>
                </div>
              ))}
              
              {commentingOn === ans.id ? (
                <div className="flex gap-2 animate-in slide-in-from-left-2 mt-4 bg-white p-2 rounded-2xl border border-indigo-100 shadow-xl ring-4 ring-indigo-50">
                  <input 
                    ref={inputRef}
                    className="flex-1 px-4 py-3 rounded-xl bg-white text-sm font-bold outline-none text-indigo-950 placeholder:text-indigo-200 block"
                    placeholder="Ask a follow-up question..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handlePostComment(ans.id)}
                  />
                  <button 
                    type="button"
                    disabled={!commentText.trim()}
                    onClick={() => handlePostComment(ans.id)}
                    className="bg-indigo-600 disabled:bg-indigo-100 text-white px-6 rounded-xl text-[10px] font-black tracking-widest transition-all active:scale-95 shadow-md shadow-indigo-100"
                  >
                    REPLY
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => setCommentingOn(ans.id)}
                  className="text-[10px] font-black text-indigo-400 hover:text-indigo-600 tracking-widest pl-2 flex items-center gap-2 py-3 transition-all group"
                >
                  <div className="w-5 h-5 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </div>
                  QUESTION THIS ANSWER
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {answers.length > 1 && !summary && (
        <div className="text-center pt-8">
           <button 
             type="button"
             onClick={handleGenerateSummary}
             className="px-8 py-4 bg-indigo-950 text-white rounded-2xl font-black text-xs tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto border-4 border-white/10"
           >
             {loadingSummary ? 'SYNTHESIZING...' : 'AI THREAD SYNTHESIS'}
             <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM14.243 15.657a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM4.343 15.657a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0z" /></svg>
           </button>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;
