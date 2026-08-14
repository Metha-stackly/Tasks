import type { Movie } from "../types/Movie";

import "../styles/Favorites.css";

interface FavoritesProps {
  favorites: Movie[];
  onRemoveFavorite: (movie: Movie) => void;
}

function Favorites({
  favorites,
  onRemoveFavorite,
}: FavoritesProps) {
  return (
    <main className="favorites-page">
      <h1>Favorites</h1>

      {favorites.length === 0 ? (
        <p className="empty-favorites">
          No favorite movies yet.
        </p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((movie) => {
            const poster = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Poster";

            return (
              <div
                className="favorite-card"
                key={movie.id}
              >
                <img
                  src={poster}
                  alt={movie.title}
                />

                <div>
                  <h2>{movie.title}</h2>

                  <p>
                    Rating:{" "}
                    {movie.vote_average.toFixed(1)}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      onRemoveFavorite(movie)
                    }
                  >
                    Remove from Favorites
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Favorites;