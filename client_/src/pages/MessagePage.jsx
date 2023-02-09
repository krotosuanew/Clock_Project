import * as React from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import "../i18next"
import Box from "@mui/material/Box";
import {Button, Container, Typography} from "@mui/material";
import {ACTIVATED_ROUTE, CONGRATULATION_ROUTE, LOGIN_ROUTE, START_ROUTE} from "../utils/consts";
import {useTranslation} from "react-i18next";

const MessagePage = () => {
    const {t} = useTranslation()
    const location = useLocation();
    const activated = location.pathname === ACTIVATED_ROUTE;
    const congratulated = location.pathname === CONGRATULATION_ROUTE;
    const navigate = useNavigate()
    return (
        activated ?
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Container
                    maxWidth="xl"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: window.innerHeight - 60,
                    }}
                > <Box sx={{
                    mt: 5,
                    display: 'flex',
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}>

                    <Typography variant="h6" gutterBottom component="div">
                        {t("MessagePage.activated")}
                    </Typography>
                    <Typography sx={{text: "center"}} variant="h6" gutterBottom component="div">
                        {t("MessagePage.info")}
                    </Typography>
                    <Link to={LOGIN_ROUTE}
                          style={{textDecoration: 'none', color: 'black'}}>
                        <Button size="large"
                                color="warning"
                                variant="contained"
                                onClick={() => navigate(LOGIN_ROUTE)}>
                            {t("MessagePage.authorization")}
                        </Button>
                    </Link>
                </Box>
                </Container>
            </Box> : congratulated ?
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <Container
                        maxWidth="xl"
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: window.innerHeight - 60,
                        }}
                    >
                        <Box sx={{
                            mt: 5,
                            display: 'flex',
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>

                            <Typography variant="h6" gutterBottom component="div">
                                {t("MessagePage.linkInfo")}
                            </Typography>
                            <Typography sx={{text: "center"}} variant="h6" gutterBottom component="div">
                                {t("MessagePage.toStart")}
                            </Typography>
                            <Link to={START_ROUTE}
                                  style={{textDecoration: 'none', color: 'black'}}>
                                <Button size="large" variant="outlined" onClick={() => navigate(START_ROUTE)}>
                                    {t("MessagePage.toStart")}
                                </Button>
                            </Link>
                        </Box>
                    </Container>
                </Box> : null

    );
};

export default MessagePage