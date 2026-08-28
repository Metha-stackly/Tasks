import {
    useQuery,
} from "@tanstack/react-query";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    fetchTenant,
    fetchTenantUsers,
} from "../api/tenantApi";


function TenantDetails() {

    const {
        tenantId,
    } = useParams();


    const navigate =
        useNavigate();


    const id =
        Number(
            tenantId
        );


    const tenantQuery =
        useQuery({

            queryKey: [
                "tenant",
                id,
            ],

            queryFn: () =>
                fetchTenant(id),

            enabled:
                Number.isFinite(id),
        });


    const usersQuery =
        useQuery({

            queryKey: [
                "tenant-users",
                id,
            ],

            queryFn: () =>
                fetchTenantUsers(id),

            enabled:
                Number.isFinite(id),
        });


    if (
        tenantQuery.isLoading ||
        usersQuery.isLoading
    ) {

        return (

            <main className="page">

                <div className="loading-card">
                    Loading tenant...
                </div>

            </main>
        );
    }


    if (
        tenantQuery.isError ||
        !tenantQuery.data
    ) {

        return (

            <main className="page">

                <div className="error-card">

                    <h2>
                        Tenant not found
                    </h2>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate(
                                "/tenants"
                            )
                        }
                    >
                        Back to Tenants
                    </button>

                </div>

            </main>
        );
    }


    const tenant =
        tenantQuery.data;


    const users =
        usersQuery.data ??
        [];


    return (

        <main className="page tenant-details-page">

            <button
                type="button"
                className="back-button"
                onClick={() =>
                    navigate(
                        "/tenants"
                    )
                }
            >
                ← Back to Tenants
            </button>


            <div className="page-header detail-header">

                <div>

                    <h2>
                        {tenant.name}
                    </h2>

                    <p>
                        Tenant details and users
                    </p>

                </div>

            </div>


            <section className="tenant-detail-card">

                <div className="detail-main">

                    <div className="tenant-avatar detail-avatar">
                        T
                    </div>


                    <div>

                        <h3>
                            {tenant.name}
                        </h3>

                        <p>
                            Tenant #{tenant.id}
                        </p>

                    </div>


                    <span
                        className={
                            `status-badge detail-status ${
                                tenant.status.toLowerCase()
                            }`
                        }
                    >
                        {tenant.status}
                    </span>

                </div>


                <div className="tenant-detail-divider" />


                <div className="detail-information">

                    <div>

                        <span>
                            Email
                        </span>

                        <strong>
                            {tenant.email}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Phone
                        </span>

                        <strong>
                            {tenant.phone}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Plan
                        </span>

                        <strong>
                            {tenant.plan}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Users
                        </span>

                        <strong>
                            {tenant.users}
                        </strong>

                    </div>

                </div>

            </section>


            <section className="users-panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            Tenant Users
                        </h3>

                        <p>
                            Users belonging to {tenant.name}
                        </p>

                    </div>


                    <span className="count-badge">
                        {users.length}
                    </span>

                </div>


                {users.length === 0 ? (

                    <div className="empty-state">
                        No users found for this tenant.
                    </div>

                ) : (

                    <div className="tenant-users-list">

                        {users.map(
                            (
                                user
                            ) => (

                                <div
                                    className="tenant-user-row"
                                    key={
                                        user.id
                                    }
                                >

                                    <div className="user-cell">

                                        <img
                                            src={
                                                user.image
                                            }
                                            alt=""
                                        />

                                        <div>

                                            <strong>
                                                {
                                                    user.firstName
                                                }{" "}
                                                {
                                                    user.lastName
                                                }
                                            </strong>

                                            <span>
                                                #{user.id}
                                            </span>

                                        </div>

                                    </div>


                                    <div className="email-cell">
                                        {user.email}
                                    </div>


                                    <div>

                                        <span className="role-badge">
                                            {user.role}
                                        </span>

                                    </div>


                                    <div>

                                        <span
                                            className={
                                                `status-badge ${
                                                    user.status.toLowerCase()
                                                }`
                                            }
                                        >
                                            {user.status}
                                        </span>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </section>

        </main>
    );
}


export default TenantDetails;