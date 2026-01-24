import { memo, SyntheticEvent, useEffect, useState } from "react";
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
import { SxProps, Theme } from "@mui/material";
import { type DeliveryMethod, isDeliveryMethodArray } from "../types/DeliveryMethod.tsx";

type DeliveryMethodCardProps = {
    sx: SxProps<Theme>,
    onRadioChange: (deliveryMethod: DeliveryMethod) => (event?: SyntheticEvent<Element, Event>) => void
}

function DeliveryMethodCard({ sx: propsSx, onRadioChange: handleRadioChange }: DeliveryMethodCardProps) {
    const { enqueueSnackbar } = useSnackbar();
    const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[] | null>(null);

    useEffect(() => {
        const fetchDeliveryMethods = async function () {
            const url = buildPublicUrl("/delivery/");

            try {
                const res: unknown = await fetch(url,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                ).then(res => res.json());

                if (isDeliveryMethodArray(res)) {
                    setDeliveryMethods(res);
                }
                else {
                    enqueueSnackbar("Niewłaściwy typ danych", { variant: "error", autoHideDuration: 6000 });
                }
            }
            catch (error: unknown) {
                if (error instanceof Error)
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