import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <h2>Product Catalog</h2>

      <div className="nav-links">

        <Link to="/">Products</Link>

      </div>

    </nav>
  );
}

export default Navbar;