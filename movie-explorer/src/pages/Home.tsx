import { Link } from "react-router-dom";

import MovieCard from "../components/MovieCard";

import type { Movie } from "../types/Movie";

import "../styles/Home.css";

interface HomeProps {
  favorites: Movie[];
  onToggleFavorite: (movie: Movie) => void;
}

const featuredMovies: Movie[] = [
  {
    id: 550,
    title: "Fight Club",
    overview:
      "An insomniac office worker and a soap maker form an underground fight club.",
    poster_path:
      "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: null,
    release_date: "1999-10-15",
    vote_average: 8.4,
    popularity: 61.4,
    genre_ids: [18],
  },

  {
    id: 680,
    title: "Pulp Fiction",
    overview:
      "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine.",
    poster_path:
      "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: null,
    release_date: "1994-09-10",
    vote_average: 8.5,
    popularity: 140,
    genre_ids: [80, 53],
  },

  {
    id: 13,
    title: "Forrest Gump",
    overview:
      "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.",
    poster_path:
      "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    backdrop_path: null,
    release_date: "1994-07-06",
    vote_average: 8.5,
    popularity: 90,
    genre_ids: [35, 18, 10749],
  },
];

function Home({
  favorites,
  onToggleFavorite,
}: HomeProps) {
  return (
    <main className="home-page">

      {/* Hero Section */}
      <section className="hero-section">

        <div className="hero-content">

          <span className="hero-label">
            WELCOME TO MOVIE EXPLORER
          </span>

          <h1>
            Discover Your
            <span> Next Favorite Movie</span>
          </h1>

          <p>
            Explore thousands of movies, discover
            new favorites, and get detailed
            information about the films you love.
          </p>

          <Link
            to="/movies"
            className="explore-button"
          >
            Explore Movies
          </Link>

        </div>

      </section>

      {/* Featured Movies */}
      <section className="featured-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              HANDPICKED FOR YOU
            </span>

            <h2>
              Featured Movies
            </h2>
          </div>

          <Link
            to="/movies"
            className="view-all-link"
          >
            View All →
          </Link>

        </div>

        <div className="featured-movies">

          {featuredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favorites.some(
                (favorite) =>
                  favorite.id === movie.id
              )}
              onToggleFavorite={() =>
                onToggleFavorite(movie)
              }
            />
          ))}

        </div>

      </section>

    </main>
  );
}

export default Home;