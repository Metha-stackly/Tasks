import { useState } from "react";
import type { Employee } from "../types/Employee";
import "../styles/EmployeeForm.css";

interface EmployeeFormProps{

    onAddEmployee:(employee:Employee)=>void;

}

const initialEmployee:Employee={

    id:0,
    name:"",
    email:"",
    phone:"",
    department:"",
    designation:"",
    status:"Active"

};

function EmployeeForm({

    onAddEmployee

}:EmployeeFormProps){

const [employee,setEmployee]=
useState<Employee>(initialEmployee);

function handleChange(

event:React.ChangeEvent<
HTMLInputElement|HTMLSelectElement>

){

const {name,value}=event.target;

setEmployee({

...employee,

[name]:
name==="id"
?Number(value)
:value

});

}

function handleSubmit(

event:React.FormEvent<HTMLFormElement>

){

event.preventDefault();

onAddEmployee(employee);

setEmployee(initialEmployee);

}

return(

<form

className="employee-form"

onSubmit={handleSubmit}

>

<input
type="number"
name="id"
placeholder="Employee ID"
value={employee.id}
onChange={handleChange}
required
/>

<input
type="text"
name="name"
placeholder="Full Name"
value={employee.name}
onChange={handleChange}
required
/>

<input
type="email"
name="email"
placeholder="Email"
value={employee.email}
onChange={handleChange}
required
/>

<input
type="text"
name="phone"
placeholder="Phone Number"
value={employee.phone}
onChange={handleChange}
required
/>

<input
type="text"
name="department"
placeholder="Department"
value={employee.department}
onChange={handleChange}
required
/>

<input
type="text"
name="designation"
placeholder="Designation"
value={employee.designation}
onChange={handleChange}
required
/>

<select
name="status"
value={employee.status}
onChange={handleChange}
>

<option value="Active">
Active
</option>

<option value="Inactive">
Inactive
</option>

</select>

<div className="buttons">

<button type="submit">

Add Employee

</button>

<button
type="reset"
onClick={()=>
setEmployee(initialEmployee)
}
>

Reset

</button>

</div>

</form>

);

}

export default EmployeeForm;