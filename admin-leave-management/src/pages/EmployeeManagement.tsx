import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import employees from "../data/employees.json";

import "../styles/EmployeeManagement.css";

function EmployeeManagement() {
  const [searchText, setSearchText] = useState("");

  const [openActionId, setOpenActionId] =
    useState<number | null>(null);

  const filteredEmployees = useMemo(() => {
    const searchValue =
      searchText.trim().toLowerCase();

    if (searchValue === "") {
      return employees;
    }

    return employees.filter((employee) =>
      employee.name
        .toLowerCase()
        .includes(searchValue)
    );
  }, [searchText]);

  return (
    <main className="employee-management-page">

      {/* Header */}
      <div className="employee-management-header">

        <div>
          <h1>Employee Management</h1>

          <p>
            Manage and view employee information.
          </p>
        </div>

        <button
          type="button"
          className="export-button"
        >
          Export
        </button>

      </div>

      {/* Search and Filter */}
      <div className="employee-management-controls">

        <input
          type="text"
          placeholder="Search employees..."
          className="employee-search"
          value={searchText}
          onChange={(event) =>
            setSearchText(event.target.value)
          }
        />

        <select className="employee-filter">

          <option value="all">
            All Candidates
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>

        </select>

      </div>

      {/* Employee Table */}
      <div className="employee-table-wrapper">

        <table className="employee-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Dept</th>
              <th>Job Title</th>
              <th>Start Date</th>
              <th>Category</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredEmployees.length > 0 ? (

              filteredEmployees.map((employee) => (

                <tr key={employee.id}>

                  {/* Name */}
                  <td>
                    {employee.name}
                  </td>

                  {/* Department */}
                  <td>
                    {employee.job.department}
                  </td>

                  {/* Job Title */}
                  <td>
                    {employee.job.jobTitle}
                  </td>

                  {/* Start Date */}
                  <td>
                    {employee.job.startDate}
                  </td>

                  {/* Category */}
                  <td>
                    {employee.job.category}
                  </td>

                  {/* Gender */}
                  <td>
                    {employee.personal.gender}
                  </td>

                  {/* Actions */}
                  <td>

                    <div className="action-wrapper">

                      <button
                        type="button"
                        className="action-button"
                        onClick={() =>
                          setOpenActionId(
                            openActionId === employee.id
                              ? null
                              : employee.id
                          )
                        }
                      >
                        Actions

                        <span className="action-arrow">
                          ⌄
                        </span>

                      </button>

                      {openActionId === employee.id && (

                        <div className="action-menu">

                          <Link
                            to={`/employees/${employee.id}`}
                            className="action-menu-item"
                            onClick={() =>
                              setOpenActionId(null)
                            }
                          >
                            View Profile
                          </Link>

                        </div>

                      )}

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={7}
                  className="no-employees"
                >
                  No employees found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </main>
  );
}

export default EmployeeManagement;