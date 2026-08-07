import { useNavigate } from "react-router-dom";

import EmployeeForm from "../components/EmployeeForm";

import type { Employee } from "../types/Employee";

interface AddEmployeeProps {

  employees: Employee[];

  setEmployees:
  React.Dispatch<
  React.SetStateAction<Employee[]>
  >;

}

function AddEmployee({

  employees,

  setEmployees,

}: AddEmployeeProps) {

  const navigate = useNavigate();

  function addEmployee(
    newEmployee: Employee
  ) {

    setEmployees([
      ...employees,
      newEmployee,
    ]);

    navigate("/");

  }

  return (

    <div>

      <h1>Add Employee</h1>

      <EmployeeForm
        onAddEmployee={addEmployee}
      />

    </div>

  );

}

export default AddEmployee;