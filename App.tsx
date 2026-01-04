
import React, { useState } from 'react';
import { User } from './types';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import AskQuestion from './pages/AskQuestion';
import QuestionDetail from './pages/QuestionDetail';
import Profile from './pages/Profile';

type Page = 'landing' | 'dashboard' | 'ask' | 'detail' | 'profile';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [params, setParams] = useState<any>({});

  const handleNavigate = (page: string, p: any = {}) => {
    setCurrentPage(page as Page);
    setParams(p);
    window.scrollTo(0, 0);
  };

  const handleAuth = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const renderPage = () => {
    if (!user && currentPage !== 'landing') {
      return <Landing onLogin={handleAuth} />;
    }

    switch (currentPage) {
      case 'landing':
        return user ? <Dashboard user={user} onViewQuestion={(id) => handleNavigate('detail', { id })} onAskQuestion={() => handleNavigate('ask')} /> : <Landing onLogin={handleAuth} />;
      case 'dashboard':
        return <Dashboard user={user!} onViewQuestion={(id) => handleNavigate('detail', { id })} onAskQuestion={() => handleNavigate('ask')} />;
      case 'ask':
        return <AskQuestion user={user!} onQuestionPosted={(id) => handleNavigate('detail', { id })} />;
      case 'detail':
        return <QuestionDetail user={user!} questionId={params.id} onViewProfile={(id) => handleNavigate('profile', { id })} onNavigateHome={() => handleNavigate('dashboard')} />;
      case 'profile':
        return <Profile userId={params.id} currentUser={user!} onProfileUpdate={handleProfileUpdate} />;
      default:
        return <Dashboard user={user!} onViewQuestion={(id) => handleNavigate('detail', { id })} onAskQuestion={() => handleNavigate('ask')} />;
    }
  };

  return (
    <Layout user={user} onNavigate={handleNavigate} onLogout={handleLogout}>
      {renderPage()}
    </Layout>
  );
};

export default App;
