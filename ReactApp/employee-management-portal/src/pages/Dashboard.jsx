import { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import "../styles/Dashboard.css";

function Dashboard() {

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [inactiveEmployees, setInactiveEmployees] = useState(0);
  const [departments, setDepartments] = useState(0);

  useEffect(() => {

    async function loadDashboard() {

      try {

        // API Employees
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );

        const apiEmployees = await response.json();

        // Local Employees
        const localEmployees =
          JSON.parse(localStorage.getItem("employees")) || [];

        // Merge both
        const allEmployees = [
          ...apiEmployees,
          ...localEmployees
        ];

        setTotalEmployees(allEmployees.length);

        // Active Employees
        const active = allEmployees.filter(
          (employee) =>
            employee.status === "Active" ||
            employee.status === undefined
        );

        setActiveEmployees(active.length);

        // Inactive Employees
        setInactiveEmployees(
          allEmployees.length - active.length
        );

        // Departments
        const departmentSet = new Set();

        allEmployees.forEach((employee) => {

          if (employee.department) {

            departmentSet.add(employee.department);

          }

          else if (employee.company?.name) {

            departmentSet.add(employee.company.name);

          }

        });

        setDepartments(departmentSet.size);

      }

      catch (error) {

        console.error(error);

      }

    }

    loadDashboard();

  }, []);

  return (

    <div className="dashboard">

      <h1>Dashboard</h1>

      <p>

        Welcome to the Employee Management Portal

      </p>

      <div className="dashboard-grid">

        <DashboardCard
          title="Total Employees"
          count={totalEmployees}
          color="#2563eb"
        />

        <DashboardCard
          title="Active Employees"
          count={activeEmployees}
          color="#16a34a"
        />

        <DashboardCard
          title="Inactive Employees"
          count={inactiveEmployees}
          color="#dc2626"
        />

        <DashboardCard
          title="Departments"
          count={departments}
          color="#9333ea"
        />

      </div>

    </div>

  );

}

export default Dashboard;