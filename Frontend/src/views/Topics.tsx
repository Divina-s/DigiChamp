import React, { useEffect, useState } from 'react';

const topics = [
  "Basic Computer Operations",
  "Intro to Coding Concepts",
  "Google Workspace",
  "Computer Ethics",
  "Understanding Software and Applications",
  "File Management and Storage",
  "Internet Safety and Security",
  "Hardware Components and Their Functions",
];

const Topics: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleSelect = (topic: string) => {
    setSelectedTopic(topic);
    // Scroll to bottom to reveal buttons
    setTimeout(() => {
      document.getElementById('actionButtons')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handlePrevious = () => {
    setSelectedTopic(null);
  };

  const handleStartQuiz = () => {
    if (selectedTopic) {
      const confirmation = window.confirm(`Start quiz for "${selectedTopic}"?\n\nClick OK to begin or Cancel to choose a different topic.`);
      if (confirmation) {
        console.log('Quiz started for:', selectedTopic);
        // Navigate to quiz page here
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && selectedTopic) {
        setTimeout(() => {
          document.getElementById('actionButtons')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedTopic]);

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col lg:flex-row">
      <div className="container mx-auto px-12 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-orange-400 bg-clip-text text-transparent">
            DIGICHAMP
          </h1>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Choose a Topic to Begin Quiz</h2>
        </div>

        {/* Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {topics.slice(0, 4).map(topic => (
            <div
              key={topic}
              className={`topic-card bg-white border-2 rounded-xl p-6 cursor-pointer ${
                selectedTopic === topic ? 'selected' : 'border-gray-300'
              }`}
              onClick={() => handleSelect(topic)}
            >
              <h3 className="text-lg font-medium text-gray-900 text-center">{topic}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {topics.slice(4, 7).map(topic => (
            <div
              key={topic}
              className={`topic-card bg-white border-2 rounded-xl p-6 cursor-pointer ${
                selectedTopic === topic ? 'selected' : 'border-gray-300'
              }`}
              onClick={() => handleSelect(topic)}
            >
              <h3 className="text-lg font-medium text-gray-900 text-center">{topic}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div
            className={`topic-card bg-white border-2 rounded-xl p-6 cursor-pointer ${
              selectedTopic === topics[7] ? 'selected' : 'border-gray-300'
            }`}
            onClick={() => handleSelect(topics[7])}
          >
            <h3 className="text-lg font-medium text-gray-900 text-center">{topics[7]}</h3>
          </div>
        </div>

        {/* Buttons */}
        <div
          id="actionButtons"
          className={`flex justify-end space-x-4 transition-opacity duration-300 ${
            selectedTopic ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={handlePrevious}
            className="px-8 py-3 bg-purple-200 text-purple-900 font-medium rounded-lg hover:bg-purple-300 transition-colors"
          >
            Previous Page
          </button>
          <button
            onClick={handleStartQuiz}
            className="px-8 py-3 bg-purple-950 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topics;
