import {
    useQuery,
} from "@tanstack/react-query";

import {
    fetchTenants,
} from "../api/tenantApi";

import {
    fetchUsers,
} from "../api/userApi";

import {
    useNavigate,
} from "react-router-dom";


function Dashboard() {

    const navigate =
        useNavigate();


    const tenantsQuery =
        useQuery({

            queryKey: [
                "dashboard-tenants",
            ],

            queryFn: () =>
                fetchTenants(
                    1,
                    30
                ),
        });


    const usersQuery =
        useQuery({

            queryKey: [
                "dashboard-users",
            ],

            queryFn: () =>
                fetchUsers(
                    1,
                    100
                ),
        });


    const tenants =
        tenantsQuery.data?.tenants ??
        [];


    const totalTenants =
        tenants.length;


    const activeTenants =
        tenants.filter(
            (tenant) =>
                tenant.status ===
                "Active"
        ).length;


    const inactiveTenants =
        tenants.filter(
            (tenant) =>
                tenant.status ===
                "Inactive"
        ).length;


    const totalUsers =
        usersQuery.data?.total ??
        0;


    const recentTenants =
        [...tenants]
            .sort(
                (a, b) =>
                    b.id - a.id
            )
            .slice(
                0,
                5
            );


    const loading =
        tenantsQuery.isLoading ||
        usersQuery.isLoading;


    return (

        <main className="page dashboard-page">

            <div className="page-header">

                <div>

                    <h2>
                        Dashboard Overview
                    </h2>

                    <p>
                        Overview of your tenants and users
                    </p>

                </div>


                <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                        tenantsQuery.refetch();
                        usersQuery.refetch();
                    }}
                >
                    ↻ Refresh Data
                </button>

            </div>


            {loading ? (

                <div className="loading-card">
                    Loading dashboard...
                </div>

            ) : (

                <>

                    <section className="stats-grid">

                        <div className="stat-card">

                            <div className="stat-content">

                                <span>
                                    Total Tenants
                                </span>

                                <strong>
                                    {totalTenants}
                                </strong>

                                <small>
                                    ↗ Current total
                                </small>

                            </div>

                            <div className="stat-icon purple">
                                ▣
                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-content">

                                <span>
                                    Total Users
                                </span>

                                <strong>
                                    {totalUsers}
                                </strong>

                                <small>
                                    ↗ Current total
                                </small>

                            </div>

                            <div className="stat-icon green">
                                ♙
                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-content">

                                <span>
                                    Active Tenants
                                </span>

                                <strong>
                                    {activeTenants}
                                </strong>

                                <small>
                                    ✓ Currently active
                                </small>

                            </div>

                            <div className="stat-icon blue">
                                ✓
                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-content">

                                <span>
                                    Inactive Tenants
                                </span>

                                <strong>
                                    {inactiveTenants}
                                </strong>

                                <small>
                                    ! Need attention
                                </small>

                            </div>

                            <div className="stat-icon red">
                                ×
                            </div>

                        </div>

                    </section>


                    <section className="dashboard-lower">

                        <div className="dashboard-panel">

                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Recent Tenants
                                    </h3>

                                    <p>
                                        Recently registered tenants
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        navigate(
                                            "/tenants"
                                        )
                                    }
                                >
                                    View All
                                </button>

                            </div>


                            <div className="recent-list">

                                {recentTenants.map(
                                    (
                                        tenant
                                    ) => (

                                        <div
                                            className="recent-item"
                                            key={
                                                tenant.id
                                            }
                                        >

                                            <div className="tenant-avatar">
                                                {tenant.name.charAt(
                                                    0
                                                )}
                                            </div>


                                            <div className="recent-info">

                                                <strong>
                                                    {tenant.name}
                                                </strong>

                                                <span>
                                                    {tenant.email}
                                                </span>

                                            </div>


                                            <span
                                                className={
                                                    `status-badge ${
                                                        tenant.status.toLowerCase()
                                                    }`
                                                }
                                            >
                                                {tenant.status}
                                            </span>

                                        </div>
                                    )
                                )}

                            </div>

                        </div>


                        <div className="dashboard-panel">

                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Quick Actions
                                    </h3>

                                    <p>
                                        Manage your platform
                                    </p>

                                </div>

                            </div>


                            <div className="quick-actions">

                                <button
                                    type="button"
                                    className="quick-action purple-action"
                                    onClick={() =>
                                        navigate(
                                            "/tenants"
                                        )
                                    }
                                >

                                    <span>
                                        ▣
                                    </span>

                                    <strong>
                                        Manage Tenants
                                    </strong>

                                </button>


                                <button
                                    type="button"
                                    className="quick-action green-action"
                                    onClick={() =>
                                        navigate(
                                            "/users"
                                        )
                                    }
                                >

                                    <span>
                                        ♙
                                    </span>

                                    <strong>
                                        Manage Users
                                    </strong>

                                </button>

                            </div>

                        </div>

                    </section>

                </>
            )}

        </main>
    );
}


export default Dashboard;