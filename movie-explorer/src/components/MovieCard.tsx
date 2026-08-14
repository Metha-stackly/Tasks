import { Link } from "react-router-dom";

import type { Movie } from "../types/Movie";

import FavoriteButton from "./FavoriteButton";

import "../styles/MovieCard.css";

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function MovieCard({
  movie,
  isFavorite,
  onToggleFavorite,
}: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <article className="movie-card">

      <img
        src={posterUrl}
        alt={movie.title}
        className="movie-poster"
      />

      <div className="movie-card-content">

        <h2>{movie.title}</h2>

        <p>
          <strong>Release:</strong>{" "}
          {movie.release_date || "N/A"}
        </p>

        <p>
          <strong>Rating:</strong>{" "}
          {movie.vote_average.toFixed(1)}
        </p>

        <div className="movie-card-actions">

          <Link
            to={`/movies/${movie.id}`}
            className="view-details-button"
          >
            View Details
          </Link>

          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
          />

        </div>

      </div>

    </article>
  );
}

export default MovieCard;