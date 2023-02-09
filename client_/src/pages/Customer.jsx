import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Divider, Fab,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Rating,
    Select,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {ORDER_ROUTE} from "../utils/consts";
import {Link, useNavigate, useParams} from "react-router-dom";
import TablsPagination from "../components/TablsPagination";
import MyAlert from "../components/adminPageComponents/MyAlert";
import {fetchCustomerOrders} from "../http/orderAPI";
import {FormProvider, useForm} from "react-hook-form";
import {fetchMasters} from "../http/masterAPI";
import {STATUS_LIST} from "../store/OrderStore";
import {DateRangePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MasterRating from "../components/customerPageComponents/MasterRating";
import {fetchCities} from "../http/cityAPI";
import {fetchSize} from "../http/sizeAPI";
import SelectorMultiple from "../components/adminPageComponents/modals/SelectorMultiple";
import PaidIcon from '@mui/icons-material/Paid';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PayPalModal from "../components/customerPageComponents/PayPalModal";
import {useTranslation} from "react-i18next";
import "../i18next"
import enLocale from "date-fns/locale/en-US";

const STYLE_LIST = {
    ID: {width: 90, height: 70, position: "absolute", left: 0},
    NAME: {width: 100, height: 70, position: "absolute", left: 110},
    TIME: {width: 100, height: 70, position: "absolute", left: 230},
    END_TIME: {width: 100, height: 70, position: "absolute", left: 350},
    SIZE_NAME: {width: 100, height: 70, position: "absolute", left: 460},
    MASTER_NAME: {width: 90, height: 70, position: "absolute", left: 555, textAlign: "center"},
    CITY_NAME: {width: 80, height: 70, position: "absolute", left: 645, textAlign: "center"},
    PRICE: {width: 70, height: 70, position: "absolute", left: 740},
    STATUS: {width: 100, height: 70, position: "absolute", left: 820},
    PAYMENT: {position: "absolute", right: 160},
    MARK: {maxWidth: 150, position: "absolute", right: 70}
}
const STYLE_COMPONENT_LIST = {
    ID: {width: 60, position: "absolute", left: 30},
    NAME: {width: 100, position: "absolute", left: 120, wordWrap: "break-word"},
    TIME: {width: 100, position: "absolute", left: 220, textAlign: "center"},
    END_TIME: {width: 100, position: "absolute", left: 340, textAlign: "center", wordWrap: "break-word"},
    SIZE_NAME: {width: 100, position: "absolute", left: 450, wordWrap: "break-word", textAlign: "center"},
    MASTER_NAME: {width: 100, position: "absolute", left: 550, wordWrap: "break-word", textAlign: "center"},
    CITY_NAME: {width: 70, position: "absolute", left: 650, wordWrap: "break-word", textAlign: "center"},
    PRICE: {width: 70, position: "absolute", left: 760},
    STATUS: {width: 150, position: "absolute", left: 830},
    PAYMENT: {position: "absolute", right: 150},
    MARK: {position: "absolute", right: 30}
}

const localeMap = {
    en: enLocale,
    ru: ruLocale,
};

const defaultValues = {
    status: "",
    time: [null, null],
    cityId: null,
    masterId: null,
    forFilter: true,
    minPrice: "",
    maxPrice: "",
    cityList: [],
    masterList: [],
    sizeList: [],
}
const Customer = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const {id} = useParams()
    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        getValues,
        reset,
        watch,
        formState: {errors, dirtyFields}
    } = useForm({
        defaultValues
    });
    const resetLists = watch("reset", false)
    const status = watch("status", "")
    const [citiesList, setCitiesList] = useState([])
    const [ordersList, setOrdersList] = useState([])
    const [order, setOrder] = useState({})
    const [maxOrderPrice, setMaxOrderPrice] = useState(null)
    const [openRating, setOpenRating] = useState(false)
    const [openPayPal, setOpenPayPal] = useState(false)
    const [date, setDate] = useState([null, null]);
    const [loading, setLoading] = useState(true)
    const [sorting, setSorting] = useState("id")
    const [filters, setFilters] = useState(null)
    const [ascending, setAscending] = useState(true)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }
    const getCustomerOrders = async (id, page, limit, sorting, ascending, filters) => {
        try {
            const res = await fetchCustomerOrders(id, page, limit, sorting, ascending, filters)
            if (res.status === 204) {
                setOrdersList([])
                return
            }
            setOrdersList(res.data.rows)
            setTotalCount(res.data.count)
        } catch (e) {
            setOrdersList([])
        } finally {
            setLoading(false)
        }
    }
    useEffect(async () => {
        await getCustomerOrders(id, page, limit, sorting, ascending, filters)
    }, [page, limit, sorting, ascending, filters])
    useEffect(async () => {
        try {
            const res = await fetchCities(null, null)
            if (res.status === 204) {
                setCitiesList([])
                return
            }
            setCitiesList(res.data.rows)
        } catch (e) {
            setCitiesList([])
        }
        setMaxOrderPrice(Math.max(...ordersList.map(order => order.price)))
    }, [])
    const createFilter = async ({status, masterList, date, cityList, sizeList, minPrice, maxPrice}) => {
        const filter = {
            cityIDes: cityList.length !== 0 ? cityList.map(city => city.id) : null,
            masterIDes: masterList.length !== 0 ? masterList.map(master => master.id) : null,
            sizeIDes: sizeList.length !== 0 ? sizeList.map(size => size.id) : null,
            time: date.includes(null) ? null : date,
            status: status === "" ? null : status,
            minPrice: minPrice === "" ? null : minPrice,
            maxPrice: maxPrice === "" ? maxOrderPrice : maxPrice
        }
        setFilters(filter)
        setLoading(true)
    };
    const resetFilter = async () => {
        reset()
        setValue("reset", !resetLists)
        setDate([null, null])
        setFilters({})
    };
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
            <Box sx={{height: "750px", pt: 5, position: "relative"}}>
                <h2> {t("Customer.list")}</h2>
                <Box sx={{height: "650px"}}>
                    <Box sx={{flexGrow: 1, maxWidth: "1fr",}}>
                        <FormProvider register={register} errors={errors} trigger={trigger} getValues={getValues}
                                      setValue={setValue}>
                            <form onSubmit={handleSubmit(createFilter)}>
                                <Box>
                                    <Typography sx={{my: 1}}>
                                        {t("Filter.topic")}
                                    </Typography>
                                    <Box sx={{display: "flex", justifyContent: "space-between", mb: 2}}>
                                        <Box sx={{minHeight: 150, width: 300}}>
                                            <SelectorMultiple name={"cityList"} fetch={fetchCities}
                                                              label={t("Customer.filter.city")} id={"cities"}/>
                                            <SelectorMultiple name={"masterList"} fetch={fetchMasters}
                                                              label={t("Customer.filter.master")} id={"masters"}/>
                                            <SelectorMultiple name={"sizeList"} fetch={fetchSize}
                                                              label={t("Customer.filter.clock")} id={"sizes"}/>
                                        </Box>
                                        <Box>
                                            <Box sx={{display: "flex", justifyContent: "space-between", mt: 1}}>
                                                <FormControl sx={{minWidth: 100}} size="small">
                                                    <InputLabel
                                                        htmlFor="grouped-native-select">{t("status.label")}</InputLabel>
                                                    <Select
                                                        {...register("status")}
                                                        size={"small"}
                                                        labelId="status"
                                                        value={status || ""}
                                                        onChange={(event) => setValue("status", event.target.value)}
                                                        label={t("status.label")}
                                                    >
                                                        <MenuItem
                                                            value={STATUS_LIST.WAITING}>{t("status.WAITING")}</MenuItem>
                                                        <MenuItem
                                                            value={STATUS_LIST.REJECTED}>{t("status.REJECTED")}</MenuItem>
                                                        <MenuItem
                                                            value={STATUS_LIST.ACCEPTED}>{t("status.ACCEPTED")}</MenuItem>
                                                        <MenuItem value={STATUS_LIST.DONE}>{t("status.DONE")}</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <Box sx={{display: "flex"}}>
                                                    <TextField
                                                        {...register("minPrice",)}
                                                        type={"number"}
                                                        error={!!errors.maxPrice}
                                                        label={t("Customer.filter.startPrice")}
                                                        sx={{width: 130}} size={"small"}
                                                        onBlur={() => trigger("maxPrice")}/>
                                                    <Box sx={{mx: 2, mt: 1}}>{t("Customer.filter.to")}  </Box>
                                                    <TextField
                                                        {...register("maxPrice", {
                                                            validate: {
                                                                isBigger: value => Number(value) >= Number(getValues("minPrice")) ||
                                                                    dirtyFields.minPrice && dirtyFields.maxPrice && "больше"
                                                            }
                                                        })}
                                                        type={"number"}
                                                        error={!!errors.maxPrice}
                                                        label={t("Customer.filter.endPrice")}
                                                        helperText={errors.maxPrice?.message}
                                                        sx={{width: 130}}
                                                        size={"small"}
                                                        onBlur={() => trigger("maxPrice")}
                                                    />
                                                </Box>
                                                <FormControl variant="standard" sx={{minWidth: 60, ml: 2, mt: "-5px"}}
                                                             size="small">
                                                    <InputLabel id="limit">{t("limit")}</InputLabel>
                                                    <Select
                                                        labelId="limit"
                                                        id="limit"
                                                        value={limit}
                                                        onChange={(e) => setLimit(e.target.value)}
                                                        label={t("limit")}
                                                    >
                                                        <MenuItem value={10}>10</MenuItem>
                                                        <MenuItem value={25}>25</MenuItem>
                                                        <MenuItem value={50}>50</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <LocalizationProvider
                                                dateAdapter={AdapterDateFns}
                                                locale={localeMap[localStorage.getItem("i18nextLng")]}>

                                                <DateRangePicker
                                                    {...register("date",)}
                                                    mask='__.__.____'
                                                    value={date}
                                                    endText={t("Customer.filter.endData")}
                                                    startText={t("Customer.filter.startData")}
                                                    onChange={(newValue) => {
                                                        setDate(newValue);
                                                        setValue("date", newValue)
                                                    }}
                                                    renderInput={(startProps, endProps) => (
                                                        <React.Fragment key={1}>
                                                            <TextField size={"small"}{...startProps} />
                                                            <Box sx={{mx: 2}}> {t("Customer.filter.to")}  </Box>
                                                            <TextField sx={{mt: "12px"}} size={"small"} {...endProps} />
                                                        </React.Fragment>
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Box>
                                        <Box
                                            sx={{width: 200, mt: 2}}>
                                            <Button size={"small"} variant="contained" sx={{mb: 1}} color={"error"}
                                                    onClick={resetFilter}>{t("Filter.buttonReset")}</Button>
                                            <Button variant="contained" size={"small"} type="submit" color={"success"}
                                                    key="two">{t("Filter.buttonAccept")}</Button>
                                        </Box>
                                    </Box>
                                </Box>
                                <Divider/>
                            </form>
                        </FormProvider>
                        {loading ? <Box sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: window.innerHeight - 60,
                            }}>
                                <CircularProgress/>
                            </Box> :
                            <List disablePadding>
                                <ListItem
                                    sx={{height: 70}}
                                    key={1}
                                    divider
                                    secondaryAction={<Tooltip title={t("Customer.addOrder")}
                                                              placement="top"
                                                              arrow>
                                        <Link to={ORDER_ROUTE}>
                                            <IconButton sx={{width: 20}}
                                                        edge="end"
                                                        aria-label="addOrder"
                                                        onClick={() => navigate(ORDER_ROUTE)}
                                            >
                                                <AddIcon/>
                                            </IconButton>
                                        </Link>
                                    </Tooltip>}
                                >
                                    <ListItemButton
                                        selected={sorting === "id"}
                                        sx={STYLE_LIST.ID}
                                        onClick={() => sortingList("id")}>
                                        {t("Customer.orderNumber")}
                                        {ascending ? sorting === "id" && <ExpandMoreIcon/> : sorting === "id" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "name"}
                                        sx={STYLE_LIST.NAME}
                                        onClick={() => sortingList("name")}>
                                        {t("Customer.name")}
                                        {ascending ? sorting === "name" && <ExpandMoreIcon/> : sorting === "name" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "time"}
                                        sx={STYLE_LIST.TIME}
                                        onClick={() => sortingList("time")}>
                                        {t("Customer.time")}
                                        {ascending ? sorting === "time" && <ExpandMoreIcon/> : sorting === "time" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "endTime"}
                                        sx={STYLE_LIST.END_TIME}
                                        onClick={() => sortingList("endTime")}>
                                        {t("Customer.endTime")}
                                        {ascending ? sorting === "endTime" &&
                                            <ExpandMoreIcon/> : sorting === "endTime" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "sizeName"}
                                        sx={STYLE_LIST.SIZE_NAME}
                                        onClick={() => sortingList("sizeName")}>
                                        {t("Customer.clock")}
                                        {ascending ? sorting === "sizeName" &&
                                            <ExpandMoreIcon/> : sorting === "sizeName" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "masterName"}
                                        sx={STYLE_LIST.MASTER_NAME}
                                        onClick={() => sortingList("masterName")}>
                                        {t("Customer.master")}
                                        {ascending ? sorting === "masterName" &&
                                            <ExpandMoreIcon/> : sorting === "masterName" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "cityName"}
                                        sx={STYLE_LIST.CITY_NAME}
                                        onClick={() => sortingList("cityName")}>
                                        {t("Customer.city")}
                                        {ascending ? sorting === "cityName" &&
                                            <ExpandMoreIcon/> : sorting === "cityName" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "price"}
                                        sx={STYLE_LIST.PRICE}
                                        onClick={() => sortingList("price")}>
                                        {t("Customer.price")}
                                        {ascending ? sorting === "price" && <ExpandMoreIcon/> : sorting === "price" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemButton
                                        selected={sorting === "status"}
                                        sx={STYLE_LIST.STATUS}
                                        onClick={() => sortingList("status")}>
                                        {t("Customer.status")}
                                        {ascending ? sorting === "status" && <ExpandMoreIcon/> : sorting === "status" &&
                                            <ExpandLessIcon/>}
                                    </ListItemButton>
                                    <ListItemText sx={STYLE_LIST.PAYMENT}
                                                  primary={
                                                      <Tooltip title={t("Customer.pay")}
                                                               placement="top"
                                                               arrow>
                                                          <AccountBalanceWalletIcon/>
                                                      </Tooltip>}
                                    /> <ListItemText sx={STYLE_LIST.MARK}
                                                     primary={t("Customer.mark")}
                                />
                                </ListItem>
                                <Divider orientation="vertical"/>
                                {ordersList.length === 0 ?
                                    <h1>{t("emptyList")}</h1> : ordersList.map((order, index) => {
                                        const time = new Date(order.time).toLocaleString("uk-UA")
                                        const endTime = new Date(order.endTime).toLocaleString("uk-UA")
                                        return (<ListItem
                                            sx={{height: 70}}
                                            key={order.id}
                                            divider
                                        >
                                            <ListItemText sx={STYLE_COMPONENT_LIST.ID}
                                                          primary={order.id}
                                            />

                                            <ListItemText sx={STYLE_COMPONENT_LIST.NAME}
                                                          primary={order.name}
                                            />
                                            <ListItemText sx={STYLE_COMPONENT_LIST.TIME}
                                                          primary={time}
                                            />
                                            <ListItemText sx={STYLE_COMPONENT_LIST.END_TIME}
                                                          primary={endTime}
                                            />

                                            <ListItemText sx={STYLE_COMPONENT_LIST.SIZE_NAME}
                                                          primary={order.sizeClock.name}
                                            />
                                            <ListItemText sx={STYLE_COMPONENT_LIST.MASTER_NAME}
                                                          primary={order.master.name}
                                            />
                                            <ListItemText sx={STYLE_COMPONENT_LIST.CITY_NAME}
                                                          primary={order.city.name}
                                            />
                                            <ListItemText sx={STYLE_COMPONENT_LIST.PRICE}
                                                          primary={"$" + order.price}
                                            />
                                            <ListItemText sx={STYLE_COMPONENT_LIST.STATUS}
                                                          primary={order.status === STATUS_LIST.DONE ? t("status.DONE") :
                                                              order.status === STATUS_LIST.ACCEPTED ? t("status.ACCEPTED") :
                                                                  order.status === STATUS_LIST.REJECTED ? t("status.REJECTED") : t("status.WAITING")}
                                            />
                                            {!order.payPalId ?
                                                < Tooltip title={t("Customer.pay")}
                                                          placement="top"
                                                          arrow>
                                                    <IconButton sx={STYLE_COMPONENT_LIST.PAYMENT}
                                                                aria-label="upload picture"
                                                                component="label" onClick={() => {
                                                        setOpenPayPal(true)
                                                        setOrder(order)
                                                    }}>
                                                        <PaidIcon color="primary" fontSize={"large"}/>
                                                    </IconButton>
                                                </Tooltip> :
                                                < Tooltip title={t("Customer.paid")}
                                                          placement="top"
                                                          arrow>
                                                    <PriceCheckIcon color="success" sx={STYLE_COMPONENT_LIST.PAYMENT}
                                                                    fontSize={"large"}/>
                                                </Tooltip>}
                                            <ListItemText sx={STYLE_COMPONENT_LIST.MARK}
                                                          primary={order.rating !== null ? <Box>
                                                                  <Rating
                                                                      readOnly
                                                                      precision={0.5}
                                                                      value={order.rating.rating}
                                                                  /></Box>
                                                              : <Tooltip title={order.status !== "DONE" ?
                                                                  t("Customer.infoButton")
                                                                  : t("Customer.estimateTooltip")}
                                                                         placement="right"
                                                                         arrow>
                                              <span>
                                              <Button color="success"
                                                      size="small"
                                                      variant="outlined"
                                                      sx={{mr: 2}}
                                                      disabled={order.status !== STATUS_LIST.DONE}
                                                      onClick={() => {
                                                          setOrder(order)
                                                          setOpenRating(true)
                                                      }}>
                                                 {t("Customer.estimateButton")}
                                              </Button>
                                                  </span>
                                                              </Tooltip>}
                                            />
                                        </ListItem>)
                                    })}
                                <Divider/>
                            </List>
                        }
                        {openRating ? <MasterRating openRating={openRating}
                                                    uuid={order.ratingLink}
                                                    alertMessage={alertMessage}
                                                    getOrders={() => getCustomerOrders(id, page, limit, sorting, ascending, filters)}
                                                    onClose={() => {
                                                        setOpenRating(false)
                                                        setOrder({})
                                                    }}
                        /> : null}
                        {openPayPal ? <PayPalModal
                            open={openPayPal}
                            orderId={order.id}
                            orderPrice={order.price}
                            onClose={() => {
                                setOpenPayPal(false)
                                setOrder({})
                                getCustomerOrders(id, page, limit, sorting, ascending, filters)
                            }}
                        /> : null}
                    </Box>
                    <Box style={{display: "flex", justifyContent: "center"}}>
                        <TablsPagination page={page} totalCount={totalCount} limit={limit}
                                         pagesFunction={(page) => setPage(page)}/>
                    </Box>
                </Box>
            </Box>
            <MyAlert open={open}
                     onClose={() => setOpen(false)}
                     message={message}
                     isError={isError}/>
        </Box>

    );
};

export default Customer;