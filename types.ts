
export type UserRole = 'junior' | 'senior' | 'alumni';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  branch: string;
  batch: string;
  interests: string[];
  stats: {
    questionsAsked: number;
    answersGiven: number;
    helpedCount: number;
    totalUpvotes: number;
  };
}

export type Category = 
  | 'DSA vs Development' 
  | 'Open Source' 
  | 'GSoC' 
  | 'Internships' 
  | 'Higher Studies' 
  | 'Balancing Clubs & Academics'
  | 'Others';

export interface Question {
  id: string;
  title: string;
  originalText: string;
  neutralText?: string;
  baselineAnswer?: {
    summary: string;
    paths: string[];
  };
  suggestedTags: string[];
  category: Category | string;
  tags: string[];
  anonymousDisplayName: string;
  userId: string;
  createdAt: number;
  upvotes: number;
  isResolved: boolean;
}

export interface Comment {
  id: string;
  answerId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: number;
}

export interface Mention {
  id: string;
  targetUserId: string;
  fromUserName: string;
  questionId: string;
  answerId: string;
  text: string;
  createdAt: number;
  isRead: boolean;
}

export interface StructuredAnswer {
  id: string;
  questionId: string;
  userId: string;
  userRole: UserRole;
  userBranch: string;
  shortAnswer: string;
  pros: string[];
  cons: string[];
  actionPlan: string[];
  upvotes: number;
  helpedCount: number;
  upvotedBy: string[]; // Track user IDs who upvoted
  helpedBy: string[];  // Track user IDs who marked as helpful
  createdAt: number;
  comments: Comment[];
}

export interface ThreadSummary {
  tldr: string;
  consensus: string;
  differences: string;
}
