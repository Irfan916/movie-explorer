import { useState, useEffect } from 'react';
import { searchMovies } from '../api';
import MovieCard from '../components/MovieCard';
import Skeleton from '../components/Skeleton';
import ErrorMessage from '../components/ErrorMessage';

const LAST_QUERY_KEY = 'lastQuery';

export default function Home() {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    // ─── Initial Search ───
    async function runSearch(term) {
        const trimmed = term.trim();
        if (!trimmed) return;

        setLoading(true);
        setError('');
        setHasSearched(true);
        setPage(1);

        try {
            const data = await searchMovies(trimmed, 1);
            setMovies(data.movies);
            setTotalResults(data.totalResults);
            localStorage.setItem(LAST_QUERY_KEY, trimmed);
        } catch (err) {
            setError(err.message);
            setMovies([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    }

    // ─── Load More ───
    async function loadMore() {
        setLoadingMore(true);
        setError('');
        const nextPage = page + 1;

        try {
            const data = await searchMovies(query, nextPage);
            // Append the new movies to the existing ones
            setMovies((prev) => [...prev, ...data.movies]);
            setPage(nextPage);
        } catch (err) {
            // If we hit "No more results", we just stop showing the button
            if (err.message === 'No more results') {
                setTotalResults(movies.length); // Fake the total to hide the button
            } else {
                setError(err.message);
            }
        } finally {
            setLoadingMore(false);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        runSearch(query);
    }

    useEffect(() => {
        const last = localStorage.getItem(LAST_QUERY_KEY);
        if (last) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQuery(last);
            runSearch(last);
        }
    }, []);

    // Calculate if we should show the Load More button
    const hasMore = movies.length > 0 && movies.length < totalResults;

    return (
        <main>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a movie..."
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 
                     dark:border-slate-700 bg-white dark:bg-slate-800 
                     text-slate-800 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium
                     hover:bg-blue-700 active:scale-95 transition
                     disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '...' : 'Search'}
                </button>
            </form>

            {error && <ErrorMessage message={error} />}

            {/* Initial Loading Skeletons */}
            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} />
                    ))}
                </div>
            )}

            {/* Movie Grid */}
            {!loading && !error && movies.length > 0 && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {movies.map((movie) => (
                            <MovieCard key={movie.imdbID} movie={movie} />
                        ))}
                    </div>

                    {/* ─── Load More Button ─── */}
                    {hasMore && (
                        <div className="flex justify-center mt-10">
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="px-6 py-3 rounded-xl bg-slate-800 text-white font-medium
                           hover:bg-slate-700 dark:bg-white dark:text-slate-900
                           dark:hover:bg-slate-200 transition disabled:opacity-50"
                            >
                                {loadingMore ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}

                    {/* End of results message */}
                    {!hasMore && movies.length > 0 && (
                        <p className="text-center text-slate-500 mt-8">You've reached the end! 🎬</p>
                    )}
                </>
            )}

            {/* No results */}
            {!loading && !error && hasSearched && movies.length === 0 && (
                <ErrorMessage message="No movies found. Try another title." />
            )}
        </main>
    );
}