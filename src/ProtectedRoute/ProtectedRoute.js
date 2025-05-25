import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { buildGatewayUrl } from "../utils/api";

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

        const url = buildGatewayUrl("/validate");
        const body = { token: token };

        fetch(url,
            {
                body: JSON.stringify(body),
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                setAuthChecked(true);

                if (res.ok) {
                    setAuthorized(true);
                }
                else {
                    setAuthorized(false);
                }
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