import { useEffect, useState } from "react";
import EmployeeCard from "../components/EmployeeCard";
import SearchBar from "../components/SearchBar";
import { getEmployees } from "../services/api";

function Employees() {

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {

    async function loadEmployees() {

      try {

        const data = await getEmployees();

        setEmployees(data);

      } catch (err) {

        console.error(err);

        setError("Failed to load employees.");

      } finally {

        setLoading(false);

      }

    }

    loadEmployees();

  }, []);

  function deleteEmployee(id) {

    // Remove from screen
    const updatedEmployees = employees.filter(
      (employee) => employee.id !== id
    );

    setEmployees(updatedEmployees);

    // Remove from localStorage if it is a locally added employee
    const localEmployees =
      JSON.parse(localStorage.getItem("employees")) || [];

    const updatedLocalEmployees = localEmployees.filter(
      (employee) => employee.id !== id
    );

    localStorage.setItem(
      "employees",
      JSON.stringify(updatedLocalEmployees)
    );

  }

  const filteredEmployees = employees.filter((employee) =>
    employee.name
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  if (loading) {

    return <h2>Loading Employees...</h2>;

  }

  if (error) {

    return <h2>{error}</h2>;

  }

  return (

    <div>

      <h1>Employees</h1>

      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <p>
        Total Employees : {filteredEmployees.length}
      </p>

      {

        filteredEmployees.length === 0 ?

          (

            <h2>No Employees Found</h2>

          )

          :

          (

            filteredEmployees.map((employee) => (

              <EmployeeCard

                key={employee.id}

                id={employee.id}

                name={employee.name}

                email={employee.email}

                company={employee.company.name}

                onDelete={deleteEmployee}

              />

            ))

          )

      }

    </div>

  );

}

export default Employees;