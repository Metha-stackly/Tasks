import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";

import { employeeData } from "./services/employeeData";
import type { Employee } from "./types/Employee";

import "./styles/App.css";

function App() {

  const [employees, setEmployees] =
    useState<Employee[]>(employeeData);

  return (

    <div className="app">

      <Navbar />

      <div className="container">

        <Routes>

          <Route
            path="/"
            element={
              <Employees
                employees={employees}
                setEmployees={setEmployees}
              />
            }
          />

          <Route
            path="/add-employee"
            element={
              <AddEmployee
                employees={employees}
                setEmployees={setEmployees}
              />
            }
          />

        </Routes>

      </div>

    </div>

  );

}

export default App;