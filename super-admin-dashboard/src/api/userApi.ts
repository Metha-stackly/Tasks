import type {
    User,
    UserResponse,
    UserStatus,
} from "../types";


const USERS_API =
    "https://dummyjson.com/users";


function getUserStatus(
    id: number
): UserStatus {

    if (id % 3 === 0) {
        return "Suspended";
    }

    if (id % 2 === 0) {
        return "Active";
    }

    return "Inactive";
}


function getTenantId(
    userId: number
): number {

    return (
        ((userId - 1) % 30) + 1
    );
}


function mapUser(
    user: any
): User {

    const tenantId =
        getTenantId(user.id);


    return {

        id: user.id,

        firstName:
            user.firstName ?? "",

        lastName:
            user.lastName ?? "",

        email:
            user.email ?? "",

        phone:
            user.phone ?? "",

        image:
            user.image ?? "",

        role:
            user.role ?? "user",

        tenantId,

        tenantName:
            `Tenant ${tenantId}`,

        status:
            getUserStatus(user.id),

        address: {

            address:
                user.address?.address ?? "",

            city:
                user.address?.city ?? "",

            state:
                user.address?.state ?? "",

            postalCode:
                user.address?.postalCode ?? "",

            country:
                user.address?.country ?? "",
        },

        company: {

            department:
                user.company?.department ?? "",

            name:
                user.company?.name ?? "",

            title:
                user.company?.title ?? "",
        },
    };
}


/* =========================================
   GET USERS
========================================= */

export async function fetchUsers(
    page: number = 1,
    limit: number = 10
): Promise<UserResponse> {

    /*
     * We load 100 DummyJSON users.
     *
     * DummyJSON has 100 users available
     * with this endpoint.
     */

    const response =
        await fetch(
            `${USERS_API}?limit=100`
        );


    if (!response.ok) {

        throw new Error(
            "Failed to fetch users"
        );
    }


    const data =
        await response.json();


    const allUsers: User[] =
        data.users.map(
            (user: any) =>
                mapUser(user)
        );


    const start =
        (page - 1) * limit;


    const end =
        start + limit;


    return {

        users:
            allUsers.slice(
                start,
                end
            ),

        total:
            allUsers.length,

        skip:
            start,

        limit,
    };
}


/* =========================================
   GET SINGLE USER
========================================= */

export async function fetchUser(
    userId: number
): Promise<User> {

    const response =
        await fetch(
            `${USERS_API}/${userId}`
        );


    if (!response.ok) {

        throw new Error(
            "Failed to fetch user"
        );
    }


    const data =
        await response.json();


    return mapUser(data);
}


/* =========================================
   UPDATE USER STATUS
========================================= */

export async function updateUserStatus(
    userId: number,
    status: UserStatus
): Promise<User> {

    const response =
        await fetch(
            `${USERS_API}/${userId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body:
                    JSON.stringify({
                        status,
                    }),
            }
        );


    if (!response.ok) {

        throw new Error(
            "Failed to update user"
        );
    }


    const data =
        await response.json();


    const user =
        mapUser(data);


    return {

        ...user,

        status,
    };
} 