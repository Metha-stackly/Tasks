import type {
    Tenant,
    TenantPlan,
    TenantResponse,
    TenantStatus,
    User,
} from "../types";

import { fetchUsers } from "./userApi";

/* =========================================================
   CONSTANTS
========================================================= */

const STORAGE_KEY = "super_admin_tenants";

const TENANT_NAMES: string[] = [
    "CloudSphere Inc",
    "DataVault LLC",
    "TechNova Corp",
    "SkyBridge Ltd",
    "QuantumLeap Group",
    "InnoCore Inc",
    "Nexora Technologies",
    "BrightPath Solutions",
    "Vertex Systems",
    "BluePeak Digital",
    "AlphaWave Labs",
    "GreenField Tech",
    "PrimeStack Solutions",
    "NovaLink Systems",
    "SilverLine Corp",
    "CodeCraft Technologies",
    "FutureGrid Inc",
    "ApexCore Ltd",
    "PixelForge Labs",
    "UrbanByte Solutions",
    "NextGen Works",
    "CyberNest Technologies",
    "CloudMatrix Corp",
    "RapidScale Systems",
    "SmartEdge Solutions",
    "InfinityWorks Ltd",
    "DigitalOrbit Inc",
    "CoreVista Technologies",
    "VisionPoint Labs",
    "TechBridge Solutions",
];

const PLANS: TenantPlan[] = [
    "Starter",
    "Professional",
    "Enterprise",
];

/* =========================================================
   TYPES
========================================================= */

export interface CreateTenantData {
    name: string;
    email: string;
    phone: string;
    plan: TenantPlan;
    status: TenantStatus;
}

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function getTenantStatus(id: number): TenantStatus {
    return id % 4 === 0
        ? "Inactive"
        : "Active";
}

function getTenantPlan(id: number): TenantPlan {
    return PLANS[
        (id - 1) % PLANS.length
    ];
}

function getCreatedDate(id: number): string {
    const year = 2025 + (id % 2);

    const month = String(
        ((id - 1) % 12) + 1
    ).padStart(2, "0");

    const day = String(
        ((id * 3) % 27) + 1
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/* =========================================================
   LOCAL STORAGE
========================================================= */

function getSavedTenants(): Tenant[] {
    try {
        const stored =
            localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed as Tenant[];
    } catch (error) {
        console.error(
            "Failed to read saved tenants:",
            error
        );

        return [];
    }
}

function saveTenants(
    tenants: Tenant[]
): void {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tenants)
        );
    } catch (error) {
        console.error(
            "Failed to save tenants:",
            error
        );
    }
}

/* =========================================================
   GENERATE DEFAULT TENANTS
========================================================= */

async function getDefaultTenants(): Promise<Tenant[]> {
    const userResponse =
        await fetchUsers(
            1,
            100
        );

    const users =
        userResponse.users;

    return TENANT_NAMES.map(
        (
            name,
            index
        ) => {
            const id =
                index + 1;

            const tenantUsers =
                users.filter(
                    (user: User) =>
                        user.tenantId === id
                );

            const firstUser =
                tenantUsers[0];

            return {
                id,

                name,

                email:
                    firstUser?.email ??
                    `tenant${id}@example.com`,

                phone:
                    firstUser?.phone ??
                    "+1 555-0100",

                plan:
                    getTenantPlan(id),

                users:
                    tenantUsers.length,

                status:
                    getTenantStatus(id),

                createdAt:
                    getCreatedDate(id),
            };
        }
    );
}

/* =========================================================
   GET ALL TENANTS
========================================================= */

export async function fetchTenants(
    page: number = 1,
    limit: number = 6
): Promise<TenantResponse> {

    const defaultTenants =
        await getDefaultTenants();

    const savedTenants =
        getSavedTenants();

    /*
     * Default tenants have IDs 1-30.
     * Saved tenants are normally newly-created
     * tenants with IDs greater than 30.
     */

    const defaultIds =
        new Set(
            defaultTenants.map(
                tenant => tenant.id
            )
        );

    const newTenants =
        savedTenants.filter(
            tenant =>
                !defaultIds.has(
                    tenant.id
                )
        );

    /*
     * Keep the original 30 tenants and then
     * append newly-created tenants.
     */

    const allTenants: Tenant[] = [
        ...defaultTenants,
        ...newTenants,
    ];

    const skip =
        (page - 1) * limit;

    const paginatedTenants =
        allTenants.slice(
            skip,
            skip + limit
        );

    return {
        tenants:
            paginatedTenants,

        total:
            allTenants.length,

        skip,

        limit,
    };
}

