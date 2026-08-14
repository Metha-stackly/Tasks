import Sidebar from "./components/Sidebar";
import LeaveManagement from "./pages/LeaveManagement";

import "./App.css";

function App() {
  return (
    <div className="app">

      <Sidebar />

      <main className="main-content">

        <LeaveManagement />

      </main>

    </div>
  );
}

export default App;