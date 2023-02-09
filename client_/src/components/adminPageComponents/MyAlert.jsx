import React from 'react';
import {Snackbar, Alert} from "@mui/material";

const MyAlert = ({open, onClose, message, isError}) => {
    return (<Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
        <Alert onClose={onClose}
               severity={isError ? "error" : "success"}>{message}</Alert>
    </Snackbar>);
};

export default MyAlert;
