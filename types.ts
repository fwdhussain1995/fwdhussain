export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
  READER = 'READER',
}

export enum PaperStatus {
  DRAFT = 'Draft',
  UNDER_REVIEW = 'Under Review',
  PUBLISHED = 'Published',
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  affiliation: string;
}

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  content: string; // Markdown content
  authors: Author[];
  status: PaperStatus;
  publishDate?: string;
  tags: string[];
  coverImage?: string;
  citations: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AIReviewResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  score: number;
}
