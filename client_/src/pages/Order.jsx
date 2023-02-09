import {Card, CardContent, Container,} from "@mui/material";
import React, {useState} from "react";
import OrderStepper from "../components/orderPageComponents/OrderStepper"
import MyAlert from "../components/adminPageComponents/MyAlert";
import {useTranslation} from "react-i18next";
import "../i18next"

const Order = () => {
    const {t} = useTranslation()
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }


    return (
        <Container
            maxWidth="xl"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "800px",
            }}
        >
            <Card sx={{width: 1000, p: 1, bgcolor: '#f5f5f5'}}>
                <CardContent>
                    <OrderStepper alertMessage={alertMessage}/>
                </CardContent>
            </Card>
            <MyAlert open={open}
                     onClose={() => setOpen(false)}
                     message={message}
                     isError={isError}/>
        </Container>
    );
};

export default Order;
