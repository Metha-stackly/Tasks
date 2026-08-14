  import type {
    Movie,
    MovieDetails,
    MovieResponse,
  } from "../types/Movie";

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const BASE_URL = "https://api.themoviedb.org/3";

  async function request<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("API request failed");
    }

    return response.json();
  }

  export async function getPopularMovies(): Promise<Movie[]> {
    const data = await request<MovieResponse>(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    );

    return data.results;
  }

  export async function searchMovies(
    query: string
  ): Promise<Movie[]> {
    const data = await request<MovieResponse>(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
        query
      )}&page=1`
    );

    return data.results;
  }

  export async function getMovieDetails(
    id: number
  ): Promise<MovieDetails> {
    return request<MovieDetails>(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
    );
  }