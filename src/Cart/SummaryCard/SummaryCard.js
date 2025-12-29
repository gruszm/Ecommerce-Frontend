import { memo } from "react";
import { getPriceAsText } from "../../utils/api";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import { useNavigate } from "react-router-dom";
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import Tooltip from "@mui/material/Tooltip";

function SummaryCard({ deliveryMethod, totalAmount }) {
    const navigate = useNavigate();

    const handleSummaryClick = () => {
        navigate("/order-summary", {
            state: {
                deliveryMethodId: deliveryMethod.id
            }
        });
    };

    return (
        <Card variant="outlined">
            <CardHeader
                avatar={<InventoryRoundedIcon sx={{ fontSize: "1.75rem" }} />}
                title="Łącznie"
                sx={{
                    "& .MuiCardHeader-avatar": {
                        mr: 0,
                        ml: 1
                    },
                    "& .MuiCardHeader-title": {
                        fontSize: "1rem",
                        textAlign: "end",
                        fontWeight: 500
                    },
                    "&.MuiCardHeader-root": {
                        display: "flex",
                        flexDirection: "row-reverse",
                        alignItems: "center",
                        // borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
                    }
                }}
            />
            <CardContent sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                pt: 0
            }}>
                <Typography color="text.secondary">Cena produktów: {getPriceAsText(totalAmount)} zł</Typography>
                <Typography color="text.secondary">
                    Dostawa: {deliveryMethod ? `${getPriceAsText(deliveryMethod.price)} zł` : "Nie wybrano"}
                </Typography>
                {deliveryMethod && <Typography color="text.secondary">Kwota łączna: {getPriceAsText(totalAmount)} zł</Typography>}
            </CardContent>
            <CardActions sx={{
                p: 2,
                justifyContent: "flex-end"
            }}>
                <Tooltip title="Podsumuj zamówienie">
                    <Button
                        variant="contained"
                        disabled={deliveryMethod === null}
                        onClick={handleSummaryClick}
                        sx={{ p: 1, minWidth: 0 }}
                    >
                        <SummarizeOutlinedIcon fontSize="large" />
                    </Button>
                </Tooltip>
            </CardActions>
        </Card>
    );
}

export default memo(SummaryCard);