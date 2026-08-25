import { useState } from "react";

import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import {
    createTodo,
    deleteTodo,
    fetchTodos
} from "./api";

import type { Todo } from "./types";

import "./App.css";


function App() {

    /* =========================
       FORM STATE
    ========================= */

    const [title, setTitle] = useState("");

    const [completed, setCompleted] =
        useState(false);


    /* =========================
       DELETE STATE
    ========================= */

    const [deletingTodoId, setDeletingTodoId] =
        useState<number | null>(null);


    /* =========================
       QUERY CLIENT
    ========================= */

    const queryClient =
        useQueryClient();


    /* =========================
       FETCH TODOS
    ========================= */

    const {
        data: todos,
        isLoading,
        isError,
        error
    } = useQuery<Todo[], Error>({
        queryKey: ["todos"],
        queryFn: fetchTodos
    });


    /* =========================
       CREATE TODO MUTATION
    ========================= */

    const createMutation = useMutation<
        Todo,
        Error,
        Omit<Todo, "id">
    >({

        mutationFn: createTodo,

        onSuccess: (newTodo) => {

            /*
             * Add the newly created todo
             * to the current cached list.
             */

            queryClient.setQueryData<Todo[]>(
                ["todos"],
                (oldTodos = []) => {

                    return [
                        newTodo,
                        ...oldTodos
                    ].slice(0, 20);

                }
            );


            // Clear form after successful creation
            setTitle("");
            setCompleted(false);
        }
    });


    /* =========================
       DELETE TODO MUTATION
    ========================= */

    const deleteMutation = useMutation<
        void,
        Error,
        number
    >({

        mutationFn: deleteTodo,

        onMutate: (todoId) => {

            setDeletingTodoId(todoId);
        },

        onSuccess: (_, todoId) => {

            /*
             * Remove the todo from the
             * currently displayed cache.
             */

            queryClient.setQueryData<Todo[]>(
                ["todos"],
                (oldTodos = []) =>
                    oldTodos.filter(
                        (todo) => todo.id !== todoId
                    )
            );


            /*
             * Mark the todos query as stale.
             *
             * JSONPlaceholder is a mock API,
             * so the DELETE operation does not
             * permanently change its GET response.
             */

            queryClient.invalidateQueries({
                queryKey: ["todos"],
                refetchType: "none"
            });
        },

        onSettled: () => {

            setDeletingTodoId(null);
        }
    });


    /* =========================
       FORM SUBMIT
    ========================= */

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();


        if (!title.trim()) {
            return;
        }


        createMutation.mutate({

            userId: 1,

            title: title.trim(),

            completed: completed
        });
    };


    /* =========================
       DELETE HANDLER
    ========================= */

    const handleDelete = (
        todoId: number
    ) => {

        deleteMutation.mutate(todoId);
    };


    /* =========================
       LOADING
    ========================= */

    if (isLoading) {

        return (
            <div className="page-center">

                <div className="loader"></div>

                <p>
                    Loading todos...
                </p>

            </div>
        );
    }


    /* =========================
       ERROR
    ========================= */

    if (isError) {

        return (
            <div className="page-center error-page">

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error.message}
                </p>

            </div>
        );
    }


    /* =========================
       UI
    ========================= */

    return (

        <main className="app">

            <div className="container">


                {/* =========================
                    PAGE HEADER
                ========================= */}

                <header className="page-header">

                    <div>

                        <p className="eyebrow">
                            TanStack Query
                        </p>

                        <h1>
                            Todo Management
                        </h1>

                        <p className="subtitle">
                            Create and manage your todos
                        </p>

                    </div>

                </header>


                {/* =========================
                    CREATE TODO
                ========================= */}

                <section className="create-section">

                    <div className="section-heading">

                        <h2>
                            Create a Todo
                        </h2>

                        <p>
                            Add a new todo to your list.
                        </p>

                    </div>


                    <form
                        className="todo-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label htmlFor="todo-title">
                                Todo Title
                            </label>

                            <input
                                id="todo-title"
                                type="text"
                                placeholder="Enter todo title..."
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                            />

                        </div>


                        <label className="checkbox-container">

                            <input
                                type="checkbox"
                                checked={completed}
                                onChange={(event) =>
                                    setCompleted(
                                        event.target.checked
                                    )
                                }
                            />

                            <span>
                                Completed
                            </span>

                        </label>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={
                                createMutation.isPending ||
                                !title.trim()
                            }
                        >

                            {createMutation.isPending
                                ? "Adding..."
                                : "Add Todo"
                            }

                        </button>

                    </form>


                    {/* CREATE ERROR */}

                    {createMutation.isError && (

                        <div className="message error-message">

                            {createMutation.error.message}

                        </div>
                    )}


                    {/* CREATE SUCCESS */}

                    {createMutation.isSuccess && (

                        <div className="message success-message">

                            Todo created successfully.

                        </div>
                    )}

                </section>


                {/* =========================
                    TODO LIST
                ========================= */}

                <section className="list-section">

                    <div className="list-header">

                        <div>

                            <h2>
                                Todo List
                            </h2>

                            <p>
                                Showing the first 20 todos
                            </p>

                        </div>

                        <span className="todo-count">
                            {todos?.length ?? 0}
                        </span>

                    </div>


                    <div className="todo-list">

                        {todos?.map((todo) => (

                            <article
                                className="todo-card"
                                key={todo.id}
                            >

                                <div className="todo-content">

                                    <h3>
                                        {todo.title}
                                    </h3>


                                    <span
                                        className={
                                            todo.completed
                                                ? "status completed"
                                                : "status pending"
                                        }
                                    >

                                        {todo.completed
                                            ? "Completed"
                                            : "Pending"
                                        }

                                    </span>

                                </div>


                                <button
                                    type="button"
                                    className="delete-button"
                                    disabled={
                                        deletingTodoId ===
                                        todo.id
                                    }
                                    onClick={() =>
                                        handleDelete(
                                            todo.id
                                        )
                                    }
                                >

                                    {deletingTodoId ===
                                    todo.id
                                        ? "Deleting..."
                                        : "Delete"
                                    }

                                </button>

                            </article>

                        ))}

                    </div>


                    {/* DELETE ERROR */}

                    {deleteMutation.isError && (

                        <div className="message error-message">

                            {deleteMutation.error.message}

                        </div>
                    )}


                    {/* DELETE SUCCESS */}

                    {deleteMutation.isSuccess && (

                        <div className="message success-message">

                            Todo deleted successfully.

                        </div>
                    )}

                </section>

            </div>

        </main>
    );
}

export default App;