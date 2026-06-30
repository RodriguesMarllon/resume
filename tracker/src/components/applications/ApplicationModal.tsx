import React, { useState, useEffect } from 'react';
import { Application, ApplicationStatus, Resume } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'prep', label: 'Preparing' },
  { value: 'sent', label: 'Sent' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'ghost', label: 'Ghost' },
];

type ApplicationFormData = Omit<Application, 'id' | 'createdAt'>;

const EMPTY_FORM: ApplicationFormData = {
  role: '',
  company: '',
  location: '',
  status: 'prep',
  date: new Date().toISOString().slice(0, 10),
  salary: '',
  resumeId: '',
  keywords: '',
  strengths: '',
  notes: '',
  url: '',
};

interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ApplicationFormData) => void;
  onDelete?: () => void;
  initial?: Application;
  resumes: Resume[];
  prefill?: Partial<ApplicationFormData>;
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

export function ApplicationModal({
  open,
  onClose,
  onSave,
  onDelete,
  initial,
  resumes,
  prefill,
}: ApplicationModalProps) {
  const [form, setForm] = useState<ApplicationFormData>(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      if (initial) {
        const { id: _id, createdAt: _createdAt, ...rest } = initial;
        setForm(rest);
      } else {
        setForm({ ...EMPTY_FORM, ...prefill });
      }
      setConfirmDelete(false);
    }
  }, [open, initial, prefill]);

  const set = (field: keyof ApplicationFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role.trim() || !form.company.trim()) return;
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
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Application' : 'New Application'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Role" required>
            <input
              className={INPUT_CLS}
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
              placeholder="e.g. Automation Engineer"
              required
            />
          </Field>
          <Field label="Company" required>
            <input
              className={INPUT_CLS}
              value={form.company}
              onChange={(e) => set('company', e.target.value)}
              placeholder="e.g. Siemens"
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Location">
            <input
              className={INPUT_CLS}
              value={form.location ?? ''}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Singapore"
            />
          </Field>
          <Field label="Status">
            <select
              className={INPUT_CLS}
              value={form.status}
              onChange={(e) => set('status', e.target.value as ApplicationStatus)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date">
            <input
              type="date"
              className={INPUT_CLS}
              value={form.date ?? ''}
              onChange={(e) => set('date', e.target.value)}
            />
          </Field>
          <Field label="Salary / Range">
            <input
              className={INPUT_CLS}
              value={form.salary ?? ''}
              onChange={(e) => set('salary', e.target.value)}
              placeholder="e.g. SGD $4,000–$5,000/mo"
            />
          </Field>
        </div>

        <Field label="Resume Used">
          <select
            className={INPUT_CLS}
            value={form.resumeId ?? ''}
            onChange={(e) => set('resumeId', e.target.value)}
          >
            <option value="">— None —</option>
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Job URL">
          <input
            className={INPUT_CLS}
            value={form.url ?? ''}
            onChange={(e) => set('url', e.target.value)}
            placeholder="https://..."
          />
        </Field>

        <Field label="Keywords" hint="Comma-separated keywords from the JD">
          <textarea
            className={`${INPUT_CLS} resize-none`}
            rows={2}
            value={form.keywords ?? ''}
            onChange={(e) => set('keywords', e.target.value)}
            placeholder="React, Python, PostgreSQL, Docker..."
          />
        </Field>

        <Field label="Strengths / Fit">
          <textarea
            className={`${INPUT_CLS} resize-none`}
            rows={2}
            value={form.strengths ?? ''}
            onChange={(e) => set('strengths', e.target.value)}
            placeholder="Why you're a good fit for this role..."
          />
        </Field>

        <Field label="Notes">
          <textarea
            className={`${INPUT_CLS} resize-none`}
            rows={3}
            value={form.notes ?? ''}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Referral, recruiter name, follow-up date..."
          />
        </Field>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          {onDelete ? (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleDelete}
            >
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
              {initial ? 'Save Changes' : 'Add Application'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
