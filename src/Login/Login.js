import "./Login.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../AuthContext/AuthContext";
import { buildGatewayUrl } from "../utils/api";

export default function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setAuthenticated, setElevatedRights } = useContext(AuthContext);

    const login = async function (event) {
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
            const parsedData = await response.json();
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