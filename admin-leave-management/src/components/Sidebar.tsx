import { NavLink } from "react-router-dom";

import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-symbol">✣</div>

        <div className="logo-text">
          <span>SCAMSUNGTECH</span>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="admin-profile">

        <div className="admin-avatar">
          A
        </div>

        <div className="admin-info">
          <strong>Admin</strong>
          <span>Admin</span>
        </div>

      </div>

      {/* Features */}
      <div className="sidebar-section">

        <div className="sidebar-section-title">
          Features
        </div>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="sidebar-icon">
            ▣
          </span>

          <span>Dashboard</span>

          {/* <span className="notification-dot">
            0
          </span> */}
        </NavLink>

        <div className="sidebar-item">
          <span className="sidebar-icon">
            ✉
          </span>

          <span>Messages</span>

          <span className="notification-dot">
            0
          </span>
        </div>

      </div>

      {/* Recruitment */}
      <div className="sidebar-section">

        <div className="sidebar-section-title">
          Recruitment
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">
            ▣
          </span>

          <span>Jobs</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">
            ♟
          </span>

          <span>Candidates</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">
            ▤
          </span>

          <span>Resumes</span>
        </div>

      </div>

      {/* Organization */}
      <div className="sidebar-section">

        <div className="sidebar-section-title">
          Organization
        </div>

        {/* Employee Management */}
        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `sidebar-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="sidebar-icon">
            ♙
          </span>

          <span>Employee Management</span>
        </NavLink>

        {/* Leave Management */}
        <NavLink
          to="/leave-management"
          className={({ isActive }) =>
            `sidebar-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="sidebar-icon">
            ▣
          </span>

          <span>Leave Management</span>
        </NavLink>

        <div className="sidebar-item">
          <span className="sidebar-icon">
            ▤
          </span>

          <span>Performance Management</span>
        </div>

      </div>

      {/* KPI */}
      <div className="sidebar-section">

        <div className="sidebar-section-title">
          KPI's Pay
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">
            ▤
          </span>

          <span>Payroll Management</span>
        </div>

      </div>

      {/* Logout */}
      <button
        type="button"
        className="logout-button"
      >
        <span>⏻</span>
        <span>Log Out</span>
      </button>

    </aside>
  );
}

export default Sidebar;