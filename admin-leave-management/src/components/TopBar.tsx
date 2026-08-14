import "../styles/TopBar.css";

function TopBar() {
  return (
    <header className="top-bar">

      {/* Menu */}
      <button className="menu-button" type="button">
        ☰
      </button>

      {/* Candidate Filter */}
      <button className="candidate-select" type="button">
        <span>All Candidates</span>
        <span className="candidate-arrow">▾</span>
      </button>

      {/* Search */}
      <div className="top-search">
        <input
          type="text"
          placeholder="Search..."
        />

        <span className="search-icon">
          🔍
        </span>
      </div>

      {/* Right Side Icons */}
      <div className="top-actions">

        <button
          className="top-action notification"
          type="button"
          aria-label="Notifications"
        >
          🔔
          <span className="notification-badge">
            1
          </span>
        </button>

        <button
          className="top-action key-action"
          type="button"
          aria-label="Settings"
        >
          🔑
        </button>

        <button
          className="top-action mail-action"
          type="button"
          aria-label="Messages"
        >
          ✉
          <span className="mail-badge">
            1
          </span>
        </button>

      </div>

    </header>
  );
}

export default TopBar;