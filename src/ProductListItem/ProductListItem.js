import "./ProductListItem.css";

export default function ProductListItem(props) {
    return (
        <div className="product-list-item-container">
            <div className="product-list-item-info">
                <p>name: {props.productData.name}</p>
                <p>price: {props.productData.price}</p>
                <p>amount: {props.productData.amount}</p>
                <p>categoryId: {props.productData.categoryId}</p>
            </div>
            <button className="add-to-cart">Dodaj do koszyka</button>
        </div>
    );
}