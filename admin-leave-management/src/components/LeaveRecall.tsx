import leaveRecall from "../data/leaveRecall.json";

import "../styles/LeaveRecall.css";

interface LeaveRecallItem {
  id: number;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  status: string;
}

function LeaveRecall() {
  const applications =
    leaveRecall as LeaveRecallItem[];

  return (
    <section className="leave-recall">

      <div className="recall-card">

        <div className="recall-card-header">

          <div>
            <h2>
              Ongoing Leave Applications
            </h2>

            <p>
              View ongoing employee leave
              applications.
            </p>
          </div>

        </div>

        <div className="recall-table-wrapper">

          <table className="recall-table">

            <thead>
              <tr>
                <th>S.No</th>
                <th>Employee Name</th>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Days</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {applications.map(
                (application) => (
                  <tr key={application.id}>

                    <td>
                      {application.id}
                    </td>

                    <td>
                      {application.employeeName}
                    </td>

                    <td>
                      {application.leaveType}
                    </td>

                    <td>
                      {application.fromDate}
                    </td>

                    <td>
                      {application.toDate}
                    </td>

                    <td>
                      {application.days}
                    </td>

                    <td>
                      <span className="recall-status">
                        {application.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="recall-button"
                      >
                        Recall
                      </button>
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </section>
  );
}

export default LeaveRecall;