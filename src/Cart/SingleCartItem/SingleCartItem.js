import { memo } from "react";
import { buildPublicUrl, getPriceAsText } from "../../utils/api";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

function SingleCartItem({ cartEntry, sx: propsSx }) {
    return (
        <Card variant="outlined" sx={{
            ...propsSx,
            "&:hover": {
                bgcolor: "#F7F7F7",
                transition: "0.2s"
            }
        }}>
            <Box>
                <CardHeader
                    avatar={<ShoppingBagOutlinedIcon sx={{ fontSize: "1.75rem" }} />}
                    title={cartEntry.productName}
                    sx={{
                        "& .MuiCardHeader-title": {
                            fontSize: "1rem"
                        },
                        "&.MuiCardHeader-root": {
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-end"
                        }
                    }}
                />
                <CardContent>
                    <Typography color="text.secondary">Ilość: {cartEntry.quantity}</Typography>
                    <Typography color="text.secondary">Cena: {getPriceAsText(cartEntry.price)} zł</Typography>
                    <Typography color="text.secondary">Kwota częściowa: {getPriceAsText(cartEntry.quantity * cartEntry.price)} zł</Typography>
                </CardContent>
            </Box>
            <CardMedia
                component="img"
                image={buildPublicUrl(`/products/images/${cartEntry.imageIds[0]}`)}
                alt={cartEntry.productName}
                sx={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    alignSelf: "center",
                    mr: 4,
                    transition: "0.5s ease",
                    "&:hover": {
                        transform: "scale(1.05)"
                    }
                }}
            />
        </Card>
    );
}

export default memo(SingleCartItem);