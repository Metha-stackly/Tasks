import { Link } from "react-router-dom";

import "../styles/Dashboard.css";

function Dashboard() {
  return (
    <main className="dashboard-page">

      <section className="dashboard-welcome-card">

        <div className="dashboard-welcome-content">

          <span className="dashboard-label">
            ADMIN DASHBOARD
          </span>

          <h1>
            Welcome back, Admin
          </h1>

          <p>
            Manage your organization, employees,
            and leave activities from one place.
          </p>

          <div className="dashboard-actions">

            {/* Employee Management */}
            <Link
              to="/employees"
              className="dashboard-action-card"
            >
              <div className="dashboard-action-icon">
                ♙
              </div>

              <div>
                <strong>
                  Employee Management
                </strong>

                <span>
                  View and manage employees
                </span>
              </div>
            </Link>


            {/* Leave Management */}
            <Link
              to="/leave-management"
              className="dashboard-action-card"
            >
              <div className="dashboard-action-icon">
                ▣
              </div>

              <div>
                <strong>
                  Leave Management
                </strong>

                <span>
                  Manage employee leave
                </span>
              </div>
            </Link>

          </div>

        </div>


        {/* Right Illustration */}

        <div className="dashboard-illustration">

          <div className="illustration-circle">
            <span>✣</span>
          </div>

          <div className="illustration-dot dot-one" />

          <div className="illustration-dot dot-two" />

          <div className="illustration-dot dot-three" />

        </div>

      </section>


      {/* Overview */}

      <section className="dashboard-overview">

        <div className="overview-card">

          <span className="overview-title">
            Total Employees
          </span>

          <strong>15</strong>

          <span className="overview-subtitle">
            Employees registered
          </span>

        </div>


        <div className="overview-card">

          <span className="overview-title">
            Leave Requests
          </span>

          <strong>0</strong>

          <span className="overview-subtitle">
            Pending requests
          </span>

        </div>


        <div className="overview-card">

          <span className="overview-title">
            Departments
          </span>

          <strong>8</strong>

          <span className="overview-subtitle">
            Active departments
          </span>

        </div>

      </section>

    </main>
  );
}

export default Dashboard;