import { useState, useMemo, useEffect } from 'react';
import { Resume, Application } from '../../types';
import { ResumeCard } from './ResumeCard';
import { ResumeModal } from './ResumeModal';
import { Button } from '../ui/Button';

type ResumeFormData = Omit<Resume, 'id' | 'createdAt'>;

interface ResumesTabProps {
  resumes: Resume[];
  applications: Application[];
  onAdd: (data: ResumeFormData) => void;
  onUpdate: (id: string, data: ResumeFormData) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  duplicateSource?: Resume;
  onDuplicateHandled?: () => void;
}

export function ResumesTab({
  resumes,
  applications,
  onAdd,
  onUpdate,
  onDelete,
  onDuplicate,
  duplicateSource,
  onDuplicateHandled,
}: ResumesTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResume, setEditingResume] = useState<Resume | undefined>();

  const usageCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const app of applications) {
      if (app.resumeId) {
        counts.set(app.resumeId, (counts.get(app.resumeId) ?? 0) + 1);
      }
    }
    return counts;
  }, [applications]);

  const parentNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of resumes) {
      map.set(r.id, r.name);
    }
    return map;
  }, [resumes]);

  const sorted = useMemo(() => {
    return [...resumes].sort((a, b) => {
      const aBase = a.basedOn ?? a.id;
      const bBase = b.basedOn ?? b.id;
      if (aBase !== bBase) return aBase.localeCompare(bBase);
      if (!a.basedOn && b.basedOn) return -1;
      if (a.basedOn && !b.basedOn) return 1;
      return a.createdAt.localeCompare(b.createdAt);
    });
  }, [resumes]);

  useEffect(() => {
    if (duplicateSource) {
      setEditingResume(undefined);
      setModalOpen(true);
    }
  }, [duplicateSource]);

  const handleSave = (data: ResumeFormData) => {
    if (editingResume) {
      onUpdate(editingResume.id, data);
    } else {
      onAdd(data);
    }
    setModalOpen(false);
    setEditingResume(undefined);
  };

  const handleDelete = () => {
    if (editingResume) {
      onDelete(editingResume.id);
      setModalOpen(false);
      setEditingResume(undefined);
    }
  };

  const openEdit = (resume: Resume) => {
    setEditingResume(resume);
    setModalOpen(true);
  };

  const openNew = () => {
    setEditingResume(undefined);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingResume(undefined);
    if (onDuplicateHandled) onDuplicateHandled();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold">Resumes</h2>
          <p className="text-gray-500 text-sm mt-0.5">{resumes.length} version{resumes.length !== 1 ? 's' : ''} saved</p>
        </div>
        <Button onClick={openNew} variant="primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Resume
        </Button>
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">No resumes yet</p>
          <p className="text-xs mt-1">Click "Add Resume" to add your first CV version</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              usageCount={usageCounts.get(resume.id) ?? 0}
              applications={applications}
              onEdit={() => openEdit(resume)}
              onDuplicate={() => onDuplicate(resume.id)}
              parentName={parentNames.get(resume.basedOn ?? '')}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <ResumeModal
        open={modalOpen}
        onClose={handleClose}
        onSave={handleSave}
        onDelete={editingResume ? handleDelete : undefined}
        initial={editingResume}
        duplicateSource={editingResume ? undefined : duplicateSource}
      />
    </div>
  );
}
