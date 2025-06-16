import React, { useState, useEffect, useRef } from 'react';
import successImg from '../assets/img/success.png';
import failedImg from '../assets/img/failed.png';
import { useParams } from 'react-router-dom';

type Question = {
  question: string;
  options: Record<string, string>;
  correct: string;
};

type QuizState = {
  currentQuestion: number;
  userAnswers: (string | null)[];
  selectedAnswer: string | null;
  timeRemaining: number;
  score: number;
  quizCompleted: boolean;
  passed: boolean;
};

const Quiz: React.FC = () => {
  const { quizId } = useParams();
  // Quiz data
  const quizData: Question[] = [
    {
      question: "What is the main purpose of a variable in coding?",
      options: {
        A: "To print text on the screen",
        B: "To store and reuse data in a program",
        C: "To add colors to the code",
        D: "To create new folders on the computer"
      },
      correct: "B"
    },
    {
      question: "Which one of these is a valid variable name?",
      options: {
        A: "3total",
        B: "total_score",
        C: "if",
        D: "printf()"
      },
      correct: "B"
    }
  ];

  // State management
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    userAnswers: Array(quizData.length).fill(null),
    selectedAnswer: null,
    timeRemaining: 900, // 15 minutes in seconds
    score: 0,
    quizCompleted: false,
    passed: false
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize quiz
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer functions
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          return { ...prev, timeRemaining: 0, quizCompleted: true };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateTimerProgress = (): number => {
    const totalTime = 900;
    return ((totalTime - state.timeRemaining) / totalTime) * 283;
  };

  // Question navigation
  const handleAnswerSelect = (option: string) => {
    if (state.selectedAnswer || state.quizCompleted) return;

    const isCorrect = option === quizData[state.currentQuestion].correct;
    const newScore = isCorrect ? state.score + 10 : state.score;

    const updatedAnswers = [...state.userAnswers];
    updatedAnswers[state.currentQuestion] = option;

    setState({
      ...state,
      selectedAnswer: option,
      userAnswers: updatedAnswers,
      score: newScore
    });
  };

  const goToNextQuestion = () => {
    if (state.currentQuestion < quizData.length - 1) {
      setState({
        ...state,
        currentQuestion: state.currentQuestion + 1,
        selectedAnswer: null
      });
    }
  };

  const goToPreviousQuestion = () => {
    if (state.currentQuestion > 0) {
      setState({
        ...state,
        currentQuestion: state.currentQuestion - 1,
        selectedAnswer: state.userAnswers[state.currentQuestion - 1]
      });
    }
  };

  const submitQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const percentage = Math.round((state.score / (quizData.length * 10)) * 100);
    setState({
      ...state,
      quizCompleted: true,
      passed: percentage >= 70
    });
  };

  const skipQuestion = () => {
    if (state.currentQuestion < quizData.length - 1) {
      goToNextQuestion();
    } else {
      submitQuiz();
    }
  };

  // Progress calculations
  const calculateProgress = (): number => {
    return ((state.currentQuestion + 1) / quizData.length) * 100;
  };

  // Answer option styling
  const getOptionClass = (option: string): string => {
    const baseClass = "answer-option bg-white rounded-xl p-6 cursor-pointer transition-all duration-200";
    const currentQuestion = quizData[state.currentQuestion];
    
    if (!state.selectedAnswer) return `${baseClass} border-2 border-gray-300`;
    
    if (option === currentQuestion.correct) {
      return `${baseClass} border-2 bg-gradient-to-br from-green-100 to-green-200 border-green-500`;
    }
    
    if (option === state.selectedAnswer && option !== currentQuestion.correct) {
      return `${baseClass} border-2 bg-gradient-to-br from-red-100 to-red-200 border-red-500`;
    }
    
    return `${baseClass} border-2 border-gray-300`;
  };

  // Render quiz view
  const renderQuizView = () => (
    <div className="fixed inset-0 overflow-hidden flex flex-col lg:flex-row">
            <div className="container mx-auto px-12 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-orange-400 bg-clip-text text-transparent">
          DIGICHAMP
        </h1>
      </div>

      <div className="max-w-9xl mx-auto">
        {/* Title and Progress */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Introduction to Coding</h2>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">
              Question {state.currentQuestion + 1} of {quizData.length}
            </span>
            <span className="text-gray-600">
              {Math.round(calculateProgress())}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-950 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Quiz Content */}
          <div className="lg:col-span-3">
            {/* Question Card */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8">
              <div className="flex items-center mb-6">
                <span className="bg-purple-950 text-white px-3 py-1 rounded-full text-sm font-medium">
                  10 points
                </span>
              </div>
              <h3 className="text-xl font-medium text-gray-900">
                {quizData[state.currentQuestion].question}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {Object.entries(quizData[state.currentQuestion].options).map(([key, value]) => (
                <div 
                  key={key}
                  className={getOptionClass(key)}
                  onClick={() => handleAnswerSelect(key)}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-medium text-gray-700 mr-4">
                      {key}
                    </span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button 
                onClick={skipQuestion}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3-3 3m-6-3h9"></path>
                </svg>
                Skip
              </button>
              <div className="flex space-x-4">
                {state.currentQuestion > 0 && (
                    <button 
                    onClick={goToPreviousQuestion}
                    className="px-6 py-3 bg-purple-200 text-purple-700 font-medium rounded-lg hover:bg-purple-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                    Previous Question
                    </button>
                )}
                
                {state.currentQuestion < quizData.length - 1 ? (
                    <button 
                    onClick={goToNextQuestion}
                    disabled={!state.selectedAnswer}
                    className="px-6 py-3 bg-purple-950 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                    Next Question
                    </button>
                ) : (
                    <button 
                    onClick={submitQuiz}
                    disabled={!state.selectedAnswer}
                    className="px-6 py-3 bg-purple-950 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
              
              {/* Timer */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 mb-2">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
  {/* Background Circle */}
  <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="4" fill="none" />

  {/* Gradient Definition */}
  <defs>
    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#8B5CF6" />
      <stop offset="100%" stopColor="#F59E0B" />
    </linearGradient>
  </defs>

  {/* Foreground Circle with Gradient Stroke */}
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
                    <span className="text-lg font-bold text-gray-900">
                      {formatTime(state.timeRemaining)}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-600">Time Remaining</span>
              </div>

              {/* Progress */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Progress</div>
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
  );

  // Render results view
  const renderResultsView = () => {
    const percentage = Math.round((state.score / (quizData.length * 10)) * 100);
    
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto my-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-orange-400 bg-clip-text text-transparent">
              DIGICHAMP
            </h1>
          </div>

          {/* Result Icon and Message */}
          <div className="mb-12">
            <div className="flex justify-center mb-8">
              {state.passed ? (
                <img src={successImg}/>
              ) : (
                <img src={failedImg}/>
              )}
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {state.passed ? 'Congratulations You Passed!' : "Failed This Attempt Let's Try Again!"}
            </h2>
            <a href="#" className="text-purple-950 hover:text-purple-700 font-medium">
              Review Responses
            </a>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
              <div className="text-gray-600 mb-2">Your Score</div>
              <div className={`text-3xl font-bold mb-1 ${state.passed ? 'text-green-600' : 'text-red-600'}`}>
                {percentage}%
              </div>
              <div className="text-sm text-gray-500">Passing score 70%</div>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
              <div className="text-gray-600 mb-2">Your Points</div>
              <div className={`text-3xl font-bold mb-1 ${state.passed ? 'text-green-600' : 'text-red-600'}`}>
                {state.score}
              </div>
              <div className="text-sm text-gray-500">Passing points 70</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {state.quizCompleted ? renderResultsView() : renderQuizView()}
      
      {/* Chat Bot Icon */}
      <div className="fixed bottom-6 right-6">
        <div className="w-14 h-14 bg-purple-950 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-purple-700 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.38L1 22l5.62-2.05C8.96 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm2.07-7.75l-.9.92C11.45 10.9 11 11.5 11 13h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H6c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Quiz;