/* =========================================================
   GET SINGLE TENANT
========================================================= */

export async function fetchTenant(
    tenantId: number
): Promise<Tenant> {

    const response =
        await fetchTenants(
            1,
            1000
        );

    const tenant =
        response.tenants.find(
            item =>
                item.id === tenantId
        );

    if (!tenant) {
        throw new Error(
            "Tenant not found"
        );
    }

    return tenant;
}

/* =========================================================
   GET TENANT USERS
========================================================= */

export async function fetchTenantUsers(
    tenantId: number
): Promise<User[]> {

    const response =
        await fetchUsers(
            1,
            100
        );

    return response.users.filter(
        (user: User) =>
            user.tenantId === tenantId
    );
}

/* =========================================================
   CREATE TENANT
========================================================= */

export async function createTenant(
    data: CreateTenantData
): Promise<Tenant> {

    /*
     * Get current tenants so that the new
     * tenant receives a unique ID.
     */

    const response =
        await fetchTenants(
            1,
            1000
        );

    const currentTenants =
        response.tenants;

    const highestId =
        currentTenants.length > 0
            ? Math.max(
                ...currentTenants.map(
                    tenant =>
                        tenant.id
                )
            )
            : 0;

    const newTenantId =
        highestId + 1;

    const newTenant: Tenant = {
        id:
            newTenantId,

        name:
            data.name.trim(),

        email:
            data.email.trim(),

        phone:
            data.phone.trim(),

        plan:
            data.plan,

        users:
            0,

        status:
            data.status,

        createdAt:
            new Date()
                .toISOString()
                .split("T")[0],
    };

    /*
     * Save only the custom tenants.
     */

    const savedTenants =
        getSavedTenants();

    saveTenants([
        ...savedTenants,
        newTenant,
    ]);

    return newTenant;
}

/* =========================================================
   UPDATE TENANT
========================================================= */

export async function updateTenant(
    tenantId: number,
    changes: Partial<Tenant>
): Promise<Tenant> {

    const currentTenant =
        await fetchTenant(
            tenantId
        );

    const updatedTenant: Tenant = {
        ...currentTenant,
        ...changes,
        id: tenantId,
    };

    const savedTenants =
        getSavedTenants();

    const defaultTenant =
        TENANT_NAMES[
            tenantId - 1
        ];

    /*
     * If this is one of the original
     * generated tenants, save the updated
     * version so the changes persist.
     */

    const existingSavedIndex =
        savedTenants.findIndex(
            tenant =>
                tenant.id === tenantId
        );

    if (existingSavedIndex >= 0) {

        const updatedSaved =
            [...savedTenants];

        updatedSaved[
            existingSavedIndex
        ] = updatedTenant;

        saveTenants(
            updatedSaved
        );

    } else if (!defaultTenant) {

        saveTenants([
            ...savedTenants,
            updatedTenant,
        ]);

    } else {

        /*
         * Original tenant being edited.
         * Store its updated version.
         */

        saveTenants([
            ...savedTenants,
            updatedTenant,
        ]);
    }

    return updatedTenant;
}

/* =========================================================
   DELETE TENANT
========================================================= */

export async function deleteTenant(
    tenantId: number
): Promise<boolean> {

    const savedTenants =
        getSavedTenants();

    /*
     * Remove the tenant from localStorage.
     */

    const updatedTenants =
        savedTenants.filter(
            tenant =>
                tenant.id !== tenantId
        );

    saveTenants(
        updatedTenants
    );

    return true;
}

/* =========================================================
   CHECK IF TENANT EXISTS
========================================================= */

export async function tenantExists(
    tenantId: number
): Promise<boolean> {

    try {
        await fetchTenant(
            tenantId
        );

        return true;

    } catch {
        return false;
    }
}