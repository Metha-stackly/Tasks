import {
    useMemo,
    useState,
} from "react";

import {
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    useNavigate,
} from "react-router-dom";

import {
    fetchTenants,
    deleteTenant,
} from "../api/tenantApi";

import type {
    Tenant,
    TenantStatus,
} from "../types";


function Tenants() {

    const navigate =
        useNavigate();

    const queryClient =
        useQueryClient();


    const [search, setSearch] =
        useState("");


    const [status, setStatus] =
        useState<
            "All" | TenantStatus
        >("All");


    const [page, setPage] =
        useState(1);


    const pageSize = 6;


    /* =================================================
       GET ALL TENANTS
    ================================================= */

    const query =
        useQuery({

            queryKey: [
                "tenants",
            ],

            queryFn: () =>
                fetchTenants(
                    1,
                    1000
                ),

            staleTime: 0,

            refetchOnMount:
                "always",

            refetchOnWindowFocus:
                true,
        });


    /* =================================================
       ALL TENANTS
    ================================================= */

    const allTenants =
        query.data?.tenants ??
        [];


    /* =================================================
       SEARCH + STATUS FILTER
    ================================================= */

    const filteredTenants =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            return allTenants.filter(
                (
                    tenant: Tenant
                ) => {

                    const matchesSearch =
                        searchValue === "" ||
                        tenant.name
                            .toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        tenant.email
                            .toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        String(
                            tenant.id
                        )
                            .includes(
                                searchValue
                            );


                    const matchesStatus =
                        status === "All" ||
                        tenant.status ===
                            status;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );

        }, [
            allTenants,
            search,
            status,
        ]);


    /* =================================================
       PAGINATION AFTER FILTERING
    ================================================= */

    const totalFiltered =
        filteredTenants.length;


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalFiltered /
                pageSize
            )
        );


    /*
     * Only show the six tenants belonging
     * to the current page.
     */

    const visibleTenants =
        useMemo(() => {

            const start =
                (page - 1) *
                pageSize;


            return filteredTenants.slice(
                start,
                start + pageSize
            );

        }, [
            filteredTenants,
            page,
        ]);


    /* =================================================
       DELETE
    ================================================= */

    const handleDelete =
        async (
            tenantId: number
        ) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this tenant?"
                );


            if (!confirmed) {
                return;
            }


            try {

                await deleteTenant(
                    tenantId
                );


                await queryClient.invalidateQueries({
                    queryKey: [
                        "tenants",
                    ],
                });


                /*
                 * If deleting the last tenant
                 * on a page, move back one page.
                 */

                if (
                    visibleTenants.length === 1 &&
                    page > 1
                ) {

                    setPage(
                        current =>
                            Math.max(
                                1,
                                current - 1
                            )
                    );
                }


                alert(
                    "Tenant deleted successfully."
                );

            } catch (error) {

                console.error(
                    "Delete tenant failed:",
                    error
                );

                alert(
                    "Failed to delete tenant."
                );
            }
        };


    /* =================================================
       SEARCH CHANGE
    ================================================= */

    const handleSearch =
        (
            value: string
        ) => {

            setSearch(
                value
            );

            /*
             * Always go back to page 1
             * when searching.
             */

            setPage(1);
        };


    /* =================================================
       STATUS CHANGE
    ================================================= */

    const handleStatus =
        (
            value:
                "All" | TenantStatus
        ) => {

            setStatus(
                value
            );

            setPage(1);
        };


    /* =================================================
       RESET
    ================================================= */

    const handleReset =
        () => {

            setSearch("");

            setStatus(
                "All"
            );

            setPage(1);
        };


    /* =================================================
       LOADING
    ================================================= */

    if (query.isLoading) {

        return (

            <main className="page tenants-page">

                <div className="loading-card">

                    Loading tenants...

                </div>

            </main>
        );
    }


    /* =================================================
       ERROR
    ================================================= */

    if (query.isError) {

        return (

            <main className="page tenants-page">

                <div className="error-card">

                    <h2>
                        Unable to load tenants
                    </h2>

                    <p>
                        Something went wrong
                        while loading tenants.
                    </p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            void query.refetch()
                        }
                    >
                        Try Again
                    </button>

                </div>

            </main>
        );
    }


    /* =================================================
       PAGE
    ================================================= */

    return (

        <main className="page tenants-page">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="page-header">

                <div>

                    <h2>
                        Tenant Management
                    </h2>

                    <p>
                        Manage your tenants and
                        their subscriptions
                    </p>

                </div>


                <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                        navigate(
                            "/tenants/add"
                        )
                    }
                >
                    + Add Tenant
                </button>

            </div>


            {/* =========================================
                FILTER
            ========================================= */}

            <section className="filter-card">


                {/* SEARCH */}

                <div className="filter-group">

                    <label>
                        Search Tenants
                    </label>

                    <input
                        type="text"
                        value={search}
                        onChange={
                            event =>
                                handleSearch(
                                    event.target.value
                                )
                        }
                        placeholder="Search by name or email..."
                    />

                </div>


                {/* STATUS */}

                <div className="filter-group">

                    <label>
                        Status
                    </label>

                    <select
                        value={status}
                        onChange={
                            event =>
                                handleStatus(
                                    event.target.value as
                                        "All" |
                                        TenantStatus
                                )
                        }
                    >

                        <option value="All">
                            All Status
                        </option>

                        <option value="Active">
                            Active
                        </option>

                        <option value="Inactive">
                            Inactive
                        </option>

                    </select>

                </div>


                {/* RESET */}

                <button
                    type="button"
                    className="secondary-button filter-reset"
                    onClick={
                        handleReset
                    }
                >
                    Reset
                </button>

            </section>


            {/* =========================================
                RESULT COUNT
            ========================================= */}

            <div className="list-heading">

                <span>

                    Showing{" "}

                    <strong>
                        {visibleTenants.length}
                    </strong>{" "}

                    of{" "}

                    <strong>
                        {totalFiltered}
                    </strong>{" "}

                    tenants

                </span>


                <span>

                    Page{" "}

                    <strong>
                        {page}
                    </strong>{" "}

                    of{" "}

                    <strong>
                        {totalPages}
                    </strong>

                </span>

            </div>


            {/* =========================================
                NO RESULTS
            ========================================= */}

            {visibleTenants.length === 0 ? (

                <div className="empty-state">

                    <div>

                        <h3>
                            No tenants found
                        </h3>

                        <p>
                            No tenant matches
                            your search.
                        </p>

                    </div>

                </div>

            ) : (

                /* =====================================
                   TENANT CARDS
                ===================================== */

                <section className="tenant-grid">

                    {visibleTenants.map(
                        (
                            tenant
                        ) => (

                            <article
                                className="tenant-card"
                                key={
                                    tenant.id
                                }
                            >

                                <div className="tenant-card-top">

                                    <div className="tenant-main">

                                        <div className="tenant-avatar">
                                                 {tenant.name.charAt(0).toUpperCase()}
                                            </div>

                                        <div>

                                            <h3>
                                                {tenant.name}
                                            </h3>

                                            <p>
                                                {tenant.email}
                                            </p>

                                        </div>

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


                                <div className="tenant-divider" />


                                <div className="tenant-meta">

                                    <div>

                                        <span>
                                            TENANT ID
                                        </span>

                                        <strong>
                                            #{tenant.id}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            USERS
                                        </span>

                                        <strong>
                                            {tenant.users}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            PLAN
                                        </span>

                                        <strong>
                                            {tenant.plan}
                                        </strong>

                                    </div>

                                </div>


                                <div className="tenant-actions">

                                    <button
                                        type="button"
                                        className="view-button"
                                        onClick={() =>
                                            navigate(
                                                `/tenants/${tenant.id}`
                                            )
                                        }
                                    >
                                        View
                                    </button>


                                    <button
                                        type="button"
                                        className="edit-button"
                                        onClick={() =>
                                            alert(
                                                `Edit ${tenant.name}`
                                            )
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        type="button"
                                        className="delete-button"
                                        onClick={() =>
                                            void handleDelete(
                                                tenant.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </article>
                        )
                    )}

                </section>
            )}


            {/* =========================================
                PAGINATION
            ========================================= */}

            {totalPages > 1 && (

                <div className="pagination">


                    <button
                        type="button"
                        disabled={
                            page === 1
                        }
                        onClick={() =>
                            setPage(
                                current =>
                                    Math.max(
                                        1,
                                        current - 1
                                    )
                            )
                        }
                    >
                        Previous
                    </button>


                    {Array.from(
                        {
                            length:
                                totalPages,
                        },
                        (
                            _,
                            index
                        ) => {

                            const pageNumber =
                                index + 1;


                            return (

                                <button
                                    type="button"
                                    key={
                                        pageNumber
                                    }
                                    className={
                                        page ===
                                        pageNumber
                                            ? "current"
                                            : ""
                                    }
                                    onClick={() =>
                                        setPage(
                                            pageNumber
                                        )
                                    }
                                >
                                    {pageNumber}
                                </button>

                            );
                        }
                    )}


                    <button
                        type="button"
                        disabled={
                            page ===
                            totalPages
                        }
                        onClick={() =>
                            setPage(
                                current =>
                                    Math.min(
                                        totalPages,
                                        current + 1
                                    )
                            )
                        }
                    >
                        Next
                    </button>

                </div>
            )}

        </main>
    );
}


export default Tenants;