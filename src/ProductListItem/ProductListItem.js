import "./ProductListItem.css";

export default function ProductListItem(props) {
    return (
        <div className="products-list-item">
            <p>id: {props.productData.id}</p>
            <p>name: {props.productData.name}</p>
            <p>price: {props.productData.price}</p>
            <p>amount: {props.productData.amount}</p>
            <p>categoryId: {props.productData.categoryId}</p>
        </div>
    );
}