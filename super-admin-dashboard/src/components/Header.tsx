interface HeaderProps {

    onMenuClick: () => void;
}


function Header({
    onMenuClick,
}: HeaderProps) {

    return (

        <header className="top-header">

            <button
                type="button"
                className="mobile-menu-button"
                onClick={
                    onMenuClick
                }
                aria-label="Open menu"
            >
                ☰
            </button>


            <div className="header-content">

                <h1>
                    Super Admin Management
                </h1>

                <p>
                    Manage tenants and users
                </p>

            </div>

        </header>
    );
}


export default Header;