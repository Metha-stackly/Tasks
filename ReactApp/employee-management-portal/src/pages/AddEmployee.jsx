import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";

function AddEmployee() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    status: "Active"
  });

  function handleChange(event) {

    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

  }

  function handleSubmit(event) {

    event.preventDefault();

    // Validation
    if (
      !formData.id ||
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.department ||
      !formData.designation
    ) {

      alert("Please fill all fields.");

      return;

    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {

      alert("Please enter a valid email.");

      return;

    }

    if (!/^\d{10}$/.test(formData.phone)) {

      alert("Phone number must contain exactly 10 digits.");

      return;

    }

    // Read existing employees
    const employees =
      JSON.parse(localStorage.getItem("employees")) || [];

    // Create new employee
    const newEmployee = {
      id: Number(formData.id),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      designation: formData.designation,
      status: formData.status,

      // Required for EmployeeCard
      company: {
        name: formData.department
      },

      isLocal: true
    };

    employees.push(newEmployee);

    localStorage.setItem(
      "employees",
      JSON.stringify(employees)
    );

    alert("Employee Added Successfully!");

    navigate("/employees");

  }

  return (

    <div>

      <h1>Add Employee</h1>

      <EmployeeForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

    </div>

  );

}

export default AddEmployee;