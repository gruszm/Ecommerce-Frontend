import { Link } from "react-router-dom";

export default function AccessDenied(props) {
    return (
        <div>
            <p>Nie masz uprawnień do tego zasobu.</p>
            <Link to="/">Powrót do strony głównej</Link>
        </div>
    );
}