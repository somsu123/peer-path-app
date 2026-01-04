
import { Question, StructuredAnswer, User, Comment, Mention } from '../types';

class MockDB {
  questions: Question[] = [];
  answers: StructuredAnswer[] = [];
  users: User[] = [];
  mentions: Mention[] = [];

  constructor() {
    // Seed Users
    this.users.push({
      id: 'u_senior',
      email: 'senior@aot.edu.in',
      role: 'senior',
      displayName: 'Rahul Sharma',
      branch: 'IT',
      batch: '2024',
      interests: ['Web', 'Product'],
      stats: { questionsAsked: 2, answersGiven: 5, helpedCount: 15, totalUpvotes: 45 }
    });

    this.users.push({
      id: 'u_alumni',
      email: 'alumni@aot.edu.in',
      role: 'alumni',
      displayName: 'Priya Das',
      branch: 'CSE',
      batch: '2022',
      interests: ['ML', 'GSoC', 'Google'],
      stats: { questionsAsked: 0, answersGiven: 12, helpedCount: 42, totalUpvotes: 120 }
    });

    this.users.push({
      id: 'u_junior_test',
      email: 'junior@aot.edu.in',
      role: 'junior',
      displayName: 'Arjun Mehra',
      branch: 'CSE',
      batch: '2026',
      interests: ['Web', 'App Dev'],
      stats: { questionsAsked: 5, answersGiven: 0, helpedCount: 0, totalUpvotes: 0 }
    });

    // Seed Questions
    const q1 = this.addQuestion({
      title: 'How to approach GSoC in 2025?',
      originalText: 'I am in 2nd year CSE. I know basic C++ and some Web Dev. How should I start preparing for GSoC?',
      category: 'GSoC',
      tags: ['gsoc', 'open-source', 'web-dev'],
      suggestedTags: ['linux', 'git', 'collaboration'],
      anonymousDisplayName: "2nd Year CSE Student",
      userId: 'u_junior_test'
    });

    const q3 = this.addQuestion({
      title: 'Balancing Academics and GDGoC?',
      originalText: 'I recently joined the GDGoC team, but finding it hard to manage lab records and projects. Any tips from seniors who were in the core team?',
      category: 'Balancing Clubs & Academics',
      tags: ['productivity', 'gdgoc', 'academics'],
      suggestedTags: ['time-management', 'prioritization'],
      anonymousDisplayName: "2nd Year ECE Student",
      userId: 'u_junior_test'
    });

    // Seed Answers
    const a1 = this.addAnswer({
      questionId: q1.id,
      userId: 'u_alumni',
      userRole: 'alumni',
      userBranch: 'CSE',
      shortAnswer: 'Start contributing to small issues in mid-sized organizations now.',
      pros: ['Early exposure to codebase', 'Builds relationship with mentors'],
      cons: ['Can be overwhelming initially', 'Takes time away from semester exams'],
      actionPlan: ['Dec: Pick 3 orgs', 'Jan: Solve 2 good-first-issues', 'Feb: Draft proposal draft 1']
    });

    const a3 = this.addAnswer({
      questionId: q3.id,
      userId: 'u_senior',
      userRole: 'senior',
      userBranch: 'IT',
      shortAnswer: 'Use your GDGoC projects as your college semester projects wherever possible.',
      pros: ['Double impact for same effort', 'Better quality project for resume'],
      cons: ['Need professors approval', 'Might not align 100% with syllabus'],
      actionPlan: ['Day 1: Map GDGoC tasks to Lab topics', 'Day 7: Talk to Lab instructor', 'Day 30: Finalize integrated project']
    });

    // Add seed comments
    this.addComment(a1.id, 'u_senior', 'Does solving documentation issues help much for GSoC?', q1.id);
    this.addComment(a3.id, 'u_junior_test', 'My professor is strict about sticking to the manual. What should I do?', q3.id);
  }

  getQuestions = () => { 
    return [...this.questions].sort((a, b) => b.createdAt - a.createdAt); 
  };
  
  getQuestion = (id: string) => { 
    const q = this.questions.find(q => q.id === id);
    return q ? { ...q } : undefined; 
  };
  
  getAnswers = (qId: string) => { 
    return this.answers
      .filter(a => a.questionId === qId)
      .map(a => ({ 
        ...a, 
        comments: a.comments.map(c => ({ ...c })),
        upvotedBy: [...a.upvotedBy],
        helpedBy: [...a.helpedBy]
      }))
      .sort((a, b) => b.upvotes - a.upvotes); 
  };

  getMentions = (userId: string) => {
    return this.mentions.filter(m => m.targetUserId === userId).sort((a, b) => b.createdAt - a.createdAt);
  };

  addUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email || '',
      role: userData.role || 'junior',
      displayName: userData.displayName || 'Anonymous User',
      branch: userData.branch || 'CSE',
      batch: userData.batch || '2026',
      interests: userData.interests || [],
      stats: { questionsAsked: 0, answersGiven: 0, helpedCount: 0, totalUpvotes: 0 },
      ...userData
    };
    this.users = [...this.users, newUser];
    return newUser;
  };

  updateUser = (id: string, data: Partial<User>) => {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      const updatedUsers = [...this.users];
      updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...data };
      this.users = updatedUsers;
      return { ...this.users[userIndex] };
    }
    return null;
  };

  addQuestion = (q: Omit<Question, 'id' | 'createdAt' | 'upvotes' | 'isResolved'>) => {
    const newQ: Question = {
      ...q,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      upvotes: 0,
      isResolved: false
    };
    this.questions = [newQ, ...this.questions];
    const user = this.users.find(u => u.id === q.userId);
    if (user) user.stats.questionsAsked++;
    return newQ;
  };

  addAnswer = (a: Omit<StructuredAnswer, 'id' | 'createdAt' | 'upvotes' | 'helpedCount' | 'comments' | 'upvotedBy' | 'helpedBy'>) => {
    const newA: StructuredAnswer = {
      ...a,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      upvotes: 0,
      helpedCount: 0,
      upvotedBy: [],
      helpedBy: [],
      comments: []
    };
    this.answers = [newA, ...this.answers];
    const user = this.users.find(u => u.id === a.userId);
    if (user) user.stats.answersGiven++;
    return newA;
  };

  addComment = (answerId: string, userId: string, text: string, questionId: string) => {
    const ansIndex = this.answers.findIndex(a => a.id === answerId);
    const user = this.users.find(u => u.id === userId);
    
    if (ansIndex !== -1 && user) {
      const comment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        answerId,
        userId,
        userName: user.displayName,
        text,
        createdAt: Date.now()
      };
      
      const updatedAnswers = [...this.answers];
      const updatedAns = { ...updatedAnswers[ansIndex] };
      updatedAns.comments = [...updatedAns.comments, comment];
      updatedAnswers[ansIndex] = updatedAns;
      this.answers = updatedAnswers;

      if (updatedAns.userId !== userId) {
        this.mentions = [...this.mentions, {
          id: Math.random().toString(36).substr(2, 9),
          targetUserId: updatedAns.userId,
          fromUserName: user.displayName,
          questionId,
          answerId,
          text: text.slice(0, 50) + '...',
          createdAt: Date.now(),
          isRead: false
        }];
      }
      return comment;
    }
    return null;
  };

  upvoteAnswer = (id: string, userId: string) => {
    const ansIndex = this.answers.findIndex(a => a.id === id);
    if (ansIndex !== -1) {
      const updatedAnswers = [...this.answers];
      const ans = { ...updatedAnswers[ansIndex] };
      const author = this.users.find(u => u.id === ans.userId);
      
      if (ans.upvotedBy.includes(userId)) {
        ans.upvotedBy = ans.upvotedBy.filter(uid => uid !== userId);
        ans.upvotes = Math.max(0, ans.upvotes - 1);
        if (author) author.stats.totalUpvotes = Math.max(0, author.stats.totalUpvotes - 1);
      } else {
        ans.upvotedBy = [...ans.upvotedBy, userId];
        ans.upvotes++;
        if (author) author.stats.totalUpvotes++;
      }
      updatedAnswers[ansIndex] = ans;
      this.answers = updatedAnswers;
    }
  };

  markHelped = (id: string, userId: string) => {
    const ansIndex = this.answers.findIndex(a => a.id === id);
    if (ansIndex !== -1) {
      const updatedAnswers = [...this.answers];
      const ans = { ...updatedAnswers[ansIndex] };
      const author = this.users.find(u => u.id === ans.userId);

      if (ans.helpedBy.includes(userId)) {
        ans.helpedBy = ans.helpedBy.filter(uid => uid !== userId);
        ans.helpedCount = Math.max(0, ans.helpedCount - 1);
        if (author) author.stats.helpedCount = Math.max(0, author.stats.helpedCount - 1);
      } else {
        ans.helpedBy = [...ans.helpedBy, userId];
        ans.helpedCount++;
        if (author) author.stats.helpedCount++;
      }
      updatedAnswers[ansIndex] = ans;
      this.answers = updatedAnswers;
    }
  };

  getMentor = (id: string) => { return this.users.find(u => u.id === id); };
}

export const db = new MockDB();
