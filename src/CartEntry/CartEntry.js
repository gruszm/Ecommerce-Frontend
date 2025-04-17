export default function CartEntry(props) {
    return (
        <div>
            <p>Id produktu: {props.entryData.productId}</p>
            <p>Ilość produktu: {props.entryData.quantity}</p>
        </div>
    );
}