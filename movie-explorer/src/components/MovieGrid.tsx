import type { Movie } from "../types/Movie";

import MovieCard from "./MovieCard";

import "../styles/MovieGrid.css";

interface MovieGridProps {
  movies: Movie[];
  favorites: Movie[];
  onToggleFavorite: (movie: Movie) => void;
}

function MovieGrid({
  movies,
  favorites,
  onToggleFavorite,
}: MovieGridProps) {

  function isFavorite(movieId: number): boolean {
    return favorites.some(
      (favorite) => favorite.id === movieId
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={isFavorite(movie.id)}
          onToggleFavorite={() =>
            onToggleFavorite(movie)
          }
        />
      ))}
    </div>
  );
}

export default MovieGrid;