import leaveHistory from "../data/leaveHistory.json";

import "../styles/LeaveHistory.css";

interface LeaveHistoryItem {
  id: number;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  status: string;
}

function LeaveHistory() {
  const history =
    leaveHistory as LeaveHistoryItem[];

  return (
    <section className="leave-history">

      <div className="history-card">

        <div className="history-card-header">

          <div>
            <h2>Leave History</h2>

            <p>
              View employee leave history.
            </p>
          </div>

          <button
            type="button"
            className="export-button"
          >
            Export
          </button>

        </div>

        <div className="history-table-wrapper">

          <table className="history-table">

            <thead>
              <tr>
                <th>S.No</th>
                <th>Employee Name</th>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Days</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {history.map((item) => (
                <tr key={item.id}>

                  <td>
                    {item.id}
                  </td>

                  <td>
                    {item.employeeName}
                  </td>

                  <td>
                    {item.leaveType}
                  </td>

                  <td>
                    {item.fromDate}
                  </td>

                  <td>
                    {item.toDate}
                  </td>

                  <td>
                    {item.days}
                  </td>

                  <td>
                    <span
                      className={`history-status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
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

export default LeaveHistory;