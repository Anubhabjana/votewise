import Chatbot from '../components/features/Chatbot';
import { useTranslation } from '../hooks/useTranslation';

export default function AskView() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in transition-opacity h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-navy)] mb-2">{t('VoteWise Assistant')}</h1>
        <p className="text-gray-600">{t('Ask me anything about the election process, eligibility, or procedures!')}</p>
      </div>
      
      <div className="flex-1 min-h-0 mb-6">
        <Chatbot />
      </div>
    </div>
  );
}
