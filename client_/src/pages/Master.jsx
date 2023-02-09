import React, {useEffect, useState} from 'react';
import OrderListMaster from '../components/masterPageComponents/OrderListMaster'
import {Box, CircularProgress, IconButton, Tooltip} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import TablsPagination from "../components/TablsPagination";
import MyAlert from "../components/adminPageComponents/MyAlert";
import {fetchMasterOrders} from "../http/orderAPI";
import DateRangeIcon from '@mui/icons-material/DateRange';
import {CALENDAR_ROUTE, MASTER_ORDER_ROUTE} from "../utils/consts";
import {useTranslation} from "react-i18next";
import "../i18next"

const Master = () => {
    const {t} = useTranslation()
    const {id} = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    const [ordersList, setOrdersList] = useState([])
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [limit, setLimit] = useState(10)
    const [ascending, setAscending] = useState(true)
    const [sorting, setSorting] = useState("id")
    const [filters, setFilters] = useState(null)
    const [activated, setActivated] = useState(false)
    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }
    const getMasterOrders = async (id, page, limit, sorting, ascending, filter) => {
        try {
            const res = await fetchMasterOrders(id, page, limit, sorting, ascending, filter)
            setActivated(true)
            if (res.status === 204) {
                setOrdersList([])
                setTotalCount(0)
                return
            }
            setOrdersList(res.data.rows)
            setTotalCount(res.data.count)
        } catch (e) {
            setOrdersList([])
            setTotalCount(0)
        } finally {
            setLoading(false)
        }
    }
    useEffect(async () => {
        await getMasterOrders(id, page, limit, sorting, ascending, filters)
    }, [page, limit, sorting, ascending, filters])

    if (loading && !filters) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: window.innerHeight - 60,
            }}>
                <CircularProgress/>
            </Box>
        )
    }
    const sortingList = (param) => {
        if (sorting === param) {
            setAscending(!ascending)
            return
        }
        setAscending(true)
        setSorting(param)
    }
    return (
        <Box>
            {activated ?
                <Box sx={{minHeight: "750px", pt: 5, position: "relative"}}>
                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <h2>{t("Master.list")}</h2>
                        <Tooltip title={t("Master.calendar")}
                                 placement="left"
                                 arrow>
                            <Link to={`${MASTER_ORDER_ROUTE}/${id}${CALENDAR_ROUTE}`}
                                  style={{textDecoration: 'none', color: 'white', marginRight: "20px"}}>
                                <IconButton
                                    edge="end"
                                    aria-label="addCity"
                                    onClick={() => navigate(`${MASTER_ORDER_ROUTE}/${id}${CALENDAR_ROUTE}`)}
                                >
                                    <DateRangeIcon fontSize={"large"}/>
                                </IconButton>
                            </Link>
                        </Tooltip>

                    </Box>
                    <Box sx={{minHeight: "650px"}}>
                        <OrderListMaster sorting={sorting}
                                         ascending={ascending}
                                         ordersList={ordersList}
                                         loading={loading}
                                         limit={limit}
                                         setLimit={(e) => setLimit(e)}
                                         setLoading={(e) => setLoading(e)}
                                         setFilters={(filter) => setFilters(filter)}
                                         alertMessage={alertMessage}
                                         sortingList={(param) => sortingList(param)}/>
                    </Box>
                    <Box style={{display: "flex", justifyContent: "center"}}>
                        <TablsPagination page={page} totalCount={totalCount} limit={limit}
                                         pagesFunction={(page) => setPage(page)}/>
                    </Box>
                </Box>
                :
                <Box sx={{height: "800px", pt: 5, position: "relative"}}>

                    <Box style={{display: "flex", justifyContent: "center"}}>
                        <h3>{t("Master.activate")}</h3>
                    </Box>
                </Box>
            }
            <MyAlert open={open}
                     onClose={() => setOpen(false)}
                     message={message}
                     isError={isError}/>
        </Box>

    );
};

export default Master;