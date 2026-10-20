import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';

export default function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('dark') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('dark', dark);
  }, [dark]);

  return (
    <div
      className={`${dark ? 'dark' : ''} min-h-screen transition-colors ${
        dark
          ? 'bg-slate-900'
          : 'bg-linear-to-br from-slate-100 to-blue-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="text-3xl font-bold text-slate-800 dark:text-white"
          >
            🎬 Movie Explorer
          </Link>
          <button
            onClick={() => setDark(!dark)}
            className="text-2xl p-2 rounded-lg bg-white dark:bg-slate-800 shadow"
            aria-label="Toggle dark mode"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route
            path="*"
            element={
              <p className="text-center py-16 text-slate-500 dark:text-slate-400">
                Page not found. <Link to="/" className="text-blue-500 underline">Go home</Link>.
              </p>
            }
          />
        </Routes>
      </div>
    </div>
  );
}