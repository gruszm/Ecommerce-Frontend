import "./NavigationBar.css";
import { Link, Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import Cookies from "js-cookie";

export default function NavigationBar(props) {
    const { isAuthenticated, setAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        const token = Cookies.get("auth-token");

        if (token) {
            setAuthenticated(true);
        }
    }, [setAuthenticated]);

    return (
        <>
            <nav>
                <ul>
                    <li><Link to="/">Strona główna</Link></li>
                    {!isAuthenticated && <li><Link to="/login">Zaloguj</Link></li>}
                    {isAuthenticated && <li><Link to="/logout">Wyloguj</Link></li>}
                    <li><Link to="/cart">Koszyk</Link></li>
                </ul>
            </nav>
            <Outlet />
        </>
    );
}