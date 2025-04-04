import "./Login.css";

export default function Login(props) {
    return (
        <form action="" className="login-form-container">
            <input type="text" name="login" id="login" placeholder="login" />
            <input type="password" name="password" id="password" placeholder="hasło" />
            <button type="submit">Zaloguj</button>
        </form>
    );
}