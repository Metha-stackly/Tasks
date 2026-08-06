import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/EmployeeDetails.css";

function EmployeeDetails() {

  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadEmployee() {

      // First check localStorage
      const localEmployees =
        JSON.parse(localStorage.getItem("employees")) || [];

      const localEmployee = localEmployees.find(
        (emp) => emp.id === Number(id)
      );

      if (localEmployee) {

        setEmployee(localEmployee);
        setLoading(false);
        return;

      }

      // If not found, fetch from API
      try {

        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${id}`
        );

        const data = await response.json();

        setEmployee(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    loadEmployee();

  }, [id]);

  if (loading) {

    return <h2>Loading Employee...</h2>;

  }

  if (!employee || !employee.id) {

    return <h2>Employee Not Found</h2>;

  }

  return (

    <div className="details-card">

      <h1>Employee Details</h1>

      <hr />

      <p>
        <strong>ID :</strong> {employee.id}
      </p>

      <p>
        <strong>Name :</strong> {employee.name}
      </p>

      <p>
        <strong>Email :</strong> {employee.email}
      </p>

      <p>
        <strong>Phone :</strong> {employee.phone || "N/A"}
      </p>

      <p>
        <strong>Department :</strong>

        {
          employee.department
            ? employee.department
            : employee.company?.name
        }

      </p>

      <p>
        <strong>Designation :</strong>

        {
          employee.designation
            ? employee.designation
            : "Employee"
        }

      </p>

      <p>

        <strong>Status :</strong>

        <span className="active-badge">

          {
            employee.status
              ? employee.status
              : "Active"
          }

        </span>

      </p>

    </div>

  );

}

export default EmployeeDetails;