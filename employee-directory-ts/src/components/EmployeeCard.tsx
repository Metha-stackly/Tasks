import type { Employee } from "../types/Employee";
import "../styles/EmployeeCard.css";

interface EmployeeCardProps {

  employee: Employee;

  onDelete?: (id:number)=>void;

}

function EmployeeCard({

  employee,

  onDelete

}:EmployeeCardProps){

  return(

    <div className="employee-card">

      <h2>{employee.name}</h2>

      <p><strong>ID:</strong> {employee.id}</p>

      <p><strong>Email:</strong> {employee.email}</p>

      <p><strong>Phone:</strong> {employee.phone}</p>

      <p><strong>Department:</strong> {employee.department}</p>

      <p><strong>Designation:</strong> {employee.designation}</p>

      <p><strong>Status:</strong> {employee.status}</p>

      {
        onDelete &&

        <button

          className="delete-btn"

          onClick={()=>onDelete(employee.id)}

        >

          Delete

        </button>
      }

    </div>

  );

}

export default EmployeeCard;