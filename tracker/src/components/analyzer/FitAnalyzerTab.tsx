import { useState, useMemo } from 'react';
import { Resume, FitResult } from '../../types';
import { analyzeJobDescription } from '../../utils/fitAnalyzer';
import { TypeBadge, LangBadge, KeywordPill } from '../ui/Badge';
import { Button } from '../ui/Button';

interface FitAnalyzerTabProps {
  resumes: Resume[];
  onUseResume: (resumeId: string) => void;
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 60
      ? 'bg-green-500'
      : score >= 35
      ? 'bg-yellow-500'
      : 'bg-red-500';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-bold text-white w-10 text-right">{score}%</span>
    </div>
  );
}

function FitCard({ result, onUse }: { result: FitResult; onUse: () => void }) {
  const { resume, score, matchedKeywords } = result;
  const displayKeywords = matchedKeywords.slice(0, 12);
  const remaining = matchedKeywords.length - displayKeywords.length;

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
        <div className="flex items-center gap-2 flex-shrink-0">
          <TypeBadge type={resume.type} />
          <LangBadge lang={resume.lang} />
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-4">
        <ScoreBar score={score} />
        <p className="text-xs text-gray-500 mt-1">
          {matchedKeywords.length} of {result.totalKeywords} keywords matched
        </p>
      </div>

      {/* Matched keywords */}
      {displayKeywords.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-600 uppercase tracking-wide font-medium mb-2">Matched Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {displayKeywords.map((kw) => (
              <KeywordPill key={kw} keyword={kw} highlighted />
            ))}
            {remaining > 0 && (
              <span className="text-xs text-gray-600 self-center">+{remaining} more</span>
            )}
          </div>
        </div>
      )}

      {matchedKeywords.length === 0 && (
        <p className="text-xs text-gray-600 italic mb-4">No keyword matches found</p>
      )}

      {/* CTA */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onUse}
        className="w-full justify-center"
      >
        Use this CV
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Button>
    </div>
  );
}

export function FitAnalyzerTab({ resumes, onUseResume }: FitAnalyzerTabProps) {
  const [jd, setJd] = useState('');

  const results: FitResult[] = useMemo(() => {
    if (!jd.trim() || resumes.length === 0) return [];
    return analyzeJobDescription(jd, resumes);
  }, [jd, resumes]);

  const hasResults = jd.trim().length > 30 && results.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white font-semibold">CV Fit Analyzer</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          Paste a job description to see which resume matches best
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: JD input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Job Description
            </label>
            {jd.trim() && (
              <button
                onClick={() => setJd('')}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            className="w-full h-96 lg:h-[calc(100vh-20rem)] bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-colors resize-none font-mono leading-relaxed"
            placeholder={`Paste the full job description here...\n\nThe analyzer will tokenize the text and match keywords against each of your resumes, ranking them by relevance score.`}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
          {jd.trim() && (
            <p className="text-xs text-gray-600">
              {jd.trim().split(/\s+/).length} words analyzed
            </p>
          )}
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Resume Rankings
            </label>
            {hasResults && (
              <span className="text-xs text-gray-600">{results.length} resumes ranked</span>
            )}
          </div>

          {!jd.trim() ? (
            <div className="text-center py-16 text-gray-600 border border-white/5 rounded-xl bg-surface">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm">Paste a job description to see rankings</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-16 text-gray-600 border border-white/5 rounded-xl bg-surface">
              <p className="text-sm">No resumes to analyze</p>
              <p className="text-xs mt-1">Add resumes in the Resumes tab first</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, i) => (
                <div key={result.resume.id} className="relative">
                  {i === 0 && hasResults && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        Best Match
                      </span>
                    </div>
                  )}
                  <FitCard
                    result={result}
                    onUse={() => onUseResume(result.resume.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
