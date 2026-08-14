import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getMovieDetails,
} from "../services/movieApi";

import type {
  MovieDetails as MovieDetailsType,
} from "../types/Movie";

import "../styles/MovieDetails.css";


function MovieDetails() {
  const { id } =
    useParams<{ id: string }>();

  const [movie, setMovie] =
    useState<MovieDetailsType | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadMovie() {
      if (!id) {
        setError(
          "Movie ID not found."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await getMovieDetails(
            Number(id)
          );

        setMovie(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load movie details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);

  if (loading) {
    return (
      <main className="movie-details-page">
        <div className="movie-details-loading">
          Loading movie details...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="movie-details-page">
        <div className="movie-details-error">

          <h2>
            Unable to load movie
          </h2>

          <p>{error}</p>

          <Link
            to="/movies"
            className="back-button"
          >
            ← Back to Movies
          </Link>

        </div>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="movie-details-page">
        <div className="movie-details-error">

          <h2>Movie not found</h2>

          <Link
            to="/movies"
            className="back-button"
          >
            ← Back to Movies
          </Link>

        </div>
      </main>
    );
  }

  const posterUrl =
    movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "";

  const backdropUrl =
    movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : "";

  return (
    <main
      className="movie-details-page"
      style={
        backdropUrl
          ? {
              backgroundImage: `
                linear-gradient(
                  to right,
                  rgba(5, 8, 20, 0.97),
                  rgba(5, 8, 20, 0.82),
                  rgba(5, 8, 20, 0.97)
                ),
                url(${backdropUrl})
              `,
            }
          : undefined
      }
    >

      <div className="movie-details-container">

        <Link
          to="/movies"
          className="back-button"
        >
          ← Back to Movies
        </Link>

        <section className="movie-details-card">

          <div className="movie-poster-section">

            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className="movie-details-poster"
              />
            ) : (
              <div className="no-poster">
                No Image Available
              </div>
            )}

          </div>

          <div className="movie-info">

            <h1>{movie.title}</h1>

            {movie.tagline && (
              <p className="movie-tagline">
                "{movie.tagline}"
              </p>
            )}

            <div className="movie-meta">

              <span>
                📅{" "}
                {movie.release_date ||
                  "N/A"}
              </span>

              <span>
                ⭐{" "}
                {movie.vote_average.toFixed(
                  1
                )}
              </span>

              {movie.runtime && (
                <span>
                  ⏱️ {movie.runtime} min
                </span>
              )}

            </div>

            {movie.genres &&
              movie.genres.length > 0 && (
                <div className="movie-genres">

                  {movie.genres.map(
                    (genre) => (
                      <span
                        key={genre.id}
                        className="genre-tag"
                      >
                        {genre.name}
                      </span>
                    )
                  )}

                </div>
              )}

            <div className="movie-overview">

              <h2>Overview</h2>

              <p>
                {movie.overview ||
                  "No overview available."}
              </p>

            </div>

            <div className="movie-extra-info">

              <div>
                <strong>
                  Original Title:
                </strong>{" "}
                {movie.original_title}
              </div>

              <div>
                <strong>
                  Language:
                </strong>{" "}
                {movie.original_language.toUpperCase()}
              </div>

              <div>
                <strong>
                  Popularity:
                </strong>{" "}
                {movie.popularity.toFixed(
                  1
                )}
              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

export default MovieDetails;