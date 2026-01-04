
import React, { useState } from 'react';
import { UserRole } from '../types';
import { db } from '../services/mockDatabase';

interface Props {
  onLogin: (user: any) => void;
}

const Landing: React.FC<Props> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    role: 'junior' as UserRole,
    branch: 'CSE',
    batch: '2026'
  });
  const [error, setError] = useState('');

  const validateEmail = (email: string) => email.endsWith('.edu.in') || email.endsWith('.edu');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setError('College email required (.edu.in)');
      return;
    }

    if (mode === 'signup') {
      const newUser = db.addUser(formData);
      onLogin(newUser);
    } else {
      // Login simulation
      const user = db.users.find(u => u.email === formData.email);
      if (user) {
        onLogin(user);
      } else {
        setError('User not found. Please sign up first.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 text-center animate-in fade-in duration-1000">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl animate-float">
        <span className="text-white font-black text-4xl">P</span>
      </div>
      
      <h1 className="text-4xl font-black text-indigo-950 mb-2 tracking-tight">PeerPath</h1>
      <p className="text-indigo-900/60 mb-8 font-medium">Verify your campus identity to enter.</p>

      <div className="w-full max-w-sm bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-indigo-100 shadow-xl">
        <div className="flex bg-indigo-50 p-1.5 rounded-2xl mb-8">
          <button 
            onClick={() => {setMode('login'); setError('');}}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${mode === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-indigo-300'}`}
          >
            LOGIN
          </button>
          <button 
            onClick={() => {setMode('signup'); setError('');}}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${mode === 'signup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-indigo-300'}`}
          >
            SIGN UP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="College Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-5 py-4 rounded-xl border-2 border-indigo-50 focus:border-indigo-600 focus:outline-none transition-all font-bold text-sm"
          />
          
          {mode === 'signup' && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                className="w-full px-5 py-4 rounded-xl border-2 border-indigo-50 focus:border-indigo-600 focus:outline-none transition-all font-bold text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <select 
                  className="w-full px-4 py-4 rounded-xl border-2 border-indigo-50 font-bold text-xs"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                >
                  <option value="junior">Junior</option>
                  <option value="senior">Senior</option>
                  <option value="alumni">Alumni</option>
                </select>
                <input
                  type="text"
                  placeholder="Branch (e.g. CSE)"
                  value={formData.branch}
                  onChange={(e) => setFormData({...formData, branch: e.target.value})}
                  className="w-full px-5 py-4 rounded-xl border-2 border-indigo-50 font-bold text-xs"
                />
              </div>
            </>
          )}

          {error && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">{error}</p>}
          
          <button
            type="submit"
            className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Landing;
