'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Loader from '@/components/ui/Loader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import './Quizzes.css';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

interface Quiz {
  id: string;
  questions: QuizQuestion[];
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await api.get('/quizzes');
        setQuizzes(res.data);
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || !activeQuiz) return;
    
    const isCorrect = selectedOption === activeQuiz.questions[currentQIndex].answer;
    if (isCorrect) {
      setScore(s => s + 1);
    }
    setIsAnswered(true);
  };

  const handleNext = async () => {
    if (!activeQuiz) return;
    
    if (currentQIndex < activeQuiz.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      try {
        await api.post('/quizzes/submit', {
          quiz_id: activeQuiz.id,
          score: score + (selectedOption === activeQuiz.questions[currentQIndex].answer ? 1 : 0),
          total: activeQuiz.questions.length
        });
      } catch (err) {
        console.error("Failed to submit score", err);
      }
    }
  };

  if (loading) return <div className="center-page"><Loader text="Loading your quizzes..." /></div>;

  if (quizzes.length === 0) {
    return (
      <div className="center-page text-center animate-fade-in">
        <h2 className="text-heading-lg">No Quizzes</h2>
        <p className="text-body-lg text-secondary mt-12 mb-20">Generate a multiple choice quiz from the upload page.</p>
        <Button onClick={() => window.location.href = '/upload'}>Start Composing</Button>
      </div>
    );
  }

  // LIST VIEW
  if (!activeQuiz) {
    return (
      <div className="quizzes-page animate-fade-in">
        <header className="page-header text-center">
          <h1 className="text-heading-lg">Assessments</h1>
        </header>

        <div className="quiz-list">
          {quizzes.map((quiz, i) => (
            <Card key={quiz.id} variant="neutral" className="quiz-list-item">
              <div>
                <h3 className="text-heading-sm">Quiz Module {i + 1}</h3>
                <p className="text-secondary mt-8">{quiz.questions.length} questions</p>
              </div>
              <Button variant="ghost" onClick={() => startQuiz(quiz)}>Start</Button>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // RESULT VIEW
  if (quizFinished) {
    return (
      <div className="center-page text-center animate-fade-in">
        <h1 className="text-display mb-20">Complete.</h1>
        <div className="score-display">
          <span>{score}</span> / {activeQuiz.questions.length}
        </div>
        <div className="mt-40 flex gap-16 justify-center">
          <Button variant="ghost" onClick={() => startQuiz(activeQuiz)}>Retake</Button>
          <Button variant="filled" onClick={() => setActiveQuiz(null)}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  // ACTIVE QUIZ VIEW
  const currentQ = activeQuiz.questions[currentQIndex];

  return (
    <div className="active-quiz-page animate-fade-in">
      <div className="quiz-progress">
        <span>Question {currentQIndex + 1} of {activeQuiz.questions.length}</span>
      </div>

      <div className="question-container">
        <h2 className="text-heading-sm mb-40">{currentQ.question}</h2>
        
        <div className="options-grid">
          {currentQ.options.map((opt, idx) => {
            let className = "quiz-option";
            if (isAnswered) {
              if (opt === currentQ.answer) className += " correct";
              else if (opt === selectedOption) className += " incorrect";
              else className += " disabled";
            } else if (opt === selectedOption) {
              className += " selected";
            }
            
            return (
              <div 
                key={idx} 
                className={className}
                onClick={() => handleSelect(opt)}
              >
                <div className="option-text">{opt}</div>
              </div>
            );
          })}
        </div>

        {isAnswered && currentQ.explanation && (
          <Card variant="accent" className="explanation-box mt-32 animate-fade-in">
            <h4 className="text-body-lg mb-8" style={{fontWeight: 500}}>Explanation</h4>
            <p>{currentQ.explanation}</p>
          </Card>
        )}

        <div className="quiz-controls mt-40">
          {!isAnswered ? (
            <Button 
              variant="filled" 
              disabled={!selectedOption} 
              onClick={handleSubmit}
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              variant="filled" 
              onClick={handleNext}
            >
              {currentQIndex < activeQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
