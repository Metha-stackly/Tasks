import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "./api";

function Users() {

    const [searchTerm, setSearchTerm] = useState("");

    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers
    });

    if (isLoading) {
        return <p>Loading users...</p>;
    }

    if (isError) {
        return <p>Error: {error.message}</p>;
    }

    const filteredUsers = data?.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
return (
    <div className="users-page">

        <h1>Users</h1>

        <div className="controls">
            <input
                type="text"
                placeholder="Search users by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button onClick={() => refetch()}>
                Refetch Users
            </button>
        </div>

        <div className="users-list">
            {filteredUsers?.map((user) => (
                <div className="user-card" key={user.id}>
                    <h3>{user.name}</h3>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <p>Phone: {user.phone}</p>
                    <p>City: {user.address.city}</p>
                </div>
            ))}
        </div>

    </div>
);}
export default Users;