import "./NavigationBar.css";
import { Link, Outlet } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../AuthContext";
import Cookies from "js-cookie";
import { buildGatewayUrl } from "../utils/api";

export default function NavigationBar() {
    const { isAuthenticated, setAuthenticated, setElevatedRights, hasElevatedRights } = useContext(AuthContext);
    const [dropdownMenuActive, setDropdownMenuActive] = useState(false);
    const dropdownMenuRef = useRef(null);

    const handleClickOutsideDropdown = (event) => {
        const target = event.target;

        if (dropdownMenuRef.current && !dropdownMenuRef.current.contains(target)) {
            setDropdownMenuActive(false);
        }
    };

    useEffect(() => {
        const token = Cookies.get("auth-token");
        const url = buildGatewayUrl("/validate");

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
            .then(res => {
                setAuthenticated(true);
                setElevatedRights(res.hasElevatedRights);
            })
            .catch(error => {
                console.error(error.message);
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
                                <li>Ustawienia konta</li>
                                <li>Ustawienia konta2</li>
                                <li>Ustawienia konta3</li>
                            </ul>
                        </>
                    }
                </div>
            </nav>
            <Outlet />
        </>
    );
}