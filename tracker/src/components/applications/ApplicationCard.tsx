import { Application, Resume } from '../../types';
import { StatusBadge } from '../ui/Badge';

interface ApplicationCardProps {
  application: Application;
  resume?: Resume;
  onClick: () => void;
}

export function ApplicationCard({ application, resume, onClick }: ApplicationCardProps) {
  const { role, company, location, status, date, salary } = application;

  const formattedDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface rounded-xl border border-white/5 p-5 hover:border-accent/40 hover:bg-surface/80 transition-all duration-200 cursor-pointer group"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-accent transition-colors truncate">
            {role}
          </h3>
          <p className="text-gray-400 text-sm mt-0.5 truncate">{company}</p>
        </div>
        <StatusBadge status={status} className="flex-shrink-0 mt-0.5" />
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-xs text-gray-500">
        {location && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{location}</span>
          </div>
        )}
        {formattedDate && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
        )}
        {salary && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-400/80">{salary}</span>
          </div>
        )}
        {resume && (
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-accent/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-accent/80 truncate">{resume.name}</span>
          </div>
        )}
      </div>
    </button>
  );
}
