import { useState } from 'react';
import { generateReadinessReport } from '../../services/gemini';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import { Award, Loader2, Target, CheckCircle, AlertCircle, ExternalLink, RefreshCw, Sparkles, TrendingUp, BookOpen } from 'lucide-react';

export default function VoterReadinessReport({ quizScore, quizTotal }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [report, setReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const generateReport = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const data = await generateReadinessReport(
        quizScore,
        quizTotal,
        { eligible: true, age: '20' },
        language
      );
      setReport(data);
    } catch (err) {
      setError(err.message || t('Could not generate readiness report.'));
    } finally {
      setIsGenerating(false);
    }
  };

  if (!report && !isGenerating) {
    return (
      <button
        onClick={generateReport}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-navy)] to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
      >
        <Sparkles className="w-5 h-5" />
        {t('Generate AI Voter Readiness Report')}
      </button>
    );
  }

  if (isGenerating) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200 text-center animate-fade-in">
        <Loader2 className="w-10 h-10 text-[var(--color-navy)] animate-spin mx-auto mb-4" />
        <p className="font-bold text-[var(--color-navy)]">{t('Generating your personalized report...')}</p>
        <p className="text-sm text-gray-500 mt-1">{t('Powered by Gemini AI Structured Output')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl p-6 border border-red-200 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-700 font-medium">{error}</p>
        <button onClick={generateReport} className="mt-3 text-sm text-red-600 underline">{t('Try again')}</button>
      </div>
    );
  }

  const scoreColor = report.readiness_score >= 80 ? 'green' : report.readiness_score >= 50 ? 'amber' : 'red';
  const scoreColorMap = {
    green: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', ring: 'ring-green-200' },
    amber: { bg: 'bg-amber-100', border: 'border-amber-500', text: 'text-amber-700', ring: 'ring-amber-200' },
    red: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', ring: 'ring-red-200' }
  };
  const colors = scoreColorMap[scoreColor];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in mt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--color-navy)] to-blue-800 px-6 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Award className="w-7 h-7" />
          <div>
            <h3 className="font-bold text-lg">{t('Voter Readiness Report')}</h3>
            <p className="text-blue-200 text-xs">{t('AI-Generated • Personalized for You')}</p>
          </div>
        </div>
        <button onClick={generateReport} className="p-2 hover:bg-white/20 rounded-full transition-colors" aria-label="Refresh">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Score + Badge */}
        <div className="flex items-center gap-6">
          <div className={`w-24 h-24 rounded-full ${colors.bg} ${colors.border} border-4 flex flex-col items-center justify-center ring-4 ${colors.ring}`}>
            <span className={`text-2xl font-black ${colors.text}`}>{report.readiness_score}%</span>
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-gray-900">{report.badge}</p>
            <p className={`font-semibold ${colors.text}`}>{report.readiness_level}</p>
            {report.motivational_message && (
              <p className="text-sm text-gray-600 mt-1 italic">"{report.motivational_message}"</p>
            )}
          </div>
        </div>

        {/* Strengths */}
        {report.strengths && report.strengths.length > 0 && (
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <h4 className="font-bold text-green-800 flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5" />
              {t('Your Strengths')}
            </h4>
            <ul className="space-y-2">
              {report.strengths.map((s, i) => (
                <li key={i} className="text-sm text-green-900 flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Knowledge Gaps */}
        {report.knowledge_gaps && report.knowledge_gaps.length > 0 && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5" />
              {t('Areas to Improve')}
            </h4>
            <ul className="space-y-2">
              {report.knowledge_gaps.map((g, i) => (
                <li key={i} className="text-sm text-amber-900 flex items-start gap-2">
                  <span className="text-amber-500 font-bold mt-0.5">→</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Items */}
        {report.action_items && report.action_items.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-bold text-[var(--color-navy)] flex items-center gap-2 mb-3">
              <Target className="w-5 h-5" />
              {t('Next Steps')}
            </h4>
            <div className="space-y-3">
              {report.action_items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
                  <div className={`shrink-0 px-2 py-0.5 rounded text-xs font-bold uppercase ${
                    item.priority === 'high' ? 'bg-red-100 text-red-700' :
                    item.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.priority}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.action}</p>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                        <ExternalLink className="w-3 h-3" /> {item.url}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
