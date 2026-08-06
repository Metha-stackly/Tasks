const API_URL = "https://jsonplaceholder.typicode.com/users";

export async function getEmployees() {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch employees");
    }

    const apiEmployees = await response.json();

    const localEmployees =
        JSON.parse(localStorage.getItem("employees")) || [];

    return [...apiEmployees, ...localEmployees];

}