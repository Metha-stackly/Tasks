import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import About from "./pages/About";
function App() {
  return (
    <div className="app">

      <Navbar />

      <main className="container">

        <Routes>

          <Route path="/" element={<Dashboard />} />

          <Route path="/employees" element={<Employees />} />

          <Route path="/add-employee" element={<AddEmployee />} />

          <Route path="/employee/:id" element={<EmployeeDetails />} />

          <Route path="/about" element={<About />} />

        </Routes>

      </main>

      <Footer />

    </div>
  );
}

export default App;