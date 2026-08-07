import { useState } from "react";

import EmployeeCard from "../components/EmployeeCard";
import SearchBar from "../components/SearchBar";

import type { Employee } from "../types/Employee";

interface EmployeesProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

function Employees({
  employees,
  setEmployees,
}: EmployeesProps) {

  const [searchText, setSearchText] =
    useState<string>("");

  function deleteEmployee(id: number) {

    const updatedEmployees = employees.filter(
      (employee) => employee.id !== id
    );

    setEmployees(updatedEmployees);

  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
  );

  return (

    <div>

      <h1>Employee List</h1>

      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
      />

      {filteredEmployees.length === 0 ? (

        <h3>No Employees Found</h3>

      ) : (

        filteredEmployees.map((employee) => (

          <EmployeeCard
            key={employee.id}
            employee={employee}
            onDelete={deleteEmployee}
          />

        ))

      )}

    </div>

  );

}

export default Employees;