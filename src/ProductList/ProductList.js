import { useEffect, useState } from "react";
import "./ProductList.css";
import { buildPublicUrl, buildSecureUrl } from "../utils/api";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

export default function ProductList() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [productList, setProductList] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    function addToCart(event, id, name) {
        event.preventDefault();

        const token = Cookies.get("auth-token");

        if (!token) {
            navigate("/login");

            return;
        }

        const url = buildSecureUrl(`/carts/${id}/1`);

        fetch(url, {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        }).then(async res => {
            if (res.ok) {
                const splittedName = name.split(" ");
                let shortName;

                if (splittedName.length > 2) {
                    shortName = splittedName[0] + " " + splittedName[1] + "...";
                }
                else {
                    shortName = name;
                }

                enqueueSnackbar(`Dodano do koszyka "${shortName}"`, { variant: "success", autoHideDuration: 3000 });
            } else {
                const errorResponse = await res.json();

                console.log(`Error on adding to cart: ${errorResponse}`);
                enqueueSnackbar("Nie udało się dodać do koszyka.", { variant: "error", autoHideDuration: 3000 });
            }
        });
    }

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
        <Container>
            <Stack spacing={4} sx={{ mb: 4 }}>
                {productList.map(p => (
                    <Card key={p.id} elevation={4} sx={{
                        "&:hover": { bgcolor: "#F7F7F7" },
                        transition: "0.2s"
                    }}>
                        <Box sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: { xs: "flex-start", sm: "space-between" },
                            alignItems: { xs: "center", sm: "initial" }
                        }}>
                            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "initial", sm: "flex-start" } }}>
                                <Box sx={{ textAlign: { xs: "center", sm: "start" } }}>
                                    <Typography variant="h5" fontWeight="500" gutterBottom>{p.name}</Typography>
                                    <Typography color="text.secondary">Ilość: {p.amount}</Typography>
                                    <Typography color="text.secondary">{p.price.replace(".", ",")} zł za sztukę</Typography>
                                </Box>

                                <Button sx={{ display: { xs: "none", sm: "inline-flex" }, marginTop: "auto" }} startIcon={<ShoppingCartIcon />} onClick={(e) => addToCart(e, p.id, p.name)}>Dodaj do koszyka</Button>
                            </CardContent>
                            <CardMedia
                                component="img"
                                sx={{
                                    m: { xs: 1, sm: 2 },
                                    width: { xs: 300, sm: 200 },
                                    height: { xs: 300, sm: 200 },
                                    transition: "0.5s ease",
                                    "&:hover": {
                                        transform: "scale(1.05)"
                                    }
                                }}
                                image={(p.imageIds.length > 0) && buildPublicUrl("/products/images/" + p.imageIds[0])}
                                alt={p.name}
                            />
                            <CardActions sx={{ display: { xs: "inline-flex", sm: "none" } }}>
                                <Button startIcon={<ShoppingCartIcon />} onClick={(e) => addToCart(e, p.id, p.name)}>Dodaj do koszyka</Button>
                            </CardActions>
                        </Box>
                    </Card>
                ))}
            </Stack>
        </Container>
    );
}