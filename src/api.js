const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const API_URL = 'https://www.omdbapi.com/';

if (!API_KEY) {
  console.warn('⚠️ Missing VITE_OMDB_API_KEY. Create a .env file in the project root.');
}

export async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`
  );
  const data = await res.json();
  
  if (data.Response === 'False') {
    if (data.Error === 'Movie not found!') throw new Error('No more results');
    throw new Error(data.Error);
  }
  
  return {
    movies: data.Search,
    totalResults: parseInt(data.totalResults, 10)
  };
}
export async function getMovieById(id) {
  const res = await fetch(
    `${API_URL}?apikey=${API_KEY}&i=${encodeURIComponent(id)}&plot=full`
  );
  const data = await res.json();
  if (data.Response === 'False') throw new Error(data.Error);
  return data; // full movie object
}