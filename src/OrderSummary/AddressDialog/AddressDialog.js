import { useState, memo } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { green } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";

function AddressDialog({ isOpen, dialogOpenSetter, addresses, addressIdSetter }) {
    const handleSelectAddress = (id) => (event) => {
        addressIdSetter(id);
        dialogOpenSetter(false);
    }

    const handleClose = () => {
        dialogOpenSetter(false);
    };

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>
                Wybór adresu
            </DialogTitle>
            <IconButton sx={{
                position: "absolute",
                right: 4,
                top: 4
            }}>
                <CloseIcon fontSize="large" />
            </IconButton>
            <DialogContent sx={{ p: 0 }}>
                <List sx={{ pt: 0 }}>
                    {addresses.map(a => (
                        <ListItem key={a.id}>
                            <Paper variant="outlined" sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: 2,
                                width: "320px"
                            }}>
                                <Box>
                                    <Typography variant="h6">{a.street}&nbsp;{a.houseNumber}{a.apartmentNumber ? `\u00A0/\u00A0${a.apartmentNumber}` : null}</Typography>
                                    <Typography>{a.postalCode}&nbsp;{a.city}</Typography>
                                    <Typography>{a.voivodeship}</Typography>
                                    <Typography>{a.country}</Typography>
                                </Box>
                                <Tooltip title="Dostarcz tutaj" arrow>
                                    <IconButton onClick={handleSelectAddress(a.id)}>
                                        <TaskAltIcon fontSize="large" sx={{ color: green[500] }} />
                                    </IconButton>
                                </Tooltip>
                            </Paper>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
}

export default memo(AddressDialog);