import "./Login.css";
import { useContext, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../AuthContext/AuthContext.tsx";
import { buildGatewayUrl } from "../utils/api";

type LoginDataType = {
    token: string,
    daysUntilExpires: number,
    hasElevatedRights: boolean
}

function isLoginDataType(value: unknown): value is LoginDataType {
    if (value === null || typeof value !== "object") {
        return false;
    }

    const v = value as Record<string, unknown>;

    return (
        typeof v.token === "string" &&
        typeof v.daysUntilExpires === "number" &&
        typeof v.hasElevatedRights === "boolean"
    );
}

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();
    const { setAuthenticated, setElevatedRights } = useContext(AuthContext);

    const login = async function (event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const url = buildGatewayUrl("/login");
        const body = { email: email, password: password };

        const response = await fetch(url,
            {
                body: JSON.stringify(body),
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.ok) {
            const parsedData: unknown = await response.json();

            if (!isLoginDataType(parsedData)) {
                return;
            }

            const { token, daysUntilExpires, hasElevatedRights } = parsedData;

            Cookies.set("auth-token", token, { expires: daysUntilExpires });

            setAuthenticated(true);
            setElevatedRights(hasElevatedRights);
            navigate("/", { replace: true });
        }
        else {

        }
    };

    return (
        <div>
            <form action="" className="login-form-container" onSubmit={login}>
                <input type="email" name="email" id="email" placeholder="email" onChange={event => setEmail(event.target.value)} />
                <input type="password" name="password" id="password" placeholder="hasło" onChange={event => setPassword(event.target.value)} />
                <button type="submit">Zaloguj</button>
            </form>
        </div>
    );
}