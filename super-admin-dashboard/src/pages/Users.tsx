import {
    useMemo,
    useState,
} from "react";

import {
    useQuery,
} from "@tanstack/react-query";

import {
    useNavigate,
} from "react-router-dom";

import {
    fetchUsers,
} from "../api/userApi";


function Users() {

    const navigate =
        useNavigate();


    /* =================================================
       SEARCH
    ================================================= */

    const [
        search,
        setSearch,
    ] = useState("");


    /* =================================================
       TENANT FILTER
    ================================================= */

    const [
        tenantFilter,
        setTenantFilter,
    ] = useState("All");


    /* =================================================
       STATUS FILTER
    ================================================= */

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("All");


    /* =================================================
       PAGE
    ================================================= */

    const [
        page,
        setPage,
    ] = useState(1);


    const pageSize =
        10;


    /* =================================================
       FETCH USERS
    ================================================= */

    const query =
        useQuery({

            queryKey: [
                "users",
                page,
            ],

            queryFn: () =>
                fetchUsers(
                    page,
                    pageSize
                ),

        });


    /* =================================================
       USERS
    ================================================= */

    const users =
        query.data?.users ??
        [];


    /* =================================================
       FILTER USERS
    ================================================= */

    const filteredUsers =
        useMemo(() => {

            return users.filter(
                (user) => {

                    const fullName =
                        `${user.firstName} ${user.lastName}`
                            .toLowerCase();


                    const searchValue =
                        search
                            .toLowerCase()
                            .trim();


                    const matchesSearch =
                        searchValue === "" ||
                        fullName.includes(
                            searchValue
                        ) ||
                        user.email
                            .toLowerCase()
                            .includes(
                                searchValue
                            );


                    const matchesTenant =
                        tenantFilter ===
                            "All" ||
                        user.tenantId
                            .toString() ===
                            tenantFilter;


                    const matchesStatus =
                        statusFilter ===
                            "All" ||
                        user.status ===
                            statusFilter;


                    return (
                        matchesSearch &&
                        matchesTenant &&
                        matchesStatus
                    );
                }
            );

        }, [
            users,
            search,
            tenantFilter,
            statusFilter,
        ]);


    /* =================================================
       TOTAL
    ================================================= */

    const total =
        query.data?.total ??
        100;


    /* =================================================
       TOTAL PAGES
    ================================================= */

    const totalPages =
        Math.ceil(
            total /
            pageSize
        );


    /* =================================================
       PAGINATION
    ================================================= */

    const getPaginationItems =
        () => {

            const items: (
                number | string
            )[] = [];


            /*
             * If there are 7 or fewer pages,
             * show every page.
             */

            if (
                totalPages <= 7
            ) {

                for (
                    let i = 1;
                    i <= totalPages;
                    i++
                ) {

                    items.push(i);

                }

                return items;
            }


            /*
             * First page.
             */

            items.push(1);


            /*
             * Near beginning.
             *
             * Example:
             * 1 2 3 4 ... 10
             */

            if (
                page <= 4
            ) {

                items.push(2);
                items.push(3);
                items.push(4);
                items.push("...");
                items.push(totalPages);

                return items;
            }


            /*
             * Near end.
             *
             * Example:
             * 1 ... 7 8 9 10
             */

            if (
                page >=
                totalPages - 3
            ) {

                items.push("...");

                items.push(
                    totalPages - 3
                );

                items.push(
                    totalPages - 2
                );

                items.push(
                    totalPages - 1
                );

                items.push(
                    totalPages
                );

                return items;
            }


            /*
             * Middle of pagination.
             *
             * Example:
             * 1 ... 4 5 6 ... 10
             */

            items.push("...");

            items.push(
                page - 1
            );

            items.push(
                page
            );

            items.push(
                page + 1
            );

            items.push("...");

            items.push(
                totalPages
            );


            return items;
        };


    /* =================================================
       PAGINATION ITEMS
    ================================================= */

    const paginationItems =
        getPaginationItems();


    /* =================================================
       PAGE
    ================================================= */

    return (

        <main className="page users-page">


            {/* =========================================
                PAGE HEADER
            ========================================= */}

            <div className="page-header">

                <div>

                    <h2>
                        User Management
                    </h2>

                    <p>
                        Manage users across all tenants
                    </p>

                </div>

            </div>


            {/* =========================================
                FILTER CARD
            ========================================= */}

            <section
                className="filter-card user-filter-card"
            >


                {/* SEARCH */}

                <div className="filter-group">

                    <label>
                        Search User
                    </label>

                    <input
                        type="text"
                        value={search}
                        onChange={(
                            event
                        ) => {

                            setSearch(
                                event.target.value
                            );

                            setPage(1);

                        }}
                        placeholder="Search by name or email..."
                    />

                </div>


                {/* TENANT */}

                <div className="filter-group">

                    <label>
                        Tenant
                    </label>

                    <select
                        value={
                            tenantFilter
                        }
                        onChange={(
                            event
                        ) => {

                            setTenantFilter(
                                event.target.value
                            );

                            setPage(1);

                        }}
                    >

                        <option value="All">
                            All Tenants
                        </option>


                        {Array.from(
                            {
                                length: 30,
                            },
                            (
                                _,
                                index
                            ) => (

                                <option
                                    key={
                                        index + 1
                                    }
                                    value={
                                        String(
                                            index + 1
                                        )
                                    }
                                >
                                    Tenant{" "}
                                    {index + 1}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* STATUS */}

                <div className="filter-group">

                    <label>
                        Status
                    </label>

                    <select
                        value={
                            statusFilter
                        }
                        onChange={(
                            event
                        ) => {

                            setStatusFilter(
                                event.target.value
                            );

                            setPage(1);

                        }}
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

                        <option value="Suspended">
                            Suspended
                        </option>

                    </select>

                </div>


                {/* RESET */}

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {

                        setSearch("");

                        setTenantFilter(
                            "All"
                        );

                        setStatusFilter(
                            "All"
                        );

                        setPage(1);

                    }}
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
                        {filteredUsers.length}
                    </strong>{" "}

                    of{" "}

                    <strong>
                        {total}
                    </strong>{" "}

                    users

                </span>

            </div>


            {/* =========================================
                LOADING
            ========================================= */}

            {query.isLoading ? (

                <div className="loading-card">

                    Loading users...

                </div>

            ) : query.isError ? (

                <div className="loading-card">

                    Unable to load users.

                </div>

            ) : (

                <section
                    className="users-table-card"
                >

                    <div
                        className="users-table"
                    >


                        {/* =================================
                            TABLE HEADER
                        ================================= */}

                        <div
                            className="users-table-header"
                        >

                            <span>
                                User
                            </span>

                            <span>
                                Email
                            </span>

                            <span>
                                Tenant
                            </span>

                            <span>
                                Role
                            </span>

                            <span>
                                Status
                            </span>

                            <span>
                                Action
                            </span>

                        </div>


                        {/* =================================
                            USER ROWS
                        ================================= */}

                        {filteredUsers.length === 0 ? (

                            <div
                                className="empty-state"
                            >

                                <h3>
                                    No users found
                                </h3>

                                <p>
                                    Try changing your
                                    search or filters.
                                </p>

                            </div>

                        ) : (

                            filteredUsers.map(
                                (
                                    user
                                ) => (

                                    <div
                                        className="user-table-row"
                                        key={
                                            user.id
                                        }
                                    >


                                        {/* USER */}

                                        <div
                                            className="user-cell"
                                        >

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


                                        {/* EMAIL */}

                                        <div
                                            className="email-cell"
                                        >
                                            {
                                                user.email
                                            }
                                        </div>


                                        {/* TENANT */}

                                        <div>

                                            <span
                                                className="tenant-badge"
                                            >
                                                Tenant{" "}
                                                {
                                                    user.tenantId
                                                }
                                            </span>

                                        </div>


                                        {/* ROLE */}

                                        <div>

                                            <span
                                                className="role-badge"
                                            >
                                                {
                                                    user.role
                                                }
                                            </span>

                                        </div>


                                        {/* STATUS */}

                                        <div>

                                            <span
                                                className={
                                                    `status-badge ${
                                                        user.status.toLowerCase()
                                                    }`
                                                }
                                            >
                                                {
                                                    user.status
                                                }
                                            </span>

                                        </div>


                                        {/* ACTION */}

                                        <div>

                                            <button
                                                type="button"
                                                className="view-button small"
                                                onClick={() =>
                                                    navigate(
                                                        `/users/${user.id}`
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                        </div>


                                    </div>

                                )
                            )

                        )}

                    </div>

                </section>

            )}


            {/* =========================================
                PAGINATION
            ========================================= */}

            {totalPages > 1 && (

                <div
                    className="pagination"
                >


                    {/* PREVIOUS */}

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


                    {/* PAGE NUMBERS */}

                    {paginationItems.map(
                        (
                            item,
                            index
                        ) => {


                            /*
                             * Ellipsis
                             */

                            if (
                                item === "..."
                            ) {

                                return (

                                    <span
                                        key={
                                            `ellipsis-${index}`
                                        }
                                        className="pagination-ellipsis"
                                    >
                                        ...
                                    </span>

                                );
                            }


                            /*
                             * Page button
                             */

                            return (

                                <button
                                    type="button"
                                    key={
                                        `page-${item}`
                                    }
                                    className={
                                        page === item
                                            ? "current"
                                            : ""
                                    }
                                    onClick={() =>
                                        setPage(
                                            item as number
                                        )
                                    }
                                >
                                    {
                                        item
                                    }
                                </button>

                            );

                        }
                    )}


                    {/* NEXT */}

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


export default Users;