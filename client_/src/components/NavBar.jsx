import * as React from 'react';
import {AppBar, Button, Container, FormControl, InputLabel, MenuItem, Select, Toolbar, Typography} from '@mui/material';
import {Link, useNavigate} from "react-router-dom";
import {ADMIN_ROUTE, CUSTOMER_ORDER_ROUTE, LOGIN_ROUTE, MASTER_ORDER_ROUTE, START_ROUTE} from "../utils/consts";
import {useDispatch, useSelector} from "react-redux";
import {resetUserAction} from "../store/UserStore";
import {useTranslation} from "react-i18next";
import "../i18next"


const NavBar = () => {
    const {t, i18n} = useTranslation()
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const logOut = () => {
        localStorage.removeItem('token')
        dispatch(resetUserAction())
        navigate(START_ROUTE)
    }
    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value)
    }
    return (
        <React.Fragment>
            <AppBar color="warning" position="fixed">
                <Container maxWidth="xl">
                    {user.isAuth && user.user.isActivated || user.userRole === "ADMIN" ?
                        <Toolbar>

                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                <Link to={START_ROUTE}
                                      style={{textDecoration: 'none', color: 'white'}}>
                                <span onClick={() => navigate(START_ROUTE)}
                                      style={{cursor: "pointer"}}>Clockwise Clockware</span>
                                </Link>
                            </Typography>
                            {user.userRole === "ADMIN" ?
                                <Link to={ADMIN_ROUTE}
                                      style={{textDecoration: 'none', color: 'white'}}>
                                    <Button variant="outlined"
                                            color="inherit"
                                            onClick={() => navigate(ADMIN_ROUTE)}>
                                        {t("NavBar.adminPanel")}
                                    </Button>
                                </Link> :
                                user.userRole === "CUSTOMER" ?
                                    <Link to={`${CUSTOMER_ORDER_ROUTE}/${user.user.id}`}
                                          style={{textDecoration: 'none', color: 'white'}}>
                                        <Button variant="outlined" color="inherit"
                                                onClick={() => {
                                                    navigate(`${CUSTOMER_ORDER_ROUTE}/${user.user.id}`)
                                                }}>
                                            {t("NavBar.orderList")}
                                        </Button>
                                    </Link> :
                                    user.userRole === "MASTER" ?
                                        <Link to={`${MASTER_ORDER_ROUTE}/${user.user.id}`}
                                              style={{textDecoration: 'none', color: 'white'}}>
                                            <Button variant="outlined" color="inherit"
                                                    onClick={() => {
                                                        navigate(`${MASTER_ORDER_ROUTE}/${user.user.id}`)
                                                    }}>
                                                {t("NavBar.orderList")}
                                            </Button>
                                        </Link> : null
                            }
                            <Link to={START_ROUTE}
                                  style={{textDecoration: 'none', color: 'white'}}>
                                <Button variant="outlined" sx={{ml: 2}} color="inherit"
                                        onClick={() => logOut()}>{t("NavBar.logOut")}</Button>
                            </Link>
                            <FormControl variant="standard" sx={{ml: 2}}>
                                <InputLabel sx={{textDecoration: 'none', color: 'white',}}
                                            id="demo-simple-select-label">{t("language")}</InputLabel>
                                <Select
                                    size={"small"}
                                    sx={{color: 'white'}}
                                    labelId="Language"
                                    id="Language"
                                    label="Language"
                                    value={localStorage.getItem("i18nextLng")}
                                    onChange={changeLanguage}
                                >
                                    <MenuItem value={"ru"}>Русский</MenuItem>
                                    <MenuItem value={"en"}>English</MenuItem>
                                </Select>
                            </FormControl>
                        </Toolbar>

                        :

                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                <Link to={START_ROUTE}
                                      style={{textDecoration: 'none', color: 'white'}}>
                                <span onClick={() => navigate(START_ROUTE)}
                                      style={{cursor: "pointer"}}>Clockwise Clockware</span>
                                </Link>
                            </Typography>
                            <Link to={LOGIN_ROUTE}
                                  style={{textDecoration: 'none', color: 'white'}}>
                                <Button variant="outlined" color="inherit"> {t("NavBar.signIn")}</Button>
                            </Link>
                            <FormControl variant="standard" sx={{ml: 2}}>
                                <InputLabel sx={{textDecoration: 'none', color: 'white',}}
                                            id="demo-simple-select-label">{t("language")}</InputLabel>
                                <Select
                                    size={"small"}
                                    sx={{color: 'white'}}
                                    labelId="Language"
                                    id="Language"
                                    label="Language"
                                    value={localStorage.getItem("i18nextLng")}
                                    onChange={changeLanguage}
                                >
                                    <MenuItem value={"ru"}>Русский</MenuItem>
                                    <MenuItem value={"en"}>English</MenuItem>
                                </Select>
                            </FormControl>
                        </Toolbar>}
                </Container>
            </AppBar>
        </React.Fragment>

    );
}

export default NavBar