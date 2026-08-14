import leaveSettings from "../data/leaveSettings.json";

import "../styles/LeaveSettings.css";

interface LeaveSetting {
  id: number;
  leaveType: string;
  days: number;
  status: string;
}

function LeaveSettings() {
  const settings =
    leaveSettings as LeaveSetting[];

  return (
    <section className="leave-settings">

      {/* Create Leave Settings */}

      <div className="settings-card">

        <div className="settings-card-header">
          <h2>Create Leave Settings</h2>
        </div>

        <div className="settings-form">

          <div className="form-group">
            <label htmlFor="leaveType">
              Leave Type
            </label>

            <select id="leaveType">
              <option value="">
                Select Leave Type
              </option>

              <option value="annual">
                Annual Leave
              </option>

              <option value="sick">
                Sick Leave
              </option>

              <option value="casual">
                Casual Leave
              </option>

              <option value="maternity">
                Maternity Leave
              </option>

              <option value="paternity">
                Paternity Leave
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="days">
              Number of Days
            </label>

            <input
              id="days"
              type="number"
              placeholder="Enter number of days"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">
              Status
            </label>

            <select id="status">
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>

          <button
            type="button"
            className="create-settings-button"
          >
            Create
          </button>

        </div>

      </div>

      {/* Manage Leave Settings */}

      <div className="settings-card">

        <div className="settings-card-header">
          <h2>Manage Leave Settings</h2>
        </div>

        <div className="settings-table-wrapper">

          <table className="settings-table">

            <thead>
              <tr>
                <th>S.No</th>
                <th>Leave Type</th>
                <th>Days</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {settings.map((setting) => (
                <tr key={setting.id}>

                  <td>{setting.id}</td>

                  <td>
                    {setting.leaveType}
                  </td>

                  <td>
                    {setting.days}
                  </td>

                  <td>
                    <span
                      className={
                        setting.status ===
                        "Active"
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {setting.status}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </section>
  );
}

export default LeaveSettings;