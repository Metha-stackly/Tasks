import "../styles/DashboardCard.css";

function DashboardCard({ title, count, color }) {

  return (

    <div className="dashboard-card">

      <h3>{title}</h3>

      <h1 style={{ color: color }}>
        {count}
      </h1>

    </div>

  );

}

export default DashboardCard;