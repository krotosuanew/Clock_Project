import * as React from 'react';
import {useEffect} from 'react';
import Cards from "../components/startPageComponents/cards"
import AboutCompany from "../components/startPageComponents/aboutCompany";
import {Box, Button} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {ORDER_ROUTE} from "../utils/consts";
import {check} from "../http/userAPI";
import {setIsAuthUserAction, setUserAction, setUserNameAction, setUserRoleAction} from "../store/UserStore";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import "../i18next"

const Start = () => {
    const {t} = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(async () => {
        if (localStorage.getItem('token') !== "" ||
            localStorage.getItem('token')) {
            try {
                const data = await check()
                dispatch(setUserAction(data))
                dispatch(setUserNameAction(data.name))
                dispatch(setIsAuthUserAction(true))
                dispatch(setUserRoleAction(data.role))
            } catch {
                localStorage.setItem('token', "")
            }
        }
    }, [])

    return (
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <AboutCompany/>
            <Cards/>

            <Box>
                <Link to={ORDER_ROUTE}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Button fullWidth sx={{mt: 2, mb: 10}} variant="outlined" color={"warning"}
                            onClick={() => navigate(ORDER_ROUTE)}>
                        {t("startPage.button")}
                    </Button>
                </Link>
            </Box>

        </Box>

    );
};

export default Start