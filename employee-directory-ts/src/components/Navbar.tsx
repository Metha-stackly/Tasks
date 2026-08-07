import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <h2>Employee Directory</h2>

      <div className="nav-links">

        <Link to="/">Employees</Link>

        <Link to="/add-employee">Add Employee</Link>

      </div>

    </nav>
  );
}

export default Navbar;