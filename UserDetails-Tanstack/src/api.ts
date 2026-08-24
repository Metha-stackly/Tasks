import type { User } from "./types";

export async function fetchUsers(): Promise<User[]> {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
    );

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    const data: User[] = await response.json();

    return data;
}

export async function fetchUserById(
    userId: number
): Promise<User> {

    const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    const data: User = await response.json();

    return data;
}