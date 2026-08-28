import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { createTenant } from "../api/tenantApi";

import type {
    Tenant,
    TenantPlan,
    TenantStatus,
} from "../types";


type TenantFormData = {
    name: string;
    email: string;
    phone: string;
    plan: TenantPlan;
    status: TenantStatus;
};


const PLANS: TenantPlan[] = [
    "Starter",
    "Professional",
    "Enterprise",
];


function AddTenant() {

    const navigate = useNavigate();

    const queryClient =
        useQueryClient();


    const [form, setForm] =
        useState<TenantFormData>({
            name: "",
            email: "",
            phone: "",
            plan: "Starter",
            status: "Active",
        });


    const [error, setError] =
        useState("");


    const createMutation =
        useMutation({
            mutationFn: (
                data: TenantFormData
            ) =>
                createTenant(data),

            onSuccess: (
                newTenant: Tenant
            ) => {

                /*
                 * Add the newly-created tenant
                 * to any currently cached tenant
                 * lists immediately.
                 */

                queryClient.setQueriesData(
                    {
                        queryKey: ["tenants"],
                    },
                    (
                        old:
                            | {
                                tenants: Tenant[];
                                total: number;
                                skip: number;
                                limit: number;
                            }
                            | undefined
                    ) => {

                        if (!old) {
                            return old;
                        }


                        return {
                            ...old,

                            tenants: [
                                ...old.tenants,
                                newTenant,
                            ],

                            total:
                                old.total + 1,
                        };
                    }
                );


                /*
                 * Dashboard uses its own query key,
                 * so mark it stale as well.
                 */

                void queryClient.invalidateQueries({
                    queryKey: [
                        "dashboard",
                        "tenants",
                    ],
                });


                /*
                 * Refresh the normal tenant query
                 * from the source of truth.
                 */

                void queryClient.invalidateQueries({
                    queryKey: ["tenants"],
                });


                /*
                 * Go back to the Tenant page.
                 */

                navigate("/tenants");
            },

            onError: (
                mutationError: Error
            ) => {

                setError(
                    mutationError.message ||
                    "Unable to create tenant."
                );
            },
        });


    const handleChange = (
        event:
            React.ChangeEvent<
                HTMLInputElement |
                HTMLSelectElement
            >
    ) => {

        const {
            name,
            value,
        } = event.target;


        setForm(
            previous => ({
                ...previous,

                [name]:
                    value,
            })
        );


        setError("");
    };


    const handleSubmit = (
        event:
            React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();


        const name =
            form.name.trim();

        const email =
            form.email.trim();

        const phone =
            form.phone.trim();


        if (!name) {

            setError(
                "Tenant name is required."
            );

            return;
        }


        if (!email) {

            setError(
                "Email is required."
            );

            return;
        }


        if (!email.includes("@")) {

            setError(
                "Please enter a valid email address."
            );

            return;
        }


        if (!phone) {

            setError(
                "Phone number is required."
            );

            return;
        }


        const submittedData: TenantFormData = {
            name,
            email,
            phone,
            plan: form.plan,
            status: form.status,
        };


        createMutation.mutate(
            submittedData
        );
    };


    const handleCancel = () => {

        navigate("/tenants");
    };


    return (
        <main
            style={{
                minHeight: "100%",
                padding: "40px",
                background: "#f6f8fc",
            }}
        >

            <div
                style={{
                    maxWidth: "850px",
                    margin: "0 auto",
                }}
            >

                {/* PAGE HEADER */}

                <div
                    style={{
                        marginBottom: "28px",
                    }}
                >

                    <h1
                        style={{
                            margin: 0,
                            fontSize: "32px",
                            fontWeight: 700,
                            color: "#14213d",
                        }}
                    >
                        Add Tenant
                    </h1>


                    <p
                        style={{
                            marginTop: "8px",
                            marginBottom: 0,
                            fontSize: "16px",
                            color: "#7b8aa5",
                        }}
                    >
                        Create a new tenant and configure
                        their subscription.
                    </p>

                </div>


                {/* FORM CARD */}

                <form
                    onSubmit={handleSubmit}
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e4e9f2",
                        borderRadius: "18px",
                        padding: "32px",
                        boxShadow:
                            "0 8px 30px rgba(20, 33, 61, 0.06)",
                    }}
                >

                    {/* ERROR */}

                    {error && (
                        <div
                            style={{
                                marginBottom: "24px",
                                padding: "14px 16px",
                                borderRadius: "10px",
                                background: "#fff1f2",
                                border:
                                    "1px solid #fecdd3",
                                color: "#dc2626",
                                fontSize: "14px",
                                fontWeight: 500,
                            }}
                        >
                            {error}
                        </div>
                    )}


                    {/* TENANT NAME */}

                    <div
                        style={{
                            marginBottom: "22px",
                        }}
                    >

                        <label
                            htmlFor="name"
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#40516f",
                            }}
                        >
                            Tenant Name
                        </label>


                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter tenant name"
                            disabled={
                                createMutation.isPending
                            }
                            style={{
                                width: "100%",
                                boxSizing: "border-box",
                                height: "52px",
                                padding:
                                    "0 16px",
                                border:
                                    "1px solid #d9e0ec",
                                borderRadius: "10px",
                                outline: "none",
                                fontSize: "15px",
                                color: "#17233d",
                                background: "#fff",
                            }}
                        />

                    </div>


                    {/* EMAIL + PHONE */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: "20px",
                            marginBottom: "22px",
                        }}
                    >

                        <div>

                            <label
                                htmlFor="email"
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#40516f",
                                }}
                            >
                                Email
                            </label>


                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="tenant@example.com"
                                disabled={
                                    createMutation.isPending
                                }
                                style={{
                                    width: "100%",
                                    boxSizing:
                                        "border-box",
                                    height: "52px",
                                    padding:
                                        "0 16px",
                                    border:
                                        "1px solid #d9e0ec",
                                    borderRadius:
                                        "10px",
                                    outline: "none",
                                    fontSize: "15px",
                                    color:
                                        "#17233d",
                                }}
                            />

                        </div>


                        <div>

                            <label
                                htmlFor="phone"
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#40516f",
                                }}
                            >
                                Phone
                            </label>


                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+1 555-0100"
                                disabled={
                                    createMutation.isPending
                                }
                                style={{
                                    width: "100%",
                                    boxSizing:
                                        "border-box",
                                    height: "52px",
                                    padding:
                                        "0 16px",
                                    border:
                                        "1px solid #d9e0ec",
                                    borderRadius:
                                        "10px",
                                    outline: "none",
                                    fontSize: "15px",
                                    color:
                                        "#17233d",
                                }}
                            />

                        </div>

                    </div>


                    {/* PLAN */}

                    <div
                        style={{
                            marginBottom: "22px",
                        }}
                    >

                        <label
                            htmlFor="plan"
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#40516f",
                            }}
                        >
                            Subscription Plan
                        </label>


                        <select
                            id="plan"
                            name="plan"
                            value={form.plan}
                            onChange={handleChange}
                            disabled={
                                createMutation.isPending
                            }
                            style={{
                                width: "100%",
                                height: "52px",
                                padding:
                                    "0 16px",
                                border:
                                    "1px solid #d9e0ec",
                                borderRadius:
                                    "10px",
                                outline: "none",
                                fontSize: "15px",
                                color:
                                    "#17233d",
                                background:
                                    "#ffffff",
                            }}
                        >

                            {PLANS.map(
                                plan => (
                                    <option
                                        key={plan}
                                        value={plan}
                                    >
                                        {plan}
                                    </option>
                                )
                            )}

                        </select>

                    </div>


                    {/* STATUS */}

                    <div
                        style={{
                            marginBottom: "30px",
                        }}
                    >

                        <label
                            htmlFor="status"
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#40516f",
                            }}
                        >
                            Status
                        </label>


                        <select
                            id="status"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            disabled={
                                createMutation.isPending
                            }
                            style={{
                                width: "100%",
                                height: "52px",
                                padding:
                                    "0 16px",
                                border:
                                    "1px solid #d9e0ec",
                                borderRadius:
                                    "10px",
                                outline: "none",
                                fontSize: "15px",
                                color:
                                    "#17233d",
                                background:
                                    "#ffffff",
                            }}
                        >

                            <option value="Active">
                                Active
                            </option>

                            <option value="Inactive">
                                Inactive
                            </option>

                        </select>

                    </div>


                    {/* BUTTONS */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                            gap: "12px",
                            paddingTop: "24px",
                            borderTop:
                                "1px solid #edf0f5",
                        }}
                    >

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={
                                createMutation.isPending
                            }
                            style={{
                                height: "48px",
                                padding:
                                    "0 24px",
                                border:
                                    "1px solid #d9e0ec",
                                borderRadius:
                                    "10px",
                                background:
                                    "#ffffff",
                                color:
                                    "#52627d",
                                fontSize: "15px",
                                fontWeight: 600,
                                cursor:
                                    createMutation.isPending
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                createMutation.isPending
                            }
                            style={{
                                height: "48px",
                                padding:
                                    "0 28px",
                                border: "none",
                                borderRadius:
                                    "10px",
                                background:
                                    "#6842ff",
                                color: "#ffffff",
                                fontSize: "15px",
                                fontWeight: 600,
                                cursor:
                                    createMutation.isPending
                                        ? "not-allowed"
                                        : "pointer",
                                opacity:
                                    createMutation.isPending
                                        ? 0.7
                                        : 1,
                            }}
                        >
                            {createMutation.isPending
                                ? "Creating..."
                                : "Add Tenant"}
                        </button>

                    </div>

                </form>

            </div>

        </main>
    );
}


export default AddTenant;