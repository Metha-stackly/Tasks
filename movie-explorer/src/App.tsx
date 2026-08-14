import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";

import type { Movie } from "./types/Movie";

import "./styles/App.css";

function App() {
  const [favorites, setFavorites] =
    useState<Movie[]>([]);

  function toggleFavorite(
    movie: Movie
  ) {
    setFavorites(
      (currentFavorites) => {
        const alreadyFavorite =
          currentFavorites.some(
            (favorite) =>
              favorite.id === movie.id
          );

        if (alreadyFavorite) {
          return currentFavorites.filter(
            (favorite) =>
              favorite.id !== movie.id
          );
        }

        return [
          ...currentFavorites,
          movie,
        ];
      }
    );
  }

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={
            <Home
              favorites={favorites}
              onToggleFavorite={
                toggleFavorite
              }
            />
          }
        />

        <Route
          path="/movies"
          element={
            <Movies
              favorites={favorites}
              onToggleFavorite={
                toggleFavorite
              }
            />
          }
        />

        <Route
          path="/movies/:id"
          element={
            <MovieDetails />
          }
        />

        <Route
          path="/favorites"
          element={
            <Favorites
              favorites={favorites}
              onRemoveFavorite={
                toggleFavorite
              }
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;