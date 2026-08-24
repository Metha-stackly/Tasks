import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "./api";

interface UserDetailsProps {
    userId: number;
}

function UserDetails({ userId }: UserDetailsProps) {

    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => fetchUserById(userId)
    });

    if (isLoading) {
        return (
            <div className="details-loading">
                Loading user details...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="details-error">
                Error: {error.message}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="details-error">
                Invalid User ID
            </div>
        );
    }

    return (
        <div className="user-details-card">

            {/* Card Header */}
            <div className="details-heading">

                <span className="details-icon">
                    ♙
                </span>

                <h2>
                    User Details
                </h2>

            </div>

            {/* User Name and Avatar */}
            <div className="user-name-section">

                <div className="user-main-info">

                    <h3>
                        {data.name}
                    </h3>

                    <p className="username">
                        @{data.username}
                    </p>

                </div>

                <div className="avatar">
                    {data.name.charAt(0)}
                </div>

            </div>

            {/* Email */}
            <div className="detail-box">

                <div className="detail-icon">
                    ✉
                </div>

                <div>
                    <span className="detail-label">
                        Email
                    </span>

                    <p>
                        {data.email}
                    </p>
                </div>

            </div>

            {/* Phone */}
            <div className="detail-box">

                <div className="detail-icon">
                    ☎
                </div>

                <div>
                    <span className="detail-label">
                        Phone
                    </span>

                    <p>
                        {data.phone}
                    </p>
                </div>

            </div>

            {/* Website */}
            <div className="detail-box">

                <div className="detail-icon">
                    ◉
                </div>

                <div>
                    <span className="detail-label">
                        Website
                    </span>

                    <p className="website">
                        {data.website}
                    </p>
                </div>

            </div>

            {/* City */}
            <div className="detail-box">

                <div className="detail-icon">
                    ⌖
                </div>

                <div>
                    <span className="detail-label">
                        City
                    </span>

                    <p>
                        {data.address.city}
                    </p>
                </div>

            </div>

            {/* Company */}
            <div className="detail-box">

                <div className="detail-icon">
                    ◈
                </div>

                <div>
                    <span className="detail-label">
                        Company
                    </span>

                    <p>
                        {data.company.name}
                    </p>
                </div>

            </div>

        </div>
    );
}

export default UserDetails;