import { Link } from "react-router-dom";

export default function AdminPanel() {
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <Link to="product-management-panel">Panel zarządzania produktami</Link>
            <Link to="delivery-method-management-panel">Panel zarządzania metodami dostawy</Link>
        </div>
    );
}