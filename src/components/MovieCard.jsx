import { Link } from 'react-router-dom';

const FALLBACK_POSTER =
  'https://via.placeholder.com/300x450?text=No+Poster';

export default function MovieCard({ movie }) {
  const poster =
    movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : FALLBACK_POSTER;

  return (
    <Link
      to={`/movie/${movie.imdbID}`}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden 
                 hover:shadow-xl hover:-translate-y-1 transition 
                 group"
    >
      <div className="aspect-2/3 overflow-hidden bg-slate-200 dark:bg-slate-700">
        <img
          src={poster}
          alt={movie.Title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-slate-800 dark:text-white truncate">
          {movie.Title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {movie.Year}
        </p>
      </div>
    </Link>
  );
}