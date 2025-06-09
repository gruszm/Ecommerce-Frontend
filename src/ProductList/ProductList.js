import { useEffect, useState } from "react";
import "./ProductList.css";
import ProductListItem from "../ProductListItem/ProductListItem";
import { buildPublicUrl } from "../utils/api";

export default function ProductList(props) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        const url = buildPublicUrl("/products");

        fetch(url)
            .then(res => res.json())
            .then(res => {
                setLoading(false);

                if (res && res.length > 0) {
                    setProductList(res.filter((product => product.amount > 0))); // Only display the available products
                }
            })
            .catch(error => {
                setLoading(false);
                setError(true);
                setErrorMessage(error.message);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {errorMessage}</p>;

    return (
        <div className="product-list-container">
            {(productList && productList.length > 0) &&
                productList.map(singleProduct => <ProductListItem key={singleProduct.id} productData={singleProduct} />)}
        </div>
    );
}