
import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDatabase';
import { User } from '../types';
import { INTEREST_TAGS } from '../constants';

interface Props {
  userId: string;
  currentUser: User;
  onProfileUpdate: (user: User) => void;
}

const Profile: React.FC<Props> = ({ userId, currentUser, onProfileUpdate }) => {
  const [mentor, setMentor] = useState<User | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    branch: '',
    batch: '',
    interests: [] as string[]
  });

  useEffect(() => {
    const m = db.getMentor(userId);
    if (m) {
      setMentor(m);
      setFormData({
        displayName: m.displayName,
        branch: m.branch,
        batch: m.batch,
        interests: m.interests
      });
    }
  }, [userId]);

  const isOwnProfile = currentUser.id === userId;

  const handleToggleInterest = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(tag) 
        ? prev.interests.filter(t => t !== tag) 
        : [...prev.interests, tag]
    }));
  };

  const handleSave = () => {
    if (!formData.displayName.trim() || !formData.branch.trim() || !formData.batch.trim()) {
      alert("All fields are required.");
      return;
    }
    const updated = db.updateUser(userId, formData);
    if (updated) {
      setMentor(updated);
      setIsEditing(false);
      if (isOwnProfile) {
        onProfileUpdate(updated);
      }
    }
  };

  if (!mentor) return <div className="text-center py-20 text-indigo-300 font-bold">Mentor profile not found.</div>;

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="text-center relative">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black mx-auto mb-6 shadow-2xl animate-float">
          {mentor.displayName.charAt(0)}
        </div>
        
        {isEditing ? (
          <div className="space-y-4 max-w-sm mx-auto">
            <input
              type="text"
              placeholder="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              className="w-full px-5 py-3 rounded-xl border-2 border-indigo-50 focus:border-indigo-600 focus:outline-none transition-all font-bold text-center"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Branch"
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-indigo-50 font-bold text-xs text-center"
              />
              <input
                type="text"
                placeholder="Batch"
                value={formData.batch}
                onChange={(e) => setFormData({...formData, batch: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-indigo-50 font-bold text-xs text-center"
              />
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-black text-indigo-950">{mentor.displayName}</h2>
            <p className="text-indigo-900/40 font-bold mt-1 uppercase tracking-widest text-[10px]">{mentor.branch} • Batch {mentor.batch}</p>
            <span className="inline-block mt-4 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-100">
              {mentor.role}
            </span>
          </>
        )}

        {isOwnProfile && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-0 right-0 p-3 bg-white border border-indigo-100 rounded-2xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-2 text-[10px] font-black tracking-widest uppercase"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border-2 border-indigo-50 p-8 rounded-[2.5rem] shadow-sm text-center">
          <p className="text-4xl font-black text-indigo-950">{mentor.stats.answersGiven}</p>
          <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mt-1">Answers Given</p>
        </div>
        <div className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[2.5rem] text-center">
          <p className="text-4xl font-black text-emerald-700">{mentor.stats.helpedCount}</p>
          <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mt-1">People Helped</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] px-2">Domain Expertise</h3>
        {isEditing ? (
          <div className="flex flex-wrap gap-2 bg-indigo-50/30 p-6 rounded-[2rem] border border-indigo-100/50">
            {INTEREST_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => handleToggleInterest(tag)}
                className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${formData.interests.includes(tag) ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-indigo-300 border-indigo-50 hover:border-indigo-200'}`}
              >
                {tag.toUpperCase()}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 px-2">
            {mentor.interests.map(interest => (
              <span key={interest} className="px-5 py-2.5 bg-white border border-indigo-100 text-indigo-950 rounded-2xl text-xs font-bold shadow-sm">
                {interest}
              </span>
            ))}
            {mentor.interests.length === 0 && <p className="text-xs italic text-indigo-200">No interests selected yet.</p>}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            className="flex-[2] py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Save Profile Changes
          </button>
          <button 
            onClick={() => setIsEditing(false)}
            className="flex-1 py-5 bg-white border-2 border-indigo-100 text-indigo-400 font-black rounded-2xl hover:bg-indigo-50 transition-all"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="bg-indigo-950 p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 blur-3xl rounded-full" />
          <h3 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-4 relative z-10">Campus Reputation</h3>
          <p className="text-sm text-white/80 leading-relaxed font-medium relative z-10">
            {mentor.stats.helpedCount > 10 
              ? `Highly active verified ${mentor.role}. Best reached for queries in ${mentor.interests.slice(0, 2).join(' or ')}.`
              : `Verified campus ${mentor.role}. Actively contributing to the student community.`
            }
          </p>
        </div>
      )}

      <div className="pt-8 border-t border-indigo-50">
         <p className="text-center text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Verified Campus Identity</p>
      </div>
    </div>
  );
};

export default Profile;
