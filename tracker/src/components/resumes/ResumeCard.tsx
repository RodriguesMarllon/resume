import { Resume, Application } from '../../types';
import { LangBadge, TypeBadge, KeywordPill } from '../ui/Badge';

interface ResumeCardProps {
  resume: Resume;
  usageCount: number;
  applications: Application[];
  onEdit: () => void;
}

export function ResumeCard({ resume, usageCount, onEdit }: ResumeCardProps) {
  const keywords = resume.keywords
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 8);

  return (
    <div className="bg-surface rounded-xl border border-white/5 p-5 hover:border-accent/20 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">{resume.name}</h3>
          {resume.title && (
            <p className="text-gray-400 text-xs mt-0.5 truncate">{resume.title}</p>
          )}
        </div>
        <button
          onClick={onEdit}
          className="text-gray-500 hover:text-accent transition-colors p-1 rounded hover:bg-accent/10 flex-shrink-0"
          aria-label={`Edit ${resume.name}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-3">
        <TypeBadge type={resume.type} />
        <LangBadge lang={resume.lang} />
        {usageCount > 0 && (
          <span className="text-xs text-gray-500">
            Used {usageCount}x
          </span>
        )}
      </div>

      {/* Keywords */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {keywords.map((kw) => (
            <KeywordPill key={kw} keyword={kw} />
          ))}
          {resume.keywords.split(',').filter(Boolean).length > 8 && (
            <span className="text-xs text-gray-600 self-center">
              +{resume.keywords.split(',').filter(Boolean).length - 8} more
            </span>
          )}
        </div>
      )}

      {/* Path */}
      {resume.path && (
        <div className="text-xs text-gray-600 truncate mt-1 flex items-center gap-1">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {resume.path}
        </div>
      )}
    </div>
  );
}
