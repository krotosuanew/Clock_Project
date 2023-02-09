import React, {useEffect, useState} from 'react';
import {Box, Divider, Link, List, ListItemButton, ListItemText, styled} from "@mui/material";
import CityList from "../components/adminPageComponents/CityList"
import MasterList from "../components/adminPageComponents/MasterList";
import OrderList from "../components/adminPageComponents/OrderList";
import UserList from "../components/adminPageComponents/UserList";
import SizeList from "../components/adminPageComponents/SizeClock";
import {useLocation, useNavigate} from "react-router-dom";
import {
    ADMIN_CITY_LIST_ROUTE,
    ADMIN_MASTER_LIST_ROUTE,
    ADMIN_ORDER_LIST_ROUTE,
    ADMIN_ROUTE,
    ADMIN_SIZES_ROUTE,
    ADMIN_USERS_ROUTE,
    STATISTICS_ROUTE,
} from "../utils/consts";
import CreateCity from "../components/adminPageComponents/modals/CreateCity";
import CreateMaster from "../components/adminPageComponents/modals/CreateMaster";
import CreateSize from "../components/adminPageComponents/modals/CreateSize";
import MyAlert from "../components/adminPageComponents/MyAlert";
import {getCities} from "../asyncActions/cities";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import "../i18next"

const SelectButton = styled(ListItemButton)`
  &.Mui-selected {
    color: #03a9f4
  }
`;
const Admin = () => {
    const {t} = useTranslation()
    const location = useLocation();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cityList = location.pathname === ADMIN_CITY_LIST_ROUTE;
    const masterList = location.pathname === ADMIN_MASTER_LIST_ROUTE;
    const sizeList = location.pathname === ADMIN_SIZES_ROUTE;
    const orderList = location.pathname === ADMIN_ORDER_LIST_ROUTE;
    const usersList = location.pathname === ADMIN_USERS_ROUTE
    const statistics = location.pathname === STATISTICS_ROUTE
    const adminRoute = location.pathname === ADMIN_ROUTE
    const [cityVisible, setCityVisible] = useState(false)
    const [masterVisible, setMasterVisible] = useState(false)
    const [sizeVisible, setSizeVisible] = useState(false)
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }
    useEffect(async () => {
        await dispatch(getCities(null, null))
    }, []);


    const preventDefault = (event) => event.preventDefault();

    return (
        <Box sx={{
            width: 1400,
            background: "white",
            mt: 8,
            position: "relative",
            top: 0,
            right: 100,
            minHeight: document.documentElement.clientHeight,
            px: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"menu main main main main" 
                                    "menu main main main main"
                                    "menu main main main main"`

        }}>
            <List sx={{
                width: '100%', maxWidth: 250, gridArea: 'menu',
            }}
                  component="nav"
                  aria-label="mailbox folders">
                <Link href={ADMIN_ORDER_LIST_ROUTE}
                      onClick={preventDefault}
                      underline="none"
                      color="inherit">
                    <SelectButton
                        selected={orderList || adminRoute}
                        onClick={() => navigate(ADMIN_ORDER_LIST_ROUTE)}>
                        <ListItemText primary={t("AdminMenu.orders")}/>
                    </SelectButton>
                </Link>
                <Divider/>
                <Link href={ADMIN_CITY_LIST_ROUTE}
                      onClick={preventDefault}
                      underline="none"
                      color="inherit">
                    <SelectButton
                        selected={cityList}
                        onClick={() => navigate(ADMIN_CITY_LIST_ROUTE)}>
                        <ListItemText primary={t("AdminMenu.cities")}/>
                    </SelectButton>
                </Link>
                <Divider light/>
                <Link href={ADMIN_MASTER_LIST_ROUTE}
                      onClick={preventDefault}
                      underline="none"
                      color="inherit">
                    <SelectButton
                        selected={masterList}
                        onClick={() => navigate(ADMIN_MASTER_LIST_ROUTE)}>
                        <ListItemText primary={t("AdminMenu.masters")}/>
                    </SelectButton>
                </Link>
                <Divider light/>
                <Link href={ADMIN_SIZES_ROUTE}
                      onClick={preventDefault}
                      underline="none"
                      color="inherit">
                    <SelectButton
                        selected={sizeList}
                        onClick={() => navigate(ADMIN_SIZES_ROUTE)}>
                        <ListItemText primary={t("AdminMenu.clocks")}/>
                    </SelectButton>
                </Link>
                <Divider light/>

                <Link href={ADMIN_USERS_ROUTE}
                      onClick={preventDefault}
                      underline="none"
                      color="inherit">
                    <SelectButton
                        selected={usersList}
                        onClick={() => navigate(ADMIN_USERS_ROUTE)}>
                        <ListItemText primary={t("AdminMenu.users")}/>
                    </SelectButton>
                </Link>
                <Link href={STATISTICS_ROUTE}
                      onClick={preventDefault}
                      underline="none"
                      color="inherit">
                    <SelectButton
                        selected={statistics}
                        onClick={() => navigate(STATISTICS_ROUTE)}>
                        <ListItemText primary={t("AdminMenu.statistics")}/>
                    </SelectButton>
                </Link>
            </List>
            <Box sx={{gridArea: 'main', ml: 1}}>
                {cityList ? <CityList alertMessage={alertMessage}
                /> : masterList ? <MasterList alertMessage={alertMessage}
                /> : sizeList ? <SizeList alertMessage={alertMessage}
                /> : orderList || adminRoute ? <OrderList
                    alertMessage={alertMessage}
                /> : usersList ? <UserList
                    alertMessage={alertMessage}
                /> : <Box sx={{height: "800px"}}> </Box>}

            </Box>
            <CreateCity open={cityVisible}
                        onClose={() => setCityVisible(false)}
                        alertMessage={alertMessage}/>
            <CreateMaster open={masterVisible}
                          onClose={() => setMasterVisible(false)}
                          alertMessage={alertMessage}
            />
            <CreateSize open={sizeVisible}
                        onClose={() => setSizeVisible(false)}
                        alertMessage={alertMessage}
            />
            <MyAlert open={open}
                     onClose={() => setOpen(false)}
                     message={message}
                     isError={isError}/>
        </Box>

    );
};

export default Admin;