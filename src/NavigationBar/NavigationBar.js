import "./NavigationBar.css";
import { Link, Outlet } from "react-router-dom";

export default function NavigationBar(props) {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Strona główna</Link>
                    </li>
                    <li>
                        <Link to="/login">Zaloguj</Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </>
    );
}