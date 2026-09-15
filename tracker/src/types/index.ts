export interface Application {
  id: string;
  role: string;
  company: string;
  location?: string;
  status: 'prep' | 'sent' | 'interview' | 'offer' | 'rejected' | 'ghost';
  date?: string; // YYYY-MM-DD
  salary?: string;
  resumeId?: string;
  keywords?: string;
  strengths?: string;
  notes?: string;
  url?: string;
  createdAt: string;
}

export interface Resume {
  id: string;
  name: string;
  title?: string;
  type: 'automation' | 'it' | 'other';
  lang: 'en' | 'pt-br' | 'other';
  path?: string;
  pdfUrl?: string;
  targetCompany?: string;
  basedOn?: string;
  keywords: string;
  notes?: string;
  createdAt: string;
}

export type ApplicationStatus = Application['status'];
export type ResumeType = Resume['type'];
export type ResumeLang = Resume['lang'];

export interface FitResult {
  resume: Resume;
  score: number;
  matchedKeywords: string[];
  totalKeywords: number;
}
