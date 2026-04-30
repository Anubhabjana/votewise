import { useState, useEffect } from 'react';
import { useDemo } from '../../contexts/DemoContext';
import { CheckCircle, XCircle, RefreshCw, ChevronRight, Award, Flame, Share2 } from 'lucide-react';
import { saveQuizScore } from '../../services/firebase';
import { useTranslation } from '../../hooks/useTranslation';
import VoterReadinessReport from './VoterReadinessReport';

import { QUIZ_QUESTIONS } from '../../constants/componentData';

export default function Quiz() {
  const { isDemoMode } = useDemo();
  const { t } = useTranslation();
  
  const [started, setStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [copied, setCopied] = useState(false);

  // Demo mode pre-fill
  useEffect(() => {
    if (isDemoMode && started && !showFeedback && !quizFinished) {
      // Auto-select correct answer for demo purposes
      setSelectedOption(QUIZ_QUESTIONS[currentQIndex].correctIndex);
    }
  }, [isDemoMode, started, currentQIndex, showFeedback, quizFinished]);

  useEffect(() => {
    if (quizFinished && !isDemoMode) {
      saveQuizScore('anonymous_user', score, QUIZ_QUESTIONS.length)
        .catch(err => console.error("Could not save score:", err));
    }
  }, [quizFinished, isDemoMode, score]);

  const handleStart = () => {
    setStarted(true);
    setCurrentQIndex(0);
    setScore(0);
    setQuizFinished(false);
    setShowFeedback(false);
    setSelectedOption(null);
    setStreak(0);
    setMaxStreak(0);
    setCopied(false);
  };

  const handleOptionSelect = (index) => {
    if (!showFeedback) {
      setSelectedOption(index);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    
    if (selectedOption === QUIZ_QUESTIONS[currentQIndex].correctIndex) {
      setScore(score + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setStreak(0);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (!started) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100text-center flex flex-col items-center justify-center min-h-[400px]">
        <Award className="w-16 h-16 text-[var(--color-navy)] mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('Test Your Election Knowledge')}</h2>
        <p className="text-gray-600 mb-8 max-w-md text-center">
          {t('Take our 10-question quiz to see how well you understand voting rights, processes, and rules.')}
        </p>
        <button 
          onClick={handleStart}
          className="px-8 py-3 bg-[var(--color-navy)] hover:bg-[var(--color-navy-dark)] text-white font-bold rounded-lg shadow-md transition-colors"
        >
          {isDemoMode ? t('Start Demo Quiz') : t('Start Quiz')}
        </button>
      </div>
    );
  }

  if (quizFinished) {
    const percentage = (score / QUIZ_QUESTIONS.length) * 100;
    
    const handleShare = () => {
      const shareText = t(`I just scored SCORE/TOTAL on the VoteWise Election Quiz! My max streak was STREAK 🔥. Can you beat my score?`)
        .replace('SCORE', score)
        .replace('TOTAL', QUIZ_QUESTIONS.length)
        .replace('STREAK', maxStreak);
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <div className="flex gap-4 mb-6">
          <div className="w-32 h-32 rounded-full border-8 border-[var(--color-saffron)] flex flex-col items-center justify-center">
             <span className="text-3xl font-bold text-[var(--color-navy)]">{score}/{QUIZ_QUESTIONS.length}</span>
             <span className="text-xs text-gray-500 font-bold uppercase mt-1">{t('Score')}</span>
          </div>
          {maxStreak > 1 && (
            <div className="w-32 h-32 rounded-full border-8 border-orange-500 flex flex-col items-center justify-center bg-orange-50">
               <Flame className="w-8 h-8 text-orange-500 mb-1" />
               <span className="text-2xl font-bold text-orange-700">{maxStreak}</span>
               <span className="text-xs text-orange-600 font-bold uppercase">{t('Streak')}</span>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {percentage >= 80 ? t("Excellent Citizen!") : percentage >= 50 ? t("Good Job!") : t("Keep Learning!")}
        </h2>
        <p className="text-gray-600 mb-8 max-w-md text-center">
          {t("You've completed the VoteWise Quiz. The electoral process relies on informed citizens like you.")}
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg text-left w-full max-w-md mb-8 border border-blue-100">
          <h3 className="font-bold text-[var(--color-navy)] mb-2">{t('What you learned')}:</h3>
          <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>{t('The Election Commission administers elections.')}</li>
            <li>{t('Voting age is 18 years old.')}</li>
            <li>{t('NOTA lets you express dissatisfaction.')}</li>
            <li>{t('EVMs and VVPATs ensure voting accuracy and transparency.')}</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleShare}
            className="flex items-center justify-center px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold rounded-lg transition-colors border border-blue-300"
          >
            {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />} 
            {copied ? t('Copied!') : t('Share Score')}
          </button>
          <button 
            onClick={handleStart}
            className="flex items-center justify-center px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors border border-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> {t('Retake Quiz')}
          </button>
        </div>

        {/* AI-Powered Voter Readiness Report */}
        <div className="w-full max-w-md mt-4">
          <VoterReadinessReport quizScore={score} quizTotal={QUIZ_QUESTIONS.length} />
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQIndex];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in flex flex-col min-h-[500px]">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2">
        <div 
          className="bg-[var(--color-saffron)] h-2 transition-all duration-300" 
          style={{ width: `${((currentQIndex) / QUIZ_QUESTIONS.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('Question')} {currentQIndex + 1} {t('of')} {QUIZ_QUESTIONS.length}</span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-2">{t(question.question)}</h2>
          </div>
          {streak > 1 && (
            <div className="bg-orange-100 border border-orange-200 text-orange-700 px-3 py-1 rounded-full flex items-center font-bold text-sm animate-pulse">
              <Flame className="w-4 h-4 mr-1" />
              {streak} {t('Streak!')}
            </div>
          )}
        </div>

        <div className="space-y-3 flex-1">
          {question.options.map((opt, idx) => {
            let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
            
            if (!showFeedback) {
              buttonClass += selectedOption === idx 
                ? "border-[var(--color-navy)] bg-blue-50" 
                : "border-gray-200 hover:border-gray-300 bg-white";
            } else {
              if (idx === question.correctIndex) {
                buttonClass += "border-green-500 bg-green-50 text-green-900 font-medium";
              } else if (idx === selectedOption) {
                 buttonClass += "border-red-500 bg-red-50 text-red-900";
              } else {
                buttonClass += "border-gray-200 bg-gray-50 opacity-50";
              }
            }

            return (
              <button 
                key={idx} 
                onClick={() => handleOptionSelect(idx)}
                disabled={showFeedback}
                className={buttonClass}
              >
                <div className="flex justify-between items-center">
                  <span>{t(opt)}</span>
                  {showFeedback && idx === question.correctIndex && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {showFeedback && idx === selectedOption && idx !== question.correctIndex && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>
        
         {/* Feedback Section */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 animate-fade-in ${
            selectedOption === question.correctIndex ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
          }`}>
             <div className="mt-0.5 shrink-0">
              {selectedOption === question.correctIndex ? <CheckCircle className="w-5 h-5 text-green-700" /> : <XCircle className="w-5 h-5 text-red-700" />}
             </div>
             <div>
                <p className="font-bold text-gray-900 mb-1">
                  {selectedOption === question.correctIndex ? t('Correct!') : t('Incorrect.')}
                </p>
                <p className="text-sm text-gray-800">{t(question.explanation)}</p>
             </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {!showFeedback ? (
            <button 
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="px-6 py-2 bg-[var(--color-navy)] text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('Check Answer')}
            </button>
          ) : (
            <button 
              onClick={handleNextQuestion}
              className="px-6 py-2 bg-[var(--color-saffron)] text-white font-semibold rounded-md transition-colors flex items-center"
            >
              {currentQIndex < QUIZ_QUESTIONS.length - 1 ? t('Next Question') : t('View Results')} <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
