
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onNavigate: (page: string, params?: any) => void;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onNavigate, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto bg-white/40 border-x border-indigo-100/50 shadow-2xl shadow-indigo-100/50">
      <header className="sticky top-0 z-50 glass border-b border-indigo-100/50 px-6 py-4 flex justify-between items-center">
        <div 
          onClick={() => onNavigate('landing')} 
          className="cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
            <span className="text-white font-extrabold text-lg">P</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-violet-700">PeerPath</h1>
        </div>
        
        <nav className="flex items-center gap-5">
          {user ? (
            <>
              <button 
                onClick={() => onNavigate('dashboard')}
                className="text-sm font-bold text-indigo-900/70 hover:text-indigo-600 transition-colors"
              >
                Feed
              </button>
              <div className="flex items-center gap-2 border-l border-indigo-100 pl-4 ml-2">
                <button 
                  onClick={() => onNavigate('profile', { id: user.id })}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 flex items-center justify-center text-xs font-black text-indigo-600 shadow-sm hover:shadow-indigo-100 hover:scale-105 transition-all"
                >
                  {user.displayName.charAt(0)}
                </button>
                <button 
                  onClick={onLogout}
                  className="p-2 text-rose-400 hover:text-rose-600 transition-colors"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => onNavigate('landing')}
              className="text-sm font-bold px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all"
            >
              Get Started
            </button>
          )}
        </nav>
      </header>

      <main className="flex-1 px-6 py-8 relative">
        <div className="absolute top-20 -left-20 w-40 h-40 bg-indigo-200/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-40 -right-20 w-40 h-40 bg-emerald-200/20 blur-3xl rounded-full animate-pulse delay-700" />
        <div className="relative z-0">
          {children}
        </div>
      </main>

      <footer className="py-8 px-6 text-center border-t border-indigo-50 text-indigo-300 text-[10px] font-bold uppercase tracking-widest">
        <p>&copy; 2024 PeerPath • Empowering Student Decisions</p>
      </footer>
    </div>
  );
};

export default Layout;
