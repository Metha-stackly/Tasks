export type UserStatus =
    | "Active"
    | "Inactive"
    | "Suspended";


export type TenantStatus =
    | "Active"
    | "Inactive";


export type TenantPlan =
    | "Starter"
    | "Professional"
    | "Enterprise";


export interface UserAddress {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}


export interface UserCompany {
    department: string;
    name: string;
    title: string;
}


export interface User {
    id: number;

    firstName: string;
    lastName: string;

    email: string;
    phone: string;

    image: string;

    role: string;

    tenantId: number;
    tenantName: string;

    status: UserStatus;

    address: UserAddress;

    company: UserCompany;
}


export interface UserResponse {
    users: User[];
    total: number;
    skip: number;
    limit: number;
}


export interface Tenant {
    id: number;

    name: string;

    email: string;
    phone: string;

    plan: TenantPlan;

    users: number;

    status: TenantStatus;

    createdAt: string;
}


export interface TenantResponse {
    tenants: Tenant[];

    total: number;

    skip: number;

    limit: number;
}