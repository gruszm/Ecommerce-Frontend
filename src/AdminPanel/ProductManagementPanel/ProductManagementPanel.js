import { Link } from "react-router-dom";
import ProductManagementPanelList from "./ProductManagementPanelList/ProductManagementPanelList";

export default function ProductManagementPanel() {
    return (
        <div className="product-management-panel-container">
            <Link to="new-product">Dodaj nowy produkt</Link>

            <div className="product-management-panel-list-container">
                <ProductManagementPanelList />
            </div>
        </div>
    );
}