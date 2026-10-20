import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById } from '../api';
import ErrorMessage from '../components/ErrorMessage';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getMovieById(id);
        if (!cancelled) setMovie(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} />;
  if (!movie) return null;

  const poster =
    movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : 'https://via.placeholder.com/300x450?text=No+Poster';

  return (
    <article className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6">
        <Link
          to="/"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          ← Back to search
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={poster}
            alt={movie.Title}
            className="w-48 md:w-64 rounded-xl shadow-md mx-auto md:mx-0"
          />

          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              {movie.Title}{' '}
              <span className="text-slate-400 font-normal">({movie.Year})</span>
            </h1>

            <div className="flex flex-wrap gap-2 mt-3">
              {movie.Genre?.split(', ').map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700
                             dark:bg-blue-900 dark:text-blue-200"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              {movie.Plot}
            </p>

            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Detail label="Director" value={movie.Director} />
              <Detail label="Cast" value={movie.Actors} />
              <Detail label="Runtime" value={movie.Runtime} />
              <Detail label="Rated" value={movie.Rated} />
              <Detail
                label="IMDb Rating"
                value={`⭐ ${movie.imdbRating} / 10`}
              />
              <Detail label="Released" value={movie.Released} />
            </dl>
          </div>
        </div>
      </div>
    </article>
  );
}

function Detail({ label, value }) {
  if (!value || value === 'N/A') return null;
  return (
    <div>
      <dt className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-slate-800 dark:text-slate-200 font-medium">
        {value}
      </dd>
    </div>
  );
}