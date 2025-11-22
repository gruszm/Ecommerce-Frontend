import "./AddressList.css"
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { buildSecureUrl } from "../utils/api";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Box from "@mui/material/Box";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import IconButton from "@mui/material/IconButton";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Zoom from "@mui/material/Zoom";

export default function AddressList(props) {
    const [addresses, setAddresses] = useState([]);
    const [errMsg, setErrMsg] = useState("");
    const [popperData, setPopperData] = useState({ anchorEl: null, addressId: null });

    useEffect(() => {
        const url = buildSecureUrl("/profiles/addresses");
        const token = Cookies.get("auth-token");

        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            method: "GET"
        }).then(res => {
            if (res.ok) {
                res.json().then(parsed => setAddresses(parsed));

            } else if (res.status === 404) {
                setErrMsg("Nie masz jeszcze żadnych adresów.");
            } else {
                res.json().then(parsed => setErrMsg(parsed.message));
            }
        }).catch(err => {
            setErrMsg(err.message);
        });
    }, []);

    const handleDeleteButton = (event, addressId) => {
        setPopperData(prev => prev.anchorEl === event.currentTarget
            ? { anchorEl: null, addressId: null }
            : { anchorEl: event.currentTarget, addressId });
    };

    const closePopper = () => {
        setPopperData({ anchorEl: null, addressId: null });
    };

    const confirmAddressDeletion = () => {
        const newAddresses = addresses.filter((_, index) => index !== popperData.addressId);

        closePopper();

        // Let the popper close, as the default leavingScreen is 195ms transition duration, then actually update the list
        setTimeout(() => {
            setAddresses(newAddresses);
        }, 195);
    };

    return (
        <Container>
            <ClickAwayListener mouseEvent="onMouseDown" touchEvent="onTouchStart" onClickAway={closePopper}>
                <Popper open={Boolean(popperData.anchorEl)} anchorEl={popperData.anchorEl} placement="bottom" transition>
                    {({ TransitionProps }) => (
                        <Zoom {...TransitionProps} style={{ transformOrigin: "center top" }}>
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: "background.paper",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 1,
                                    maxWidth: "250px",
                                    textAlign: "center",
                                    px: 0
                                }}>
                                <Typography variant="h6" sx={{ marginBottom: 2 }}>Czy na pewno chcesz usunąć ten adres?</Typography>

                                <Stack direction="row" sx={{ justifyContent: "space-evenly" }}>
                                    <Button variant="contained" color="success" size="large" onClick={confirmAddressDeletion}>TAK</Button>
                                    <Button variant="contained" color="error" size="large" onClick={closePopper}>NIE</Button>
                                </Stack>
                            </Box>
                        </Zoom>
                    )}
                </Popper>
            </ClickAwayListener>

            <Grid container spacing={2}>
                {addresses.map(addr => (
                    <Grid size={{ xs: 6, sm: 4 }} key={addr.id}>
                        <Card
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                transition: "0.2s",
                                "&:hover": { boxShadow: 3 },
                                position: "relative"
                            }}>
                            <Box>
                                <IconButton onClick={(e) => handleDeleteButton(e, addr.id)} sx={{
                                    position: "absolute",
                                    top: { xs: 7, sm: 10 },
                                    right: { xs: 6, sm: 9 }
                                }}>
                                    <RemoveCircleIcon color="error" sx={{
                                        fontSize: { xs: 35, sm: 40 }
                                    }} />
                                </IconButton>
                                <CardContent sx={{ textAlign: "center" }}>
                                    <LocationOnOutlinedIcon sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
                                    <Typography variant="h6" fontWeight={600}>
                                        {addr.street} {addr.houseNumber}{addr.apartmentNumber ? `/${addr.apartmentNumber}` : ""}
                                    </Typography>
                                    <Typography color="text.secondary">{addr.city}, {addr.postalCode}</Typography>
                                    <Typography color="text.secondary">{addr.voivodeship}, {addr.country}</Typography>
                                </CardContent>
                            </Box>
                        </Card>

                    </Grid>
                ))}
            </Grid>
        </Container >
    );
}