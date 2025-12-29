import { memo, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { buildPublicUrl } from "../../utils/api";
import { useSnackbar } from "notistack";

function DeliveryMethodCard({ sx: propsSx, onRadioChange: handleRadioChange }) {
    const { enqueueSnackbar } = useSnackbar();
    const [deliveryMethods, setDeliveryMethods] = useState(null);

    useEffect(() => {
        const fetchDeliveryMethods = async function () {
            const url = buildPublicUrl("/delivery/");

            try {
                const res = await fetch(url,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                ).then(res => res.json());

                setDeliveryMethods(res);
            }
            catch (error) {
                enqueueSnackbar(`Coś poszło nie tak podczas ładowania metod dostawy. ${error.message}`, { variant: "error", autoHideDuration: 6000 });
            }
        };

        fetchDeliveryMethods();
    }, [enqueueSnackbar]);

    return (
        <Card variant="outlined" sx={{ ...propsSx }}>
            <CardHeader
                avatar={<LocalShippingOutlinedIcon sx={{ fontSize: "1.75rem" }} />}
                title="Dostawa"
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
            <CardContent sx={{ pt: 0 }}>
                {deliveryMethods === null ?
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box> :
                    <FormControl sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end"
                    }}>
                        <RadioGroup name="delivery-radio-buttons-group" >
                            {deliveryMethods.map(dm => (
                                <FormControlLabel
                                    key={dm.id}
                                    value={dm.id}
                                    control={<Radio />}
                                    label={`${dm.name} ${dm.price} zł`}
                                    labelPlacement="start"
                                    onChange={handleRadioChange(dm)}
                                    sx={{
                                        color: "text.secondary"
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>}
            </CardContent>
        </Card>
    );
}

export default memo(DeliveryMethodCard);