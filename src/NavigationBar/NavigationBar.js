import "./NavigationBar.css";
import { Link, Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import Cookies from "js-cookie";
import { buildGatewayUrl } from "../utils/api";

export default function NavigationBar() {
    const { isAuthenticated, setAuthenticated, setElevatedRights, hasElevatedRights } = useContext(AuthContext);

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
            });
    }, [setAuthenticated, setElevatedRights]);

    return (
        <>
            <nav>
                <ul>
                    <li><Link to="/">Strona główna</Link></li>
                    {!isAuthenticated && <li><Link to="/login">Zaloguj</Link></li>}
                    {isAuthenticated && <li><Link to="/logout">Wyloguj</Link></li>}
                    <li><Link to="/cart">Koszyk</Link></li>
                    {hasElevatedRights && <li><Link to="/admin-panel">Panel administratora</Link></li>}
                </ul>
            </nav>
            <Outlet />
        </>
    );
}