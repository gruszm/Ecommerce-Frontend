import "./NavigationBar.css";
import { Link, Outlet } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../AuthContext/AuthContext.tsx";
import Cookies from "js-cookie";
import { buildGatewayUrl } from "../utils/api";

export default function NavigationBar() {
    const { isAuthenticated, setAuthenticated, setElevatedRights, hasElevatedRights } = useContext(AuthContext);
    const [dropdownMenuActive, setDropdownMenuActive] = useState<boolean>(false);
    const closeDropdownMenu = () => setDropdownMenuActive(false);
    const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const token = Cookies.get("auth-token");
        const url = buildGatewayUrl("/validate");

        const handleClickOutsideDropdown = function (event: MouseEvent) {
            const target = event.target;

            if (dropdownMenuRef.current &&
                target instanceof Node &&
                !dropdownMenuRef.current.contains(target)) {
                closeDropdownMenu();
            }
        };

        fetch(url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token })
            }
        )
            .then(res => res.json())
            .then((res: unknown) => {
                setAuthenticated(true);

                if (res !== null && typeof res === "object" && "hasElevatedRights" in res && typeof res.hasElevatedRights === "boolean")
                    setElevatedRights(res.hasElevatedRights);
            })
            .catch((error: unknown) => {
                if (error instanceof Error)
                    console.log(error.message);
            });

        document.addEventListener("click", handleClickOutsideDropdown);

        return () => {
            document.removeEventListener("click", handleClickOutsideDropdown);
        };

    }, [setAuthenticated, setElevatedRights]);

    return (
        <>
            <nav className="nav-container">
                <ul>
                    <li><Link to="/">Strona główna</Link></li>
                    {!isAuthenticated && <li><Link to="/login">Zaloguj</Link></li>}
                    {isAuthenticated && <li><Link to="/logout">Wyloguj</Link></li>}
                    <li><Link to="/cart">Koszyk</Link></li>
                    {(isAuthenticated && hasElevatedRights) && <li><Link to="/admin-panel">Panel administratora</Link></li>}
                </ul>

                <div ref={dropdownMenuRef} className="dropdown-menu">
                    <button className="dropdown-button" onClick={() => setDropdownMenuActive(!dropdownMenuActive)}>Menu</button>

                    {dropdownMenuActive &&
                        <>
                            <ul className="dropdown-list">
                                <li><Link to="addresses" onClick={closeDropdownMenu}>Moje adresy</Link></li>
                                <li><Link to="#" onClick={closeDropdownMenu}>Ustawienia konta</Link></li>
                                <li><Link to="#" onClick={closeDropdownMenu}>Ustawienia konta2</Link></li>
                                <li><Link to="#" onClick={closeDropdownMenu}>Ustawienia konta3</Link></li>
                            </ul>
                        </>
                    }
                </div>
            </nav>
            <Outlet />
        </>
    );
}