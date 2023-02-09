import React from 'react';
import {Box, Modal} from "@mui/material";
import ReactPayPal from "../orderPageComponents/PayPal";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    whiteSpace: "pre-line",
    maxHeight: 800,
    overflowY: "auto",
    overflowX: "hidden",
    wordBreak: "break-word"
};

const PayPalModal = ({open, onClose, orderId, orderPrice}) => {
    const close = () => {
        onClose()
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={close}
            >
                <Box sx={style}>
                    <ReactPayPal
                        onClose={onClose}
                        open={open}
                        orderId={orderId}
                        value={orderPrice}/>
                </Box>
            </Modal>
        </div>
    );
};

export default PayPalModal;
