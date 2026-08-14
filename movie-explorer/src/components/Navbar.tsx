import { Link, NavLink } from "react-router-dom";

import "../styles/Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          <span className="logo-icon">▶</span>
          <span>Movie Explorer</span>
        </Link>

        <nav className="navbar-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/movies"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Movies
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive
                ? "nav-link active"
                : "nav-link"
            }
          >
            Favorites
          </NavLink>

        </nav>

      </div>
    </header>
  );
}

export default Navbar;