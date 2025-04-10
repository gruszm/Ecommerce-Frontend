import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute(props) {
    const [authChecked, setAuthChecked] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = Cookies.get("auth-token");

        if (!token) {
            setAuthChecked(true);
            setAuthorized(false);
            return;
        }

        const url = "http://" + process.env.REACT_APP_GATEWAY + ":" + process.env.REACT_APP_GATEWAY_PORT + "/api/validate";
        const body = { token: token };

        fetch(url,
            {
                body: JSON.stringify(body),
                method: "POST"
            })
            .then(res => res.json())
            .then(res => {
                setAuthChecked(true);
                setAuthorized(res.tokenValid);
            })
            .catch(error => {
                setAuthChecked(true);
                setAuthorized(false);
            });
    }, []);

    if (authChecked) {
        return authorized ? <Outlet /> : <Navigate to="/login" />
    }
}