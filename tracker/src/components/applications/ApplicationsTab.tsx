import React, { useState, useMemo } from 'react';
import { Application, ApplicationStatus, Resume } from '../../types';
import { ApplicationCard } from './ApplicationCard';
import { ApplicationModal } from './ApplicationModal';
import { StatsBar } from './StatsBar';
import { Button } from '../ui/Button';

const STATUS_FILTERS: { value: ApplicationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'prep', label: 'Preparing' },
  { value: 'sent', label: 'Sent' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'ghost', label: 'Ghost' },
];

type ApplicationFormData = Omit<Application, 'id' | 'createdAt'>;

interface ApplicationsTabProps {
  applications: Application[];
  resumes: Resume[];
  onAdd: (data: ApplicationFormData) => void;
  onUpdate: (id: string, data: ApplicationFormData) => void;
  onDelete: (id: string) => void;
  prefillApplication?: Partial<ApplicationFormData>;
  onPrefillConsumed: () => void;
}

export function ApplicationsTab({
  applications,
  resumes,
  onAdd,
  onUpdate,
  onDelete,
  prefillApplication,
  onPrefillConsumed,
}: ApplicationsTabProps) {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | undefined>();

  // If there's prefill data, open modal
  React.useEffect(() => {
    if (prefillApplication) {
      setEditingApp(undefined);
      setModalOpen(true);
    }
  }, [prefillApplication]);

  const filtered = useMemo(() => {
    let list = applications;
    if (statusFilter !== 'all') {
      list = list.filter((a) => a.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.role.toLowerCase().includes(q) ||
          a.company.toLowerCase().includes(q) ||
          (a.keywords ?? '').toLowerCase().includes(q) ||
          (a.location ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [applications, statusFilter, search]);

  const resumeMap = useMemo(() => {
    const map = new Map<string, Resume>();
    for (const r of resumes) map.set(r.id, r);
    return map;
  }, [resumes]);

  const handleSave = (data: ApplicationFormData) => {
    if (editingApp) {
      onUpdate(editingApp.id, data);
    } else {
      onAdd(data);
    }
    setModalOpen(false);
    setEditingApp(undefined);
    onPrefillConsumed();
  };

  const handleDelete = () => {
    if (editingApp) {
      onDelete(editingApp.id);
      setModalOpen(false);
      setEditingApp(undefined);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingApp(undefined);
    onPrefillConsumed();
  };

  const openEdit = (app: Application) => {
    setEditingApp(app);
    setModalOpen(true);
  };

  const openNew = () => {
    setEditingApp(undefined);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsBar applications={applications} />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="w-full bg-surface border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors"
            placeholder="Search by role, company, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={openNew} variant="primary" size="md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Application
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === value
                ? 'bg-accent text-white'
                : 'bg-surface text-gray-400 hover:bg-surface-2 hover:text-gray-200 border border-white/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">No applications found</p>
          {applications.length === 0 && (
            <p className="text-xs mt-1">Click "Add Application" to get started</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              resume={app.resumeId ? resumeMap.get(app.resumeId) : undefined}
              onClick={() => openEdit(app)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <ApplicationModal
        open={modalOpen}
        onClose={handleClose}
        onSave={handleSave}
        onDelete={editingApp ? handleDelete : undefined}
        initial={editingApp}
        resumes={resumes}
        prefill={prefillApplication}
      />
    </div>
  );
}
