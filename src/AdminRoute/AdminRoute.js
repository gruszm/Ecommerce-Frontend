import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { buildGatewayUrl } from "../utils/api";

export default function AdminRoute() {
    const [authChecked, setAuthChecked] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [hasElevatedRights, setElevatedRights] = useState(false);

    useEffect(() => {
        const token = Cookies.get("auth-token");

        if (!token) {
            setAuthChecked(true);

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
            .then(async res => {
                if (res.ok) {
                    const parsedData = await res.json();

                    setAuthChecked(true);
                    setAuthorized(true);
                    setElevatedRights(parsedData.hasElevatedRights);
                }
                else {
                    setAuthChecked(true);
                    setAuthorized(false);
                }
            })
            .catch(error => {
                setAuthChecked(true);
                setAuthorized(false);
            });
    }, []);

    if (authChecked) {
        if (!authorized) {
            return <Navigate to="/login" />;
        }

        if (!hasElevatedRights) {
            return <Navigate to="/access-denied" />;
        }

        return <Outlet />;
    } else {
        return <p>Weryfikacja uprawnień...</p>;
    }
}