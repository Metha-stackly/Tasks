import {
    useQuery,
} from "@tanstack/react-query";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    fetchUser,
} from "../api/userApi";


function UserDetails() {

    const {
        userId,
    } = useParams();


    const navigate =
        useNavigate();


    const id =
        Number(
            userId
        );


    const query =
        useQuery({

            queryKey: [
                "user",
                id,
            ],

            queryFn: () =>
                fetchUser(id),

            enabled:
                Number.isFinite(id),
        });


    if (query.isLoading) {

        return (

            <main className="page">

                <div className="loading-card">
                    Loading user...
                </div>

            </main>
        );
    }


    if (
        query.isError ||
        !query.data
    ) {

        return (

            <main className="page">

                <div className="error-card">

                    <h2>
                        User not found
                    </h2>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            navigate(
                                "/users"
                            )
                        }
                    >
                        Back to Users
                    </button>

                </div>

            </main>
        );
    }


    const user =
        query.data;


    return (

        <main className="page user-details-page">

            <button
                type="button"
                className="back-button"
                onClick={() =>
                    navigate(
                        "/users"
                    )
                }
            >
                ← Back to Users
            </button>


            <div className="page-header">

                <div>

                    <h2>
                        User Details
                    </h2>

                    <p>
                        View user information
                    </p>

                </div>

            </div>


            <section className="user-detail-card">

                <div className="user-detail-header">

                    <img
                        src={
                            user.image
                        }
                        alt={
                            `${user.firstName} ${user.lastName}`
                        }
                    />


                    <div>

                        <h3>
                            {
                                user.firstName
                            }{" "}
                            {
                                user.lastName
                            }
                        </h3>

                        <p>
                            {user.email}
                        </p>

                        <span className="tenant-badge">
                            Tenant{" "}
                            {user.tenantId}
                        </span>

                    </div>


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


                <div className="tenant-detail-divider" />


                <div className="user-information-grid">

                    <div>

                        <span>
                            First Name
                        </span>

                        <strong>
                            {user.firstName}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Last Name
                        </span>

                        <strong>
                            {user.lastName}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Email
                        </span>

                        <strong>
                            {user.email}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Phone
                        </span>

                        <strong>
                            {user.phone}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Role
                        </span>

                        <strong>
                            {user.role}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Tenant
                        </span>

                        <strong>
                            Tenant{" "}
                            {user.tenantId}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Company
                        </span>

                        <strong>
                            {user.company.name}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Job Title
                        </span>

                        <strong>
                            {user.company.title}
                        </strong>

                    </div>

                </div>


                <div className="address-section">

                    <h3>
                        Address
                    </h3>

                    <p>
                        {user.address.address},{" "}
                        {user.address.city},{" "}
                        {user.address.state},{" "}
                        {user.address.postalCode},{" "}
                        {user.address.country}
                    </p>

                </div>

            </section>

        </main>
    );
}


export default UserDetails;