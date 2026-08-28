import {
    NavLink,
} from "react-router-dom";


interface SidebarProps {

    isOpen: boolean;

    onClose: () => void;
}


function Sidebar({
    isOpen,
    onClose,
}: SidebarProps) {

    const getClassName =
        ({
            isActive,
        }: {
            isActive: boolean;
        }) =>
            `sidebar-item ${
                isActive
                    ? "active"
                    : ""
            }`;


    return (

        <>

            <button
                type="button"
                className={
                    `mobile-overlay ${
                        isOpen
                            ? "show"
                            : ""
                    }`
                }
                onClick={onClose}
                aria-label="Close menu"
            />


            <aside
                className={
                    `sidebar ${
                        isOpen
                            ? "open"
                            : ""
                    }`
                }
            >

                <div className="sidebar-logo">

                    <div className="logo-symbol">
                        ✣
                    </div>

                    <div className="logo-text">
                        SCAMSUNGTECH
                    </div>

                </div>


                <div className="admin-profile">

                    <div className="admin-avatar">
                        A
                    </div>

                    <div className="admin-info">

                        <strong>
                            Admin
                        </strong>

                        <span>
                            Super Admin
                        </span>

                    </div>

                </div>


                <nav className="sidebar-nav">

                    <div className="sidebar-section">

                        <div className="sidebar-section-title">
                            FEATURES
                        </div>


                        <NavLink
                            to="/dashboard"
                            onClick={onClose}
                            className={getClassName}
                        >

                            <span className="sidebar-icon">
                                ▣
                            </span>

                            <span>
                                Dashboard
                            </span>

                        </NavLink>


                        <NavLink
                            to="/tenants"
                            onClick={onClose}
                            className={getClassName}
                        >

                            <span className="sidebar-icon">
                                ▤
                            </span>

                            <span>
                                Tenants
                            </span>

                        </NavLink>


                        <NavLink
                            to="/users"
                            onClick={onClose}
                            className={getClassName}
                        >

                            <span className="sidebar-icon">
                                ♙
                            </span>

                            <span>
                                Users
                            </span>

                        </NavLink>

                    </div>


                    <div className="sidebar-section">

                        <div className="sidebar-section-title">
                            RECRUITMENT
                        </div>

                        <div className="sidebar-item disabled-item">
                            <span className="sidebar-icon">
                                ▣
                            </span>
                            <span>
                                Jobs
                            </span>
                        </div>

                        <div className="sidebar-item disabled-item">
                            <span className="sidebar-icon">
                                ♟
                            </span>
                            <span>
                                Candidates
                            </span>
                        </div>

                        <div className="sidebar-item disabled-item">
                            <span className="sidebar-icon">
                                ▤
                            </span>
                            <span>
                                Resumes
                            </span>
                        </div>

                    </div>


                    <div className="sidebar-section">

                        <div className="sidebar-section-title">
                            ORGANIZATION
                        </div>

                        <div className="sidebar-item disabled-item">
                            <span className="sidebar-icon">
                                ♙
                            </span>
                            <span>
                                Employee Management
                            </span>
                        </div>

                        <div className="sidebar-item disabled-item">
                            <span className="sidebar-icon">
                                ▣
                            </span>
                            <span>
                                Leave Management
                            </span>
                        </div>

                        <div className="sidebar-item disabled-item">
                            <span className="sidebar-icon">
                                ▤
                            </span>
                            <span>
                                Performance Management
                            </span>
                        </div>

                    </div>


                    <div className="sidebar-section">

                        <div className="sidebar-section-title">
                            KPI'S PAY
                        </div>

                        <div className="sidebar-item disabled-item">
                            <span className="sidebar-icon">
                                ▤
                            </span>
                            <span>
                                Payroll Management
                            </span>
                        </div>

                    </div>

                </nav>


                <button
                    type="button"
                    className="logout-button"
                >
                    <span>
                        ⏻
                    </span>

                    <span>
                        Log Out
                    </span>
                </button>

            </aside>
        </>
    );
}


export default Sidebar;