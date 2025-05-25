import ProductManagementPanelList from "./ProductManagementPanelList/ProductManagementPanelList";

export default function ProductManagementPanel() {
    return (
        <div className="product-management-panel-container">
            <button>Dodaj nowy produkt</button>

            <div className="product-management-panel-list-container">
                <ProductManagementPanelList />
            </div>
        </div>
    );
}