import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { buildPublicUrl, buildSecureUrl } from "../utils/api";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SentimentVerySatisfiedRoundedIcon from '@mui/icons-material/SentimentVerySatisfiedRounded';
import DeliveryMethodCard from "./DeliveryMethodCard/DeliveryMethodCard";
import SummaryCard from "./SummaryCard/SummaryCard";
import SingleCartItem from "./SingleCartItem/SingleCartItem";
import { useSnackbar } from "notistack";

export default function Cart() {
    const { enqueueSnackbar } = useSnackbar();
    const [loaded, setLoaded] = useState(false);
    const [productsInCart, setProductsInCart] = useState(null);
    const [deliveryMethod, setDeliveryMethod] = useState(null);

    const totalAmount = useMemo(() => {
        let totalAmount = 0;

        totalAmount = productsInCart ? productsInCart.reduce((prev, curr) => prev + (curr.price * curr.quantity), 0) : 0;
        totalAmount += deliveryMethod ? parseFloat(deliveryMethod.price) : 0;

        return totalAmount;
    }, [productsInCart, deliveryMethod]);

    const handleRadioChange = (selectedDeliveryMethod) => () => {
        setDeliveryMethod(selectedDeliveryMethod);
    };

    useEffect(() => {
        const cartUrl = buildSecureUrl("/carts/user");
        const token = Cookies.get("auth-token");

        fetch(cartUrl, {
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {
            setLoaded(true);

            if (res.ok) {
                return res.json();
            }
        }).then(async res => {
            if (res.cartEntries && res.cartEntries.length > 0) {
                const productPromises = res.cartEntries.map(async entry => {
                    const productUrl = buildPublicUrl(`/products/${entry.productId}`);

                    const res = await fetch(productUrl,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    );

                    return res.json();
                });

                try {
                    const products = await Promise.all(productPromises);

                    // Populate each entry with the product data
                    const newCartEntries = res.cartEntries.map((entry, index) => ({
                        ...entry,
                        productName: products[index].name,
                        price: products[index].price,
                        imageIds: products[index].imageIds
                    }));

                    setProductsInCart(newCartEntries);
                }
                catch (error) {
                    enqueueSnackbar("Nie udało się załadować zawartości koszyka", { autoHideDuration: 6000, variant: "error" });
                }

                setLoaded(true);
            }
        }).catch(() => {
            enqueueSnackbar("Nie udało się załadować zawartości koszyka", { autoHideDuration: 6000, variant: "error" });
            setLoaded(true);
        });
    }, [enqueueSnackbar]);

    if (!loaded) {
        return (
            <Container>
                <Typography variant="h2" gutterBottom>Koszyk</Typography>
                <Typography variant="h5">Ładowanie zawartości koszyka...</Typography>
            </Container>
        );
    }

    if (!productsInCart || productsInCart.length === 0) {
        return (
            <Container>
                <Typography variant="h2" gutterBottom>Koszyk</Typography>
                <Typography variant="h5" color="text.secondary">Twój koszyk jest pusty, zmieńmy to! {<SentimentVerySatisfiedRoundedIcon />}</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h2" gutterBottom>Koszyk</Typography>

            <Stack direction="row" sx={{
                justifyContent: "space-between",
            }}>
                <Stack direction="column" spacing={3} sx={{
                    mb: 4,
                    flexGrow: 1,
                    mr: 4
                }}>
                    {productsInCart.map(cartEntry => (
                        <SingleCartItem key={cartEntry.id} cartEntry={cartEntry} sx={{
                            display: "flex",
                            justifyContent: "space-between"
                        }} />
                    ))}
                </Stack>
                <Stack direction="column">
                    <DeliveryMethodCard
                        onRadioChange={handleRadioChange}
                        sx={{
                            height: "fit-content",
                            mb: 1
                        }} />
                    <SummaryCard totalAmount={totalAmount} deliveryMethod={deliveryMethod} />
                </Stack>
            </Stack>
        </Container>
    );
}