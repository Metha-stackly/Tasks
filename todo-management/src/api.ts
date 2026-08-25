import type { Todo } from "./types";

const API_URL =
    "https://jsonplaceholder.typicode.com/todos";

/* =========================
   CREATE TODO
========================= */

export async function createTodo(
    todo: Omit<Todo, "id">
): Promise<Todo> {

    const response = await fetch(API_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(todo),
    });

    if (!response.ok) {
        throw new Error("Failed to create todo");
    }

    const data: Todo = await response.json();

    return data;
}


/* =========================
   FETCH TODOS
========================= */

export async function fetchTodos(): Promise<Todo[]> {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch todos");
    }

    const data: Todo[] = await response.json();

    // Task requires first 20 todos
    return data.slice(0, 20);
}


/* =========================
   DELETE TODO
========================= */

export async function deleteTodo(
    todoId: number
): Promise<void> {

    const response = await fetch(
        `${API_URL}/${todoId}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete todo");
    }
}