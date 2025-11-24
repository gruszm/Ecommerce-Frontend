import "./DeliveryMethodManagementPanel.css";
import { Link } from "react-router-dom";
import DeliveryMethodManagementPanelList from "./DeliveryMethodManagementPanelList/DeliveryMethodManagementPanelList";

export default function DeliveryMethodManagementPanel(props) {
    return (
        <div className="delivery-method-management-panel-container">
            <Link to="new-method">Dodaj nową metodę dostawy</Link>

            <div className="delivery-method-management-panel-list-container">
                <DeliveryMethodManagementPanelList />
            </div>
        </div>
    );
}