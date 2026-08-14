  import {
    useEffect,
    useMemo,
    useState,
  } from "react";

  import SearchBar from "../components/SearchBar";
  import MovieGrid from "../components/MovieGrid";
  import Filter from "../components/Filter";
  import Loader from "../components/Loader";
  import ErrorMessage from "../components/ErrorMessage";

  import {
    getPopularMovies,
    searchMovies,
  } from "../services/movieApi";

  import type { Movie } from "../types/Movie";

  import "../styles/Movies.css";

  interface MoviesProps {
    favorites: Movie[];
    onToggleFavorite: (movie: Movie) => void;
  }

  function Movies({
    favorites,
    onToggleFavorite,
  }: MoviesProps) {
    const [movies, setMovies] =
      useState<Movie[]>([]);

    const [searchText, setSearchText] =
      useState("");

    const [selectedGenre, setSelectedGenre] =
      useState("");

    const [sortBy, setSortBy] =
      useState("");

    const [loading, setLoading] =
      useState(true);

    const [error, setError] =
      useState("");

    useEffect(() => {
      loadPopularMovies();
    }, []);

    async function loadPopularMovies() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getPopularMovies();

        setMovies(data);
      } catch {
        setError(
          "Unable to load movies."
        );
      } finally {
        setLoading(false);
      }
    }

    async function handleSearch(
      value: string
    ) {
      setSearchText(value);

      if (value.trim() === "") {
        await loadPopularMovies();
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await searchMovies(value);

        setMovies(data);
      } catch {
        setError(
          "Unable to load movies."
        );
      } finally {
        setLoading(false);
      }
    }

    const filteredMovies = useMemo(() => {
      let result = [...movies];

      if (selectedGenre !== "") {
        result = result.filter((movie) =>
          movie.genre_ids?.includes(
            Number(selectedGenre)
          )
        );
      }

      if (sortBy === "high") {
        result.sort(
          (a, b) =>
            b.vote_average -
            a.vote_average
        );
      }

      if (sortBy === "low") {
        result.sort(
          (a, b) =>
            a.vote_average -
            b.vote_average
        );
      }

      return result;
    }, [
      movies,
      selectedGenre,
      sortBy,
    ]);

    return (
      <main className="movies-page">

        <div className="movies-header">

          <h1>
            Explore Movies
          </h1>

          <p>
            Discover popular movies and find
            your next favorite.
          </p>

          <SearchBar
            value={searchText}
            onChange={handleSearch}
          />

          <Filter
            selectedGenre={selectedGenre}
            sortBy={sortBy}
            onGenreChange={
              setSelectedGenre
            }
            onSortChange={
              setSortBy
            }
          />

        </div>

        {loading && <Loader />}

        {!loading && error && (
          <ErrorMessage
            message={error}
          />
        )}

        {!loading &&
          !error &&
          filteredMovies.length === 0 && (
            <p className="no-movies">
              No Movies Found
            </p>
          )}

        {!loading &&
          !error &&
          filteredMovies.length > 0 && (
            <MovieGrid
              movies={filteredMovies}
              favorites={favorites}
              onToggleFavorite={
                onToggleFavorite
              }
            />
          )}

      </main>
    );
  }

  export default Movies;