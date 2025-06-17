import React, { useEffect, useState, useRef } from 'react';
import successImg from '../assets/img/success.png';
import failedImg from '../assets/img/failed.png';
import { base_url } from '../utils/apiFetch';
import Chatbot from '../components/Chatbot';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

type QuizOption = {
  id: number;
  text: string; // Option text
};

type QuizQuestion = {
  id: number;
  text: string; // Question text
  options: QuizOption[]; // Array of QuizOption
  correct_answer: string; // Correct answer text
};

type QuizState = {
  currentQuestion: number;
  selectedAnswer: string | null;
  userAnswers: (string | null)[];
  score: number;
  quizCompleted: boolean;
  passed: boolean;
  timeRemaining: number;
  reviewMode: boolean;
};

const TOTAL_TIME = 600;

const Quiz: React.FC = () => {
  const { id: topicId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const level = searchParams.get('level') || 'beginner';
  const { accessToken } = useAuth();

  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswer: null,
    userAnswers: [],
    score: 0,
    quizCompleted: false,
    passed: false,
    timeRemaining: TOTAL_TIME,
    reviewMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!topicId) {
      setError('No topic ID provided');
      setLoading(false);
      return;
    }

    fetch(`${base_url}/api/quiz/quiz/questions/?topic_id=${topicId}&level=${level}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load quiz');
        return res.json();
      })
      .then((data: any[]) => {
        if (!data.length) throw new Error('No questions found');

        // Normalize quiz data
        const normalizedData = data.map((q: any) => {
          const text = typeof q.text === 'string' ? q.text : 'Question text unavailable';
          const options = Array.isArray(q.options)
            ? q.options.map((option: any) => ({
                id: option.id,
                text: option.text,
              }))
            : [];
        
          return {
            id: q.id,
            text,
            options,
            correct_answer: q.correct_answer || '',
          };
        });

        console.log('Normalized quiz data:', normalizedData); // Debug log
        setQuizData(normalizedData);
        setState((prev) => ({ ...prev, userAnswers: Array(normalizedData.length).fill(null) }));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Quiz loading error:', err); // Debug log
        setError(err.message || 'Unable to load quiz. Please try again.');
        setLoading(false);
      });
  }, [topicId, level]);

  useEffect(() => {
    if (!state.quizCompleted && quizData.length > 0) {
      timerRef.current = window.setInterval(() => {
        setState((prev) => {
          if (prev.timeRemaining <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            submitQuiz();
            return { ...prev, timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.quizCompleted, quizData.length]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.currentQuestion]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const calculateTimerProgress = () => {
    const progress = (state.timeRemaining / TOTAL_TIME) * 283;
    return 283 - progress;
  };

  const handleAnswerClick = async (answer: string) => {
    const currentQuestion = quizData[state.currentQuestion];
    if (!currentQuestion) return;

    // Find the selected option's ID based on the answer text
    const selectedOption = currentQuestion.options.find(option => option.text === answer);
    const selectedOptionId = selectedOption ? selectedOption.id : null;

    if (!selectedOptionId) {
      console.error('Selected option ID not found.');
      return; // Ensure we have a valid ID
    }

    try {
      const response = await fetch(`${base_url}/api/quiz/quiz/submit-answer/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          question_id: currentQuestion.id, // Send the question ID
          selected_option_id: selectedOptionId, // Send the selected option ID
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        console.error('Error submitting answer:', result);
        setError(result.error || 'Failed to submit answer.');
        return;
      }

      // Process result to update the state (e.g., correct or incorrect answer)
      if (result.isCorrect) {
        // Update score or state accordingly
      } else {
        // Update score or state accordingly
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const goToNextQuestion = () => {
    const currentQ = quizData[state.currentQuestion];
    const isCorrect = state.selectedAnswer === currentQ.correct_answer;
    const updatedAnswers = [...state.userAnswers];
    updatedAnswers[state.currentQuestion] = state.selectedAnswer;

    setState((prev) => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
      selectedAnswer: updatedAnswers[prev.currentQuestion + 1] ?? null,
      userAnswers: updatedAnswers,
      score: isCorrect ? prev.score + 10 : prev.score,
    }));
  };

  const goToPreviousQuestion = () => {
    setState((prev) => ({
      ...prev,
      currentQuestion: prev.currentQuestion - 1,
      selectedAnswer: state.userAnswers[prev.currentQuestion - 1] ?? null,
    }));
  };

  const skipQuestion = () => {
    const updatedAnswers = [...state.userAnswers];
    updatedAnswers[state.currentQuestion] = null;
    setState((prev) => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
      selectedAnswer: updatedAnswers[prev.currentQuestion + 1] ?? null,
      userAnswers: updatedAnswers,
    }));
  };

  const submitQuiz = () => {
    const finalScore = state.userAnswers.reduce((acc, answer, index) => {
      return answer === quizData[index].correct_answer ? acc + 10 : acc;
    }, 0);

    const passed = finalScore >= 70;
    setState((prev) => ({
      ...prev,
      score: finalScore,
      passed,
      quizCompleted: true,
    }));

    fetch(`${base_url}/api/quiz/quiz/results/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score: finalScore,
        passed,
        answers: state.userAnswers,
      }),
    });
  };

  const toggleReviewMode = () => {
    setState((prev) => ({ ...prev, reviewMode: !prev.reviewMode }));
  };

  const calculateProgress = (): number => {
    if (quizData.length === 0) return 0;
    return ((state.currentQuestion + 1) / quizData.length) * 100;
  };

  const getOptionClass = (option: string) => {
    const correct = quizData[state.currentQuestion].correct_answer;
    const userAns = state.reviewMode
      ? state.userAnswers[state.currentQuestion]
      : state.selectedAnswer;
  
    if (state.reviewMode) {
      if (option === correct && userAns !== correct) return 'answer-correct-highlight';
      if (option === correct && userAns === correct) return 'answer-correct';
      if (option === userAns && userAns !== correct) return 'answer-wrong';
    } else if (option === userAns) {
      return option === correct
        ? 'answer-correct'
        : 'answer-wrong';
    }
  
    return 'border-gray-200';
  };

  if (loading) return <div className="text-center mt-12 text-lg">Loading Quiz...</div>;
  if (error) return <div className="text-center mt-12 text-red-600">{error}</div>;

  if (!quizData.length) return <div className="text-center mt-12 text-red-600">No quiz data available.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {state.quizCompleted && !state.reviewMode ? renderResultsView() : renderQuizView()}
    </div>
  );

  function renderQuizView() {
    const currentQuestion = quizData[state.currentQuestion];
    
    // Additional safety check
    if (!currentQuestion) {
      return <div className="text-center mt-12 text-red-600">Question not found.</div>;
    }

    const questionText = currentQuestion.text;

    return (
      <>
      <div className="fixed inset-0 overflow-hidden flex flex-col lg:flex-row">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-orange-400 bg-clip-text text-transparent">
              DIGICHAMP
            </h1>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Title and Progress */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Introduction to Coding</h2>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">
                  Question {state.currentQuestion + 1} of {quizData.length}
                </span>
                <span className="text-gray-600">{Math.round(calculateProgress())}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-950 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main */}
              <div className="lg:col-span-3">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8">
                  <div className="flex items-center mb-6">
                      <span className="bg-purple-950 text-white px-3 py-1 rounded-full text-sm font-medium">10 points</span>
                  </div>
                  <h3 id="questionText" className="text-xl font-medium text-gray-900">
                    {questionText}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {currentQuestion.options.length ? (
                    currentQuestion.options.map((option, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleAnswerClick(option.text)} // Pass the option text
                        className={`answer-option border-2 rounded-xl p-6 cursor-pointer transition-all ${getOptionClass(option.text)}`}
                        data-option={String.fromCharCode(65 + idx)} // A, B, C, D
                        style={{ pointerEvents: state.reviewMode ? "none" : "auto" }}
                      >
                        <div className="flex items-center">
                          <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-medium text-gray-700 mr-4">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-gray-900">{option.text}</span> {/* Use option.text */}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No options available for this question.</p>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={skipQuestion}
                    className="text-gray-600 hover:text-gray-800 flex items-center"
                    disabled={state.reviewMode}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3-3 3m-6-3h9" />
                    </svg>
                    Skip
                  </button>

                  <div className="flex space-x-4">
                    {state.currentQuestion > 0 && (
                      <button onClick={goToPreviousQuestion} className="px-6 py-3 bg-purple-200 text-purple-700 rounded-lg">
                        Previous
                      </button>
                    )}

                    {state.currentQuestion < quizData.length - 1 ? (
                      <button
                        onClick={goToNextQuestion}
                        disabled={!state.selectedAnswer}
                        className="px-6 py-3 bg-purple-950 text-white rounded-lg disabled:opacity-50"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={submitQuiz}
                        disabled={state.userAnswers.includes(null)}
                        className="px-6 py-3 bg-purple-950 text-white rounded-lg disabled:opacity-50"
                      >
                        Submit Quiz
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-6">Quiz Stats</h4>
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative w-24 h-24 mb-2">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#F59E0B" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="url(#progressGradient)"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          style={{
                            strokeDasharray: 283,
                            strokeDashoffset: calculateTimerProgress(),
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900">{formatTime(state.timeRemaining)}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">Time Remaining</span>
                  </div>

                  <div className="text-center bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Progress</div>
                    <div className="text-lg font-bold text-gray-900">
                      {state.currentQuestion + 1}/{quizData.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Chatbot + Floating button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={toggleReviewMode}
          className="w-14 h-14 bg-purple-950 rounded-full flex items-center justify-center text-white hover:bg-purple-700"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12...z" />
          </svg>
        </button>
      </div>

      <Chatbot quizCompleted={state.quizCompleted} score={state.score} totalQuestions={quizData.length} />
      </>
    );
  }

  function renderResultsView() {
    const percentage = Math.round((state.score / (quizData.length * 10)) * 100);
    return (
      <>
        <div className="container mx-auto px-6 py-8 min-h-screen flex flex-col justify-center">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-orange-400 bg-clip-text text-transparent">
                DIGICHAMP
              </h1>
            </div>

            <div className="mb-12">
              <div className="flex justify-center mb-8">
                <img src={state.passed ? successImg : failedImg} alt="Result" />
              </div>

              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {state.passed ? 'Congratulations You Passed!' : "Failed This Attempt. Let's Try Again!"}
              </h2>
              <button onClick={toggleReviewMode} className="text-purple-950 hover:text-purple-700 font-medium">
                Review Responses
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="text-gray-600 mb-2">Your Score</div>
                <div className={`text-3xl font-bold ${state.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {percentage}%
                </div>
                <div className="text-sm text-gray-500">Passing score 70%</div>
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="text-gray-600 mb-2">Your Points</div>
                <div className={`text-3xl font-bold ${state.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {state.score}
                </div>
                <div className="text-sm text-gray-500">Passing points 70</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Quiz;