import { useEffect, useState, useMemo, useCallback } from "react";
import Cookies from "js-cookie";
import { buildPublicUrl, buildSecureUrl } from "../utils/api.js";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SentimentVerySatisfiedRoundedIcon from '@mui/icons-material/SentimentVerySatisfiedRounded';
import DeliveryMethodCard from "./DeliveryMethodCard/DeliveryMethodCard.tsx";
import SummaryCard from "./SummaryCard/SummaryCard.tsx";
import SingleCartItem from "./SingleCartItem/SingleCartItem.tsx";
import { useSnackbar } from "notistack";
import { type PopulatedCartEntry, isPopulatedCartEntry } from "./types/PopulatedCartEntry.tsx";
import { type DeliveryMethod } from "./types/DeliveryMethod.tsx";
import { isProduct } from "./types/Product.tsx";
import { type RawCartEntry, isRawCartEntry } from "./types/RawCartEntry.tsx";

export default function Cart() {
    const { enqueueSnackbar } = useSnackbar();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [cartEntries, setCartEntries] = useState<PopulatedCartEntry[] | null>(null);
    const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null);

    const totalAmount = useMemo(() => {
        let totalAmount = 0;

        if (cartEntries) {
            totalAmount = cartEntries.reduce((prev, curr) => prev + (curr.price * curr.quantity), 0);
        }

        return totalAmount;
    }, [cartEntries]);

    const handleRadioChange = useCallback((selectedDeliveryMethod: DeliveryMethod) => () => {
        setDeliveryMethod(selectedDeliveryMethod);
    }, [setDeliveryMethod]);

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
            if (!Array.isArray(res.cartEntries) || res.cartEntries.length === 0) {
                return;
            }

            const _cartEntries: unknown = res.cartEntries;

            // TODO: add handling - throw error
            if (!Array.isArray(_cartEntries) || !_cartEntries.every(isRawCartEntry)) {
                return;
            }

            const productPromises: Promise<unknown>[] = _cartEntries.map(async entry => {
                const productUrl = buildPublicUrl(`/products/${entry.productId}`);

                const _res = await fetch(productUrl,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                return _res.json();
            });

            try {
                const products = await Promise.all(productPromises);

                // TODO: add handling - throw error
                if (!Array.isArray(products) || !products.every(isProduct)) {
                    return;
                }

                // Populate each entry with the product data
                const newCartEntries: unknown[] = _cartEntries.map((entry: RawCartEntry, index: number) => ({
                    ...entry,
                    productName: products[index].name,
                    price: products[index].price,
                    imageIds: products[index].imageIds
                }));

                // Additional check - sanity check
                // TODO: add handling - throw error
                if (!Array.isArray(newCartEntries) || !newCartEntries.every(isPopulatedCartEntry)) {
                    return;
                }

                setCartEntries(newCartEntries);
            }
            catch (error) {
                enqueueSnackbar("Nie udało się załadować zawartości koszyka", { autoHideDuration: 6000, variant: "error" });
            }

            setLoaded(true);
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

    if (!cartEntries || cartEntries.length === 0) {
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
                    {cartEntries.map(cartEntry => (
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