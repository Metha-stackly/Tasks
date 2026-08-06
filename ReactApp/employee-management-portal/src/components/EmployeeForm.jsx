import "../styles/EmployeeForm.css";

function EmployeeForm({
  formData,
  handleChange,
  handleSubmit
}) {

  function resetForm() {

    handleChange({
      target: {
        name: "id",
        value: ""
      }
    });

    handleChange({
      target: {
        name: "name",
        value: ""
      }
    });

    handleChange({
      target: {
        name: "email",
        value: ""
      }
    });

    handleChange({
      target: {
        name: "phone",
        value: ""
      }
    });

    handleChange({
      target: {
        name: "department",
        value: ""
      }
    });

    handleChange({
      target: {
        name: "designation",
        value: ""
      }
    });

    handleChange({
      target: {
        name: "status",
        value: "Active"
      }
    });

  }

  return (

    <form className="employee-form" onSubmit={handleSubmit}>

      <input
        type="text"
        name="id"
        placeholder="Employee ID"
        value={formData.id}
        onChange={handleChange}
      />

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
      />

      <input
        type="text"
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
      />

      <input
        type="text"
        name="designation"
        placeholder="Designation"
        value={formData.designation}
        onChange={handleChange}
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option>Active</option>
        <option>Inactive</option>
      </select>

      <div className="form-buttons">

        <button type="submit">

          Add Employee

        </button>

        <button
          type="button"
          onClick={resetForm}
        >

          Reset

        </button>

      </div>

    </form>

  );

}

export default EmployeeForm;