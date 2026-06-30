import React, { useState, useCallback } from 'react';
import { Application, Resume } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { seedApplications, seedResumes } from './data/seed';
import { ApplicationsTab } from './components/applications/ApplicationsTab';
import { ResumesTab } from './components/resumes/ResumesTab';
import { FitAnalyzerTab } from './components/analyzer/FitAnalyzerTab';

type Tab = 'applications' | 'analyzer' | 'resumes';

type ApplicationFormData = Omit<Application, 'id' | 'createdAt'>;
type ResumeFormData = Omit<Resume, 'id' | 'createdAt'>;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const TAB_CONFIG: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'applications',
    label: 'Applications',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'analyzer',
    label: 'CV Fit',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'resumes',
    label: 'Resumes',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('applications');
  const [applications, setApplications] = useLocalStorage<Application[]>(
    'jt-applications',
    seedApplications
  );
  const [resumes, setResumes] = useLocalStorage<Resume[]>('jt-resumes', seedResumes);

  // Prefill state: when user clicks "Use this CV" in analyzer
  const [prefillApplication, setPrefillApplication] = useState<
    Partial<ApplicationFormData> | undefined
  >();

  // Applications CRUD
  const addApplication = useCallback(
    (data: ApplicationFormData) => {
      const newApp: Application = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      setApplications((prev) => [newApp, ...prev]);
    },
    [setApplications]
  );

  const updateApplication = useCallback(
    (id: string, data: ApplicationFormData) => {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data } : a))
      );
    },
    [setApplications]
  );

  const deleteApplication = useCallback(
    (id: string) => {
      setApplications((prev) => prev.filter((a) => a.id !== id));
    },
    [setApplications]
  );

  // Resumes CRUD
  const addResume = useCallback(
    (data: ResumeFormData) => {
      const newResume: Resume = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      setResumes((prev) => [newResume, ...prev]);
    },
    [setResumes]
  );

  const updateResume = useCallback(
    (id: string, data: ResumeFormData) => {
      setResumes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data } : r))
      );
    },
    [setResumes]
  );

  const deleteResume = useCallback(
    (id: string) => {
      setResumes((prev) => prev.filter((r) => r.id !== id));
    },
    [setResumes]
  );

  // Analyzer: "Use this CV" → switch to applications tab with prefill
  const handleUseResume = useCallback(
    (resumeId: string) => {
      setPrefillApplication({ resumeId, status: 'prep' });
      setActiveTab('applications');
    },
    []
  );

  return (
    <div className="min-h-screen bg-bg text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-surface/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo / Title */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-bold text-white text-sm hidden sm:block">Job Tracker</span>
            </div>

            {/* Tabs */}
            <nav className="flex items-center gap-1">
              {TAB_CONFIG.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === id
                      ? 'bg-accent/20 text-accent'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  {icon}
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </nav>

            {/* Count badge */}
            <div className="text-xs text-gray-600 hidden sm:block">
              {applications.length} application{applications.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'applications' && (
          <ApplicationsTab
            applications={applications}
            resumes={resumes}
            onAdd={addApplication}
            onUpdate={updateApplication}
            onDelete={deleteApplication}
            prefillApplication={prefillApplication}
            onPrefillConsumed={() => setPrefillApplication(undefined)}
          />
        )}
        {activeTab === 'analyzer' && (
          <FitAnalyzerTab resumes={resumes} onUseResume={handleUseResume} />
        )}
        {activeTab === 'resumes' && (
          <ResumesTab
            resumes={resumes}
            applications={applications}
            onAdd={addResume}
            onUpdate={updateResume}
            onDelete={deleteResume}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16 py-6 text-center text-xs text-gray-700">
        Job Tracker — Marllon Rodrigues &mdash; Data stored locally in your browser
      </footer>
    </div>
  );
}

export default App;
