import React, { useState, useEffect } from 'react';
import { Resume, ResumeType, ResumeLang } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

type ResumeFormData = Omit<Resume, 'id' | 'createdAt'>;

const EMPTY_FORM: ResumeFormData = {
  name: '',
  title: '',
  type: 'other',
  lang: 'en',
  path: '',
  keywords: '',
  notes: '',
};

const TYPE_OPTIONS: { value: ResumeType; label: string }[] = [
  { value: 'automation', label: 'Automation' },
  { value: 'it', label: 'IT / Software' },
  { value: 'other', label: 'Other' },
];

const LANG_OPTIONS: { value: ResumeLang; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'pt-br', label: 'Portuguese (PT-BR)' },
  { value: 'other', label: 'Other' },
];

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ResumeFormData) => void;
  onDelete?: () => void;
  initial?: Resume;
}

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

function Field({ label, required, children, hint }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-600 mt-1">{hint}</p>}
    </div>
  );
}

const INPUT_CLS =
  'w-full bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors';

export function ResumeModal({
  open,
  onClose,
  onSave,
  onDelete,
  initial,
}: ResumeModalProps) {
  const [form, setForm] = useState<ResumeFormData>(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      if (initial) {
        const { id: _id, createdAt: _createdAt, ...rest } = initial;
        setForm(rest);
      } else {
        setForm(EMPTY_FORM);
      }
      setConfirmDelete(false);
    }
  }, [open, initial]);

  const set = <K extends keyof ResumeFormData>(field: K, value: ResumeFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  };

  const handleDelete = () => {
    if (confirmDelete && onDelete) {
      onDelete();
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Resume' : 'Add Resume'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name" required>
          <input
            className={INPUT_CLS}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Automation EN"
            required
          />
        </Field>

        <Field label="Title / Headline">
          <input
            className={INPUT_CLS}
            value={form.title ?? ''}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Automation & Control Systems Engineer"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Type">
            <select
              className={INPUT_CLS}
              value={form.type}
              onChange={(e) => set('type', e.target.value as ResumeType)}
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Language">
            <select
              className={INPUT_CLS}
              value={form.lang}
              onChange={(e) => set('lang', e.target.value as ResumeLang)}
            >
              {LANG_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="File Path" hint="Relative path to the PDF in the repo">
          <input
            className={INPUT_CLS}
            value={form.path ?? ''}
            onChange={(e) => set('path', e.target.value)}
            placeholder="versions/2026-06-30/automation_en.pdf"
          />
        </Field>

        <Field label="Keywords" required hint="Comma-separated list of skills and technologies">
          <textarea
            className={`${INPUT_CLS} resize-none`}
            rows={4}
            value={form.keywords}
            onChange={(e) => set('keywords', e.target.value)}
            placeholder="TypeScript, React, Node.js, Docker, PostgreSQL..."
            required
          />
        </Field>

        <Field label="Notes">
          <textarea
            className={`${INPUT_CLS} resize-none`}
            rows={2}
            value={form.notes ?? ''}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="When to use this resume, special notes..."
          />
        </Field>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          {onDelete ? (
            <Button type="button" variant="danger" size="sm" onClick={handleDelete}>
              {confirmDelete ? 'Confirm Delete' : 'Delete'}
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {initial ? 'Save Changes' : 'Add Resume'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
