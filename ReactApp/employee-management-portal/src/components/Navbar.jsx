import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {

  return (

    <nav className="navbar">

      <h2>Employee Portal</h2>

      <ul>

        <li>
          <NavLink to="/">Dashboard</NavLink>
        </li>

        <li>
          <NavLink to="/employees">Employees</NavLink>
        </li>

        <li>
          <NavLink to="/add-employee">Add Employee</NavLink>
        </li>

        <li>
          <NavLink to="/about">About</NavLink>
        </li>

      </ul>

    </nav>

  );

}

export default Navbar;