import { useState, useEffect, useRef, useMemo, memo } from "react";
import Cookies from "js-cookie";
import { buildGatewayUrl, buildPublicUrl, buildSecureUrl, getPriceAsText } from "../utils/api";
import Container from "@mui/material/Container";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import StoreIcon from '@mui/icons-material/Store';
import Box from "@mui/material/Box";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddressDialog from "./AddressDialog/AddressDialog";
import { styled } from "@mui/material/styles";
import { Divider, IconButton, Tooltip } from "@mui/material";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Button from "@mui/material/Button";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

function PriceRow({ label, price }) {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
        }}>
            <Typography>{label}:</Typography>
            <Typography>{getPriceAsText(price)}&nbsp;zł</Typography>
        </Box>
    );
}

function OrderSummary(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();

    const deliveryMethodIdRef = useRef(location.state.deliveryMethodId);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [deliveryMethod, setDeliveryMethod] = useState(null);
    const [cartEntries, setCartEntries] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(-1);

    const selectedAddress = useMemo(() => {
        const addr = addresses.find(a => a.id === selectedAddressId);

        return addr;
    }, [addresses, selectedAddressId]);

    const cartSum = useMemo(() => cartEntries.reduce((sum, currentEntry) => sum + currentEntry.totalPrice, 0), [cartEntries]);

    const sumOfLoaded = useMemo(() => {
        let sumOfLoaded = 0;

        sumOfLoaded += (addresses && addresses.length > 0) ? 1 : 0;
        sumOfLoaded += (deliveryMethod) ? 1 : 0;
        sumOfLoaded += (cartEntries && cartEntries.length > 0) ? 1 : 0;

        return sumOfLoaded;
    }, [addresses, deliveryMethod, cartEntries]);

    const handleEditAddress = () => {
        setDialogOpen(true);
    };

    const handleConfirmOrder = () => {
        const orderUrl = buildGatewayUrl("/order");
        const body = { addressId: selectedAddressId };
        const token = Cookies.get("auth-token");

        fetch(orderUrl,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        ).then(async res => {
            if (res.ok) {
                const { url } = await res.json();

                window.location.href = url;
            } else {
                const errorObj = await res.json();

                enqueueSnackbar("Wystąpił błąd przy składaniu zamówienia: " + errorObj.message, {
                    variant: "error",
                    autoHideDuration: 6000
                });
            }
        }
        ).catch(error => {
            enqueueSnackbar("Wystąpił błąd przy składaniu zamówienia: " + error.message, {
                variant: "error",
                autoHideDuration: 6000
            });
        });
    };

    useEffect(() => {
        const token = Cookies.get("auth-token");

        const fetchAddresses = async function () {
            const addressesUrl = buildSecureUrl("/profiles/addresses");

            try {
                const fetchedAddresses = await fetch(addressesUrl,
                    {
                        method: "GET",
                        headers:
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                ).then(res => res.json());

                setAddresses(fetchedAddresses);
                setSelectedAddressId(fetchedAddresses[0].id);
            } catch (error) {
                enqueueSnackbar(`Nie udało się załadować adresów. Błąd: ${error.message}`, {
                    variant: "error",
                    autoHideDuration: 6000
                });
            }
        }

        const fetchDeliveryMethod = async function () {
            const deliveryMethodUrl = buildPublicUrl(`/delivery/${deliveryMethodIdRef.current}`);

            try {
                const fetchedDeliveryMethod = await fetch(deliveryMethodUrl,
                    {
                        method: "GET",
                        headers:
                        {
                            "Content-Type": "application/json"
                        }
                    }
                ).then(res => res.json());

                setDeliveryMethod(fetchedDeliveryMethod);
            } catch (error) {
                enqueueSnackbar(`Nie udało się załadować informacji o dostawie. Błąd: ${error.message}`, {
                    variant: "error",
                    autoHideDuration: 6000
                });
            }
        }

        const fetchCartContent = async function () {
            const cartUrl = buildSecureUrl("/carts/user");

            try {
                const fetchedCart = await fetch(cartUrl,
                    {
                        method: "GET",
                        headers:
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                ).then(res => res.json());

                const productPromises = fetchedCart.cartEntries.map(async entry => {
                    const productUrl = buildPublicUrl(`/products/${entry.productId}`);

                    const res = await fetch(productUrl,
                        {
                            method: "GET",
                            headers:
                            {
                                "Content-Type": "application/json"
                            }
                        }
                    );

                    return res.json();
                });

                const products = await Promise.all(productPromises);

                const cartEntriesPopulated = fetchedCart.cartEntries.map((entry, index) => ({
                    ...entry,
                    productName: products[index].name,
                    price: products[index].price,
                    totalPrice: products[index].price * entry.quantity,
                    imageIds: products[index].imageIds
                }));

                setCartEntries(cartEntriesPopulated);
            } catch (error) {
                enqueueSnackbar(`Nie udało się załadować zawartości koszyka. Błąd: ${error.message}`, {
                    variant: "error",
                    autoHideDuration: 6000
                });
            }
        }

        if (!token) {
            navigate("/login");

            return;
        } else {
            fetchAddresses();
            fetchDeliveryMethod();
            fetchCartContent();
        }
    }, [navigate, enqueueSnackbar]);

    if (sumOfLoaded < 3 || selectedAddressId === -1) {
        return (
            <Container sx={{
                display: "flex",
                justifyContent: "center"
            }}>
                <CircularProgress />
            </Container >
        );
    }

    return (
        <Container>
            <Box sx={{
                display: "flex",
                flexDirection: "row"
            }}>
                <StoreIcon color="primary" fontSize="large" sx={{ mt: "3px", mr: 1 }} />
                <Typography variant="h4" gutterBottom>Podsumowanie zamówienia</Typography>
            </Box>

            <Box sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" }
            }}>
                <TableContainer component={Paper} variant="outlined" sx={{ height: "fit-content" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Produkt</TableCell>
                                <TableCell align="center">Ilość</TableCell>
                                <TableCell align="center">Cena&nbsp;za&nbsp;szt.</TableCell>
                                <TableCell align="center">Łącznie</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cartEntries.map(entry => (
                                <TableRow key={entry.id}>
                                    <TableCell>{entry.productName}</TableCell>
                                    <TableCell align="center">{entry.quantity}</TableCell>
                                    <TableCell align="center">{getPriceAsText(entry.price)}&nbsp;zł</TableCell>
                                    <TableCell align="center">{getPriceAsText(entry.totalPrice)}&nbsp;zł</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell sx={{ display: "flex", flexDirection: "row", alignItems: "center", border: 0 }}>
                                    <LocalShippingIcon color="action" sx={{ mr: 1 }} />
                                    {deliveryMethod.name}
                                </TableCell>
                                <TableCell align="center" sx={{ border: 0 }}>1</TableCell>
                                <TableCell align="center" sx={{ border: 0 }}>{getPriceAsText(deliveryMethod.price)}&nbsp;zł</TableCell>
                                <TableCell align="center" sx={{ border: 0 }}>{getPriceAsText(deliveryMethod.price)}&nbsp;zł</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    ml: { xs: 0, md: 2 },
                    mt: { xs: 2, md: 0 },
                    gap: 1,
                    alignItems: { xs: "center", md: "auto" },
                }}>
                    <Paper variant="outlined" sx={{
                        whiteSpace: "nowrap",
                        width: { xs: "60%", md: "auto" }
                    }}>
                        <Typography variant="h6" sx={{
                            px: 2,
                            py: 1,
                            fontWeight: "bold",
                            textAlign: "center"
                        }}>
                            Adres do wysyłki
                        </Typography>

                        <Divider />

                        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                            <Box>
                                <Typography>
                                    {selectedAddress.street}&nbsp;{selectedAddress.houseNumber}{selectedAddress.apartmentNumber ? `\u00A0/\u00A0${selectedAddress.apartmentNumber}` : null}
                                </Typography>
                                <Typography>{selectedAddress.postalCode}&nbsp;{selectedAddress.city}</Typography>
                                <Typography>{selectedAddress.voivodeship}</Typography>
                                <Typography>{selectedAddress.country}</Typography>
                            </Box>

                            <Tooltip title="Wybierz inny adres" arrow>
                                <IconButton onClick={handleEditAddress}>
                                    <ManageSearchIcon fontSize="large" color="primary" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Paper>

                    <Paper variant="outlined" sx={{
                        alignSelf: { xs: "auto", md: "stretch" },
                        width: { xs: "60%", md: "auto" }
                    }}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "center",
                            p: 1,
                            gap: 1
                        }}>
                            <Typography variant="h6">Suma</Typography>
                            <ReceiptLongIcon fontSize="large" color="primary" />
                        </Box>

                        <Divider />

                        <Box sx={{ p: 2 }}>
                            <PriceRow label="Wartość koszyka" price={cartSum} />
                            <PriceRow label="Dostawa" price={deliveryMethod.price} />
                            <PriceRow label="Razem" price={cartSum + Number(deliveryMethod.price)} />
                        </Box>
                    </Paper>

                    <Button variant="outlined" onClick={handleConfirmOrder} sx={{
                        mb: { xs: 2, md: 0 }
                    }}>
                        Zamawiam z obowiązkiem zapłaty
                    </Button>
                </Box>

                <AddressDialog addresses={addresses} addressIdSetter={setSelectedAddressId} isOpen={dialogOpen} dialogOpenSetter={setDialogOpen} />
            </Box>
        </Container>
    );
}

export default memo(OrderSummary);