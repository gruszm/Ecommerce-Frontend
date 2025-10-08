import { buildPublicUrl } from "../../utils/api";
import "./OrderSummaryCartEntry.css";

function getSumAsText(price, quantity) {

    // Add a comma at the third to last position
    const sum = price * quantity;
    const sumAsText = (sum * 100).toString();
    const sumtAsTextWithDot = sumAsText.slice(0, -2) + "," + sumAsText.slice(-2);

    return sumtAsTextWithDot;
}

export default function OrderSummaryCartEntry({ entryData }) {
    return (
        <div className="order-cart-entry-container">
            <div className="order-cart-entry-info">
                <span>Nazwa produktu: {entryData.name}</span>
                <span>Cena: {getSumAsText(entryData.price, 1)} zł</span>
                <span>Ilość: {entryData.quantity}</span>
                <span>Kwota: {getSumAsText(entryData.price, entryData.quantity)} zł</span>
            </div>

            {(entryData.imageIds.length > 0) &&
                <img src={buildPublicUrl("/products/images/" + entryData.imageIds[0])} alt={entryData.name} />}
        </div>
    );
}