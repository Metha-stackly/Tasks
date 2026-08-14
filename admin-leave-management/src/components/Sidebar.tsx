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

        <div className="sidebar-item">
          <span className="sidebar-icon">▣</span>
          <span>Dashboard</span>
          <span className="notification-dot">0</span>

          
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">✉</span>
          <span>Messages</span>
          <span className="notification-dot">0</span>
        </div>

      </div>

      {/* Recruitment */}
      <div className="sidebar-section">

        <div className="sidebar-section-title">
          Recruitment
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">▣</span>
          <span>Jobs</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">♟</span>
          <span>Candidates</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">▤</span>
          <span>Resumes</span>
        </div>

      </div>

      {/* Organization */}
      <div className="sidebar-section">

        <div className="sidebar-section-title">
          Organization
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">♙</span>
          <span>Employee Management</span>
        </div>

        {/* ACTIVE */}
        <div className="sidebar-item active">
          <span className="sidebar-icon">▣</span>
          <span>Leave Management</span>
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">▤</span>
          <span>Performance Management</span>
        </div>

      </div>

      {/* KPI */}
      <div className="sidebar-section">

        <div className="sidebar-section-title">
          KPI's Pay
        </div>

        <div className="sidebar-item">
          <span className="sidebar-icon">▤</span>
          <span>Payroll Management</span>
        </div>

      </div>

      {/* Logout */}
      <button className="logout-button">
        <span>⏻</span>
        <span>Log Out</span>
      </button>

    </aside>
  );
}

export default Sidebar;