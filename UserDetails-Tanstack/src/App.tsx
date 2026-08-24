import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "./api";
import UserDetails from "./UserDetails";

function App() {
    const [selectedUserId, setSelectedUserId] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const {
        data: users,
        isLoading,
        isError
    } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers
    });

    if (isLoading) {
        return (
            <div className="message">
                Loading users...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="message error">
                Failed to load users.
            </div>
        );
    }

    const filteredUsers = users?.filter((user) =>
        user.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <main className="main-content">

            <h1>User Details</h1>

            <div className="content-layout">

                {/* Users List */}
                <section className="users-section">

                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                    <div className="users-list">

                        {filteredUsers?.map((user) => (

                            <div
                                className={`user-item ${
                                    selectedUserId === user.id
                                        ? "selected"
                                        : ""
                                }`}
                                key={user.id}
                            >

                                <div className="user-info">
                                    <h3>{user.name}</h3>

                                    <p>
                                        @{user.username}
                                    </p>
                                </div>

                                <button
                                    className="view-details"
                                    onClick={() =>
                                        setSelectedUserId(user.id)
                                    }
                                >
                                    View Details
                                    <span>→</span>
                                </button>

                            </div>

                        ))}

                    </div>

                </section>

                {/* User Details */}
                <section className="details-section">

                    <UserDetails
                        userId={selectedUserId}
                    />

                </section>

            </div>

        </main>
    );
}

export default App;