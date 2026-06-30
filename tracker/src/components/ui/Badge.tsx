import { ApplicationStatus, ResumeLang, ResumeType } from '../../types';

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  prep: { label: 'Preparing', className: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' },
  sent: { label: 'Sent', className: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
  interview: { label: 'Interview', className: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
  offer: { label: 'Offer', className: 'bg-green-500/20 text-green-300 border border-green-500/30' },
  rejected: { label: 'Rejected', className: 'bg-red-500/20 text-red-300 border border-red-500/30' },
  ghost: { label: 'Ghost', className: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' },
};

const LANG_CONFIG: Record<ResumeLang, { label: string; className: string }> = {
  en: { label: 'EN', className: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
  'pt-br': { label: 'PT-BR', className: 'bg-green-500/20 text-green-300 border border-green-500/30' },
  other: { label: 'Other', className: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' },
};

const TYPE_CONFIG: Record<ResumeType, { label: string; className: string }> = {
  automation: { label: 'Automation', className: 'bg-orange-500/20 text-orange-300 border border-orange-500/30' },
  it: { label: 'IT', className: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' },
  other: { label: 'Other', className: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className} ${className}`}>
      {config.label}
    </span>
  );
}

interface LangBadgeProps {
  lang: ResumeLang;
  className?: string;
}

export function LangBadge({ lang, className = '' }: LangBadgeProps) {
  const config = LANG_CONFIG[lang];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className} ${className}`}>
      {config.label}
    </span>
  );
}

interface TypeBadgeProps {
  type: ResumeType;
  className?: string;
}

export function TypeBadge({ type, className = '' }: TypeBadgeProps) {
  const config = TYPE_CONFIG[type];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className} ${className}`}>
      {config.label}
    </span>
  );
}

interface KeywordPillProps {
  keyword: string;
  highlighted?: boolean;
}

export function KeywordPill({ keyword, highlighted = false }: KeywordPillProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        highlighted
          ? 'bg-accent/30 text-accent border border-accent/40'
          : 'bg-surface-2 text-gray-400 border border-white/5'
      }`}
    >
      {keyword}
    </span>
  );
}

export { STATUS_CONFIG };
