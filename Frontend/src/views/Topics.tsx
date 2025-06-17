// src/pages/Topics.tsx
import React, { useEffect, useState } from 'react';
import { base_url } from '../utils/apiFetch';
import { useNavigate } from 'react-router-dom';

interface Topic {
  id: number;
  name: string;
}

const Topics: React.FC = () => {
  const navigate = useNavigate();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${base_url}/api/quiz/topics/`);
        if (!res.ok) throw new Error('Unable to load topics');
        const data: Topic[] = await res.json();
        setTopics(data);
      } catch (err: any) {
        setError(err?.message ?? 'Unexpected error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelect = (topic: Topic) => {
    setSelected(topic.id);
    setTimeout(() => {
      document.getElementById('actionButtons')?.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  };

  const handleStartQuiz = () => {
    if (selected !== null) navigate(`/quiz/${selected}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10">
      <h1 className="mb-10 text-3xl font-bold bg-gradient-to-r from-purple-900 to-orange-400 bg-clip-text text-transparent">
        DIGICHAMP
      </h1>

      {loading && <p className="text-gray-600">Loading topics…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
            {topics.map((t) => (
              <div
                key={t.id}
                onClick={() => handleSelect(t)}
                className={`cursor-pointer p-6 rounded-xl border-2 transition ${
                  selected === t.id
                    ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-500'
                    : 'bg-white border-gray-300 hover:border-purple-400'
                }`}
              >
                <h3 className="text-center font-medium text-gray-900">{t.name}</h3>
              </div>
            ))}
          </div>

          <div
            id="actionButtons"
            className={`mt-10 flex gap-4 transition-opacity duration-300 ${
              selected === null ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <button
              onClick={() => setSelected(null)}
              className="px-6 py-3 bg-purple-200 text-purple-900 rounded-lg hover:bg-purple-300"
            >
              Choose Again
            </button>
            <button
              onClick={handleStartQuiz}
              className="px-6 py-3 bg-purple-950 text-white rounded-lg hover:bg-purple-700"
            >
              Start Quiz
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Topics;
