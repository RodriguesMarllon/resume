import { Application, ApplicationStatus } from '../../types';

interface StatItem {
  label: string;
  status: ApplicationStatus | 'total';
  color: string;
}

const STATS: StatItem[] = [
  { label: 'Total', status: 'total', color: 'text-white' },
  { label: 'Sent', status: 'sent', color: 'text-blue-400' },
  { label: 'Interview', status: 'interview', color: 'text-purple-400' },
  { label: 'Offer', status: 'offer', color: 'text-green-400' },
  { label: 'Rejected', status: 'rejected', color: 'text-red-400' },
];

interface StatsBarProps {
  applications: Application[];
}

export function StatsBar({ applications }: StatsBarProps) {
  const counts: Record<string, number> = { total: applications.length };
  for (const app of applications) {
    counts[app.status] = (counts[app.status] ?? 0) + 1;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {STATS.map(({ label, status, color }) => (
        <div
          key={status}
          className="bg-surface rounded-xl p-4 border border-white/5 text-center"
        >
          <div className={`text-2xl font-bold ${color}`}>
            {counts[status] ?? 0}
          </div>
          <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
