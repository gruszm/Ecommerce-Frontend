import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Cookies from "js-cookie";

export default function Logout(props) {
    const { setAuthenticated, setElevatedRights } = useContext(AuthContext);
    const [done, setDone] = useState(false);

    useEffect(() => {
        Cookies.remove("auth-token");
        setAuthenticated(false);
        setElevatedRights(false);
        setDone(true);
    }, [setAuthenticated, setElevatedRights]);

    if (!done) {
        return <p>Wylogowywanie...</p>
    }

    return <Navigate to="/" replace />;
}