import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { buildGatewayUrl } from "../utils/api";

export default function AdminRoute() {
    const [authChecked, setAuthChecked] = useState<boolean>(false);
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [hasElevatedRights, setElevatedRights] = useState<boolean>(false);

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
                    const parsedData: unknown = await res.json();

                    setAuthChecked(true);
                    setAuthorized(true);

                    if ((parsedData !== null) &&
                        (typeof parsedData === "object") &&
                        ("hasElevatedRights" in parsedData) &&
                        (typeof parsedData.hasElevatedRights === "boolean")) {
                        setElevatedRights(parsedData.hasElevatedRights);
                    }
                }
                else {
                    setAuthChecked(true);
                    setAuthorized(false);
                }
            })
            .catch(() => {
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