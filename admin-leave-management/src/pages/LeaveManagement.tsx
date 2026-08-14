import { useState } from "react";

import TopBar from "../components/TopBar";
import LeaveSettings from "../components/LeaveSettings";
import LeaveRecall from "../components/LeaveRecall";
import LeaveHistory from "../components/LeaveHistory";
import "../styles/LeaveManagement.css";

type LeaveTab =
  | "settings"
  | "recall"
  | "history";

function LeaveManagement() {
  const [activeTab, setActiveTab] =
    useState<LeaveTab>("settings");

  return (
    <main className="leave-management-page">

      <TopBar />

      <section className="leave-management-content">

        <div className="leave-page-header">
          <h1>Leave Management</h1>
        </div>

        <div className="leave-tabs">

          <button
            type="button"
            className={
              activeTab === "settings"
                ? "leave-tab active"
                : "leave-tab"
            }
            onClick={() =>
              setActiveTab("settings")
            }
          >
            Leave Settings
          </button>

          <button
            type="button"
            className={
              activeTab === "recall"
                ? "leave-tab active"
                : "leave-tab"
            }
            onClick={() =>
              setActiveTab("recall")
            }
          >
            Leave Recall
          </button>

          <button
            type="button"
            className={
              activeTab === "history"
                ? "leave-tab active"
                : "leave-tab"
            }
            onClick={() =>
              setActiveTab("history")
            }
          >
            Leave History
          </button>

        </div>

        <div className="leave-tab-content">

          {activeTab === "settings" && (
          <LeaveSettings />
          )}

          {activeTab === "recall" && (
            <div>
          <LeaveRecall />

            </div>
          )}

          {activeTab === "history" && (
            <div>
          <LeaveHistory />
            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default LeaveManagement;