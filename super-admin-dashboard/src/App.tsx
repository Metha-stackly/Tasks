import {
    useState
} from "react";

import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Tenants from "./pages/Tenants";
import AddTenant from "./pages/AddTenant";
import TenantDetails from "./pages/TenantDetails";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";

import "./App.css";


function App() {

    const [
        isSidebarOpen,
        setIsSidebarOpen
    ] = useState(false);


    const openSidebar = () => {

        setIsSidebarOpen(true);

    };


    const closeSidebar = () => {

        setIsSidebarOpen(false);

    };


    return (

        <div className="app">

            {/* =====================================
                SIDEBAR
            ===================================== */}

            <Sidebar
                isOpen={
                    isSidebarOpen
                }
                onClose={
                    closeSidebar
                }
            />


            {/* =====================================
                MAIN CONTENT
            ===================================== */}

            <div className="main-content">

                {/* =================================
                    HEADER
                ================================= */}

                <Header
                    onMenuClick={
                        openSidebar
                    }
                />


                {/* =================================
                    APPLICATION ROUTES
                ================================= */}

                <Routes>

                    {/* =============================
                        ROOT
                    ============================= */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />


                    {/* =============================
                        DASHBOARD
                    ============================= */}

                    <Route
                        path="/dashboard"
                        element={
                            <Dashboard />
                        }
                    />


                    {/* =============================
                        TENANTS
                    ============================= */}

                    <Route
                        path="/tenants"
                        element={
                            <Tenants />
                        }
                    />


                    {/* =============================
                        ADD TENANT

                        IMPORTANT:
                        This must come BEFORE
                        /tenants/:tenantId
                    ============================= */}

                    <Route
                        path="/tenants/add"
                        element={
                            <AddTenant />
                        }
                    />


                    {/* =============================
                        TENANT DETAILS
                    ============================= */}

                    <Route
                        path="/tenants/:tenantId"
                        element={
                            <TenantDetails />
                        }
                    />


                    {/* =============================
                        USERS
                    ============================= */}

                    <Route
                        path="/users"
                        element={
                            <Users />
                        }
                    />


                    {/* =============================
                        USER DETAILS
                    ============================= */}

                    <Route
                        path="/users/:userId"
                        element={
                            <UserDetails />
                        }
                    />


                    {/* =============================
                        UNKNOWN ROUTE
                    ============================= */}

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                </Routes>

            </div>

        </div>
    );
}


export default App;