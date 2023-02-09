import React, {useEffect, useState} from "react";
import {Box, Button} from "@mui/material";
import {Link} from "react-router-dom";
import {START_ROUTE} from "../../utils/consts";
import {useTranslation} from "react-i18next";
import "../../i18next"
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";

const ReactPayPal = ({orderId, value, isAuth, userLink,open,onClose}) => {
    const [paid, setPaid] = useState(false);
    const [error, setError] = useState(null);
    const {t} = useTranslation()

    if (paid) {
        return (<Box>
            <div>{t("PayPal.success")}</div>
            {!open ?isAuth ?
                    <Link to={userLink}
                          style={{textDecoration: 'none', color: 'white'}}>
                        <Button variant="outlined"
                                fullWidth
                                navigate={userLink}>
                            {t("PayPal.toOrder")}</Button>
                    </Link> :
                    <Link to={START_ROUTE}
                          style={{textDecoration: 'none', color: 'white'}}>
                    <Button variant="outlined" fullWidth navigate={START_ROUTE}>{t("PayPal.toStart")}</Button>
                    </Link> : <Button variant="outlined" fullWidth onClick={() => onClose()}>закрыть</Button>
            }</Box>)
    }

    if (error) {
        return (<Box>
            <PayPalScriptProvider options={{"client-id": process.env.REACT_APP_PRODUCTION_CLIENT_ID}}>
                <PayPalButtons
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    description: `${orderId}`,
                                    amount: {
                                        currency_code: "USD",
                                        value: value,
                                    },
                                },
                            ],
                        });
                    }}
                    onApprove={(data, actions) => {
                        return actions.order.capture().then(() => {
                            setPaid(true)
                        });
                    }}
                />
            </PayPalScriptProvider>
            <div>{t("PayPal.error")}</div>
            {isAuth ?
                <Link to={userLink}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Button variant="outlined"
                            fullWidth
                            navigate={userLink}>
                        {t("PayPal.notPay")} </Button>
                </Link> :
                <Link to={START_ROUTE}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Button variant="outlined" fullWidth navigate={START_ROUTE}>{t("PayPal.toStart")}</Button>
                </Link>
            }
        </Box>)
    }
    return (
        <div>

            <span>{t("PayPal.pay")}</span>
            <PayPalScriptProvider options={{"client-id": process.env.REACT_APP_PRODUCTION_CLIENT_ID}}>
                <PayPalButtons
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    description: `${orderId}`,
                                    amount: {
                                        currency_code: "USD",
                                        value: value,
                                    },
                                },
                            ],
                        });
                    }}
                    onApprove={(data, actions) => {
                        return actions.order.capture().then(() => {
                            setPaid(true)
                        });
                    }}
                    onError={() => {
                        setError(true)
                    }}
                />
            </PayPalScriptProvider>
                    {!open?isAuth ?
                        <Link to={userLink}
                              style={{textDecoration: 'none', color: 'white'}}>
                            <Button variant="outlined"
                                    fullWidth
                                    navigate={userLink}>
                                {t("PayPal.notPay")} </Button>
                        </Link> :
                        <Link to={START_ROUTE}
                              style={{textDecoration: 'none', color: 'white'}}>
                            <Button variant="outlined" fullWidth navigate={START_ROUTE}>{t("PayPal.notPay")}</Button>
                        </Link>:null
                    }

        </div>
    );
}
export default ReactPayPal