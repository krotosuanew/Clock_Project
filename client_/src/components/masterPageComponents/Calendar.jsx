import React, {useEffect, useState} from 'react';
import "./calendar.css"
import {
    addDays,
    addMonths,
    addWeeks,
    eachDayOfInterval,
    endOfDay,
    endOfWeek,
    format,
    getDate,
    getISODay,
    getYear,
    isAfter,
    isSameDay,
    isSameMonth,
    isToday,
    lastDayOfMonth,
    lastDayOfWeek,
    setDate,
    startOfDay,
    startOfWeek,
} from "date-fns";
import {Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography} from "@mui/material";
import {MASTER_ORDER_ROUTE} from "../../utils/consts";
import {Link, useNavigate, useParams} from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {fetchMasterOrders, statusChangeOrder} from "../../http/orderAPI";
import {STATUS_LIST} from "../../store/OrderStore";
import ruLocale from "date-fns/locale/ru";
import Loader from "../Loader";
import {useTranslation} from "react-i18next";
import "../../i18next"

const STYLE_MODAL = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1150,
    boxShadow: 24,
    p: 0,
    maxHeight: 800,
    overflowY: "hidden",
    overflowX: "hidden",
};

const Calendar = () => {
    const {t} = useTranslation()
    const {id} = useParams()
    const navigate = useNavigate()
    const [range, setRange] = useState("month")
    const [fullDate, setFullDate] = useState(new Date())
    const [fullWeekDate, setFullWeekDate] = useState(new Date())
    const [fullDayDate, setFullDayDate] = useState(new Date())
    const [calendar, setCalendar] = useState([])
    const [loading, setLoading] = useState(true)
    const [ordersList, setOrdersList] = useState([])
    const [selectedDay, setSelectedDay] = useState(null)
    const limitOrder = 3
    const getWeekDays = (locale) => {
        const now = new Date();
        const weekDays = [];
        const start = startOfWeek(now, {locale});
        const end = endOfWeek(now, {locale});
        eachDayOfInterval({start, end}).forEach(day => {
            weekDays.push(format(day, "EEEEEE", {locale}));
        });
        return weekDays;
    };
    const days = getWeekDays(ruLocale)
    const getMasterOrders = async (id, page, limit, sorting, ascending, filter) => {
        try {
            const res = await fetchMasterOrders(id, null, null, "time", true, filter)
            if (res.status === 204) {
                setOrdersList([])
                return
            }
            setOrdersList(res.data.rows)
        } catch (e) {
            setOrdersList([])
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        setLoading(true)
        setOrdersList([])
        if (selectedDay) {
            getMasterOrders(id, null, null, null, null, {time: [startOfDay(selectedDay), endOfDay(selectedDay)]})
            return
        }
        if (range === "month") {
            const daysForCalendar = []
            let startDate = startOfWeek(setDate(fullDate, 1), {weekStartsOn: 1})
            if (!isSameMonth(startDate, fullDate)) {
                do {
                    daysForCalendar.push(startDate)
                    startDate = addDays(startDate, 1)
                } while (!isSameMonth(startDate, fullDate))
            }
            startDate = setDate(fullDate, 1)
            do {
                daysForCalendar.push(startDate)
                startDate = addDays(startDate, 1)
            } while (!isAfter(startDate, endOfDay(lastDayOfMonth(fullDate))))
            setCalendar(daysForCalendar)
            getMasterOrders(id, null, null, null, null, {time: [startOfDay(daysForCalendar[0]), endOfDay(daysForCalendar[daysForCalendar.length - 1])]})
        } else if (range === "week") {
            const daysForCalendar = []
            let startDate = startOfWeek(fullWeekDate, {weekStartsOn: 1})
            const lastDate = lastDayOfWeek(fullWeekDate, {weekStartsOn: 1})
            do {
                daysForCalendar.push(startDate)
                startDate = addDays(startDate, 1)
            } while (!isAfter(startDate, lastDate))
            getMasterOrders(id, null, null, null, null, {time: [daysForCalendar[0], endOfDay(daysForCalendar[daysForCalendar.length - 1])]})
            setCalendar(daysForCalendar)
        } else if (range === "day") {
            getMasterOrders(id, null, null, null, null, {time: [startOfDay(fullDayDate), endOfDay(fullDayDate)]})
        }
    }, [fullDate, fullWeekDate, fullDayDate, selectedDay, range])
    const changeRange = (e) => {
        if (range === "month") {
            setFullDate(new Date())
        } else if (range === "week") {
            setFullWeekDate(new Date())
        } else if (range === "day") {
            setFullDayDate(new Date())
        }
        setRange(e.target.value)
    }
    const changeStatus = async (order, status) => {
        const changeInfo = {
            id: order.id,
            status: status
        }
        try {
            await statusChangeOrder(changeInfo)
            order.status = status
            setOrdersList(ordersList.map(orderL => orderL.id === order.id ? order : orderL))
        } catch (e) {
        }
    }

    return (
        <Box sx={{pt: 5, pb: 5}}>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Link to={`${MASTER_ORDER_ROUTE}/${id}`}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Button variant="outlined" color="primary"
                            sx={{ml: "4px", mb: 1}}
                            onClick={() => {
                                navigate(`${MASTER_ORDER_ROUTE}/${id}`)
                            }}>
                        к заказам
                    </Button>
                </Link>
                <Typography variant="h4"> Календарь</Typography>
                <FormControl size="small">
                    <InputLabel id="demo-simple-select-label">диапазон</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={range}
                        label="диапазон"
                        onChange={changeRange}
                    >
                        <MenuItem value={"month"}>Месяц</MenuItem>
                        <MenuItem value={"week"}>Неделя</MenuItem>
                        <MenuItem value={"day"}>День</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            {range === "month" && <div style={{
                width: 1150,
                minHeight: 800
            }}>
                <div>
                    <div className="calendar-header">
                        <ul>
                            <li onClick={() => setFullDate(addMonths(fullDate, -1))} className="prev"><ArrowBackIcon
                                fontSize={"large"}/>
                            </li>
                            <li onClick={() => setFullDate(addMonths(fullDate, 1))} className="next"><ArrowForwardIcon
                                fontSize={"large"}/>
                            </li>
                            <li>{format(fullDate, "LLLL", {locale: ruLocale})}<br/>
                                <span style={{fontSize: "18px"}}>{getYear(fullDate)}</span>
                            </li>
                        </ul>
                    </div>
                    <ul className="weekdays fixed">
                        {days.map((day, index) => {
                            return (<li key={index}>{day}</li>)
                        })}
                    </ul>
                    <div className={"days"}>
                        {loading ? <Loader/> : calendar.map((date, index) => {
                            const newList = ordersList.filter(order => isSameDay(new Date(order.time), date))
                            return (<div key={index} onClick={() => setSelectedDay(date)}
                                         className={!isToday(date) ? isSameMonth(date, fullDate) ? "day" : "day prevMonth" : "day today"}>
                                {getDate(date)}
                                <ul>
                                    {newList.map((order, index) => {
                                        if (index > limitOrder) return
                                        return (
                                            <div key={order.id}>
                                                {index < limitOrder ?
                                                    <li className={order.status === STATUS_LIST.DONE ? "order-finished " : "order-unfinished"}
                                                        key={order.id}>
                                                        {order.name + ": " + order.sizeClock.name}
                                                    </li> : <div className={"more"}>Больше </div>}
                                            </div>

                                        )
                                    })}
                                </ul>
                            </div>)
                        })}
                    </div>
                </div>
            </div>}
            {range === "week" && <div style={{
                width: 1150,
            }}>
                <div>
                    <div className="calendar-header ">
                        <ul>
                            <li onClick={() => setFullWeekDate(addWeeks(fullWeekDate, -1))} className="prev">
                                <ArrowBackIcon
                                    fontSize={"large"}/>
                            </li>
                            <li onClick={() => setFullWeekDate(addWeeks(fullWeekDate, 1))} className="next">
                                <ArrowForwardIcon
                                    fontSize={"large"}/>
                            </li>
                            <li className="week-range">{format(startOfWeek(fullWeekDate, {weekStartsOn: 1}), "dd.MM.yyyy") + "-" + format(endOfWeek(fullWeekDate, {weekStartsOn: 1}), "dd.MM.yyyy")}
                            </li>
                        </ul>
                    </div>
                    <ul className="weekdays">
                        {days.map((day, index) => {
                            return (<li key={index}>{day}</li>)
                        })}
                    </ul>
                    <div className={"days"}>
                        {loading ? <Loader/> : calendar.map((date, index) => {
                            const newList = ordersList.filter(order => isSameDay(new Date(order.time), date))
                            return (<div key={index} onClick={() => setSelectedDay(date)}
                                         className={!isToday(date) ? "weekday" : "weekday today"}>
                                {getDate(date)}
                                <ul>
                                    {newList.map((order) => {
                                        return (
                                            <div key={order.id}>
                                                <li className={order.status === STATUS_LIST.DONE ? "order-finished " : "order-unfinished"}>
                                                    {order.name + ": " + order.sizeClock.name}
                                                </li>
                                            </div>

                                        )
                                    })}
                                </ul>
                            </div>)
                        })}
                    </div>
                </div>
            </div>}
            {range === "day" && <div style={{
                width: 1150,
            }}>
                <div>
                    <div className="calendar-header">
                        <ul>
                            <li onClick={() => setFullDayDate(addDays(fullDayDate, -1))} className="prev"><ArrowBackIcon
                                fontSize={"large"}/>
                            </li>
                            <li onClick={() => setFullDayDate(addDays(fullDayDate, 1))} className="next">
                                <ArrowForwardIcon
                                    fontSize={"large"}/>
                            </li>
                            <li className={"date-day"}>{format(fullDayDate, "dd.MM.yyyy")}</li>
                        </ul>
                    </div>
                    <ul className="weekdays one">
                        <li>{days[getISODay(fullDayDate) - 1]}</li>
                    </ul>
                    <ul className="orders-table">
                        <li>Имя</li>
                        <li>Тип услуги</li>
                        <li>Цена</li>
                        <li>Время начала</li>
                        <li>Время конец</li>
                        <li>Статус</li>
                    </ul>
                    <div className={"days"}>
                        <div
                            className={!isToday(fullDayDate) ? "one-day" : "one-day today"}>
                            <ul>
                                {loading ? <Loader/> : ordersList.length === 0 ?
                                    <h2>Нет
                                        заказов</h2> : ordersList.map((order, index) => {
                                        return (
                                            <li className={order.status === STATUS_LIST.DONE ? "order-finished-one " : " order-unfinished-one"}
                                                key={order.id}>
                                                <ul className="orders-table-line">
                                                    <li>{order.name}</li>
                                                    <li>{order.sizeClock.name}</li>
                                                    <li>{"$" + order.price}</li>
                                                    <li>{new Date(order.time).toLocaleString("uk-UA").slice(0, -3)}</li>
                                                    <li>{new Date(order.endTime).toLocaleString("uk-UA").slice(0, -3)}</li>
                                                    <li>{<button
                                                        className={`changeStatus ${order.status === STATUS_LIST.DONE ? null : "redButton"}`}
                                                        disabled={order.status !== STATUS_LIST.ACCEPTED && order.status !== STATUS_LIST.DONE}
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => order.status === "ACCEPTED" ? changeStatus(order, "DONE") : changeStatus(order, "ACCEPTED")}>
                                                        {order.status === STATUS_LIST.DONE ? "Выполнен"
                                                            : order.status === STATUS_LIST.ACCEPTED ? "Подтвержден"
                                                                : order.status === STATUS_LIST.REJECTED ? "Отказ" : "Ожидание"}
                                                    </button>}</li>
                                                </ul>
                                            </li>
                                        )
                                    })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>}
            {!!selectedDay && <Modal
                open={!!selectedDay}
                onClose={() => setSelectedDay(null)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={STYLE_MODAL}>
                    <div style={{
                        width: 1150,
                    }}>

                        <div>
                            <div className="calendar-header">
                                <ul>
                                    <li onClick={() => setSelectedDay(addDays(selectedDay, -1))} className="prev">
                                        <ArrowBackIcon
                                            fontSize={"large"}/>
                                    </li>
                                    <li onClick={() => setSelectedDay(addDays(selectedDay, 1))} className="next">
                                        <ArrowForwardIcon
                                            fontSize={"large"}/>
                                    </li>
                                    <li className={"date-day"}>{format(selectedDay, "dd.MM.yyyy")}</li>
                                </ul>
                            </div>
                            <ul className="weekdays one">
                                <li>{days[getISODay(selectedDay) - 1]}</li>
                            </ul>
                            <ul className="orders-table">
                                <li>Имя</li>
                                <li>Тип услуги</li>
                                <li>Цена</li>
                                <li>Время начала</li>
                                <li>Время конец</li>
                                <li>Статус</li>
                            </ul>
                            <div className={"days"}>
                                <div
                                    className={!isToday(fullDayDate) ? "one-day" : "one-day today"}>
                                    <ul>
                                        {loading ? <Loader/> : ordersList.length === 0 ?
                                            <h2>Нет
                                                заказов</h2> : ordersList.map((order, index) => {
                                                return (
                                                    <li className={order.status === STATUS_LIST.DONE ? "order-finished-one " : " order-unfinished-one"}
                                                        key={order.id}>
                                                        <ul className="orders-table-line">
                                                            <li>{order.name}</li>
                                                            <li>{order.sizeClock.name}</li>
                                                            <li>{"$" + order.price}</li>
                                                            <li>{new Date(order.time).toLocaleString("uk-UA").slice(0, -3)}</li>
                                                            <li>{new Date(order.endTime).toLocaleString("uk-UA").slice(0, -3)}</li>
                                                            <li>{<button
                                                                className={`changeStatus ${order.status === STATUS_LIST.DONE ? null : "redButton"}`}
                                                                disabled={order.status !== STATUS_LIST.ACCEPTED && order.status !== STATUS_LIST.DONE}
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() => order.status === "ACCEPTED" ? changeStatus(order, "DONE") : changeStatus(order, "ACCEPTED")}>
                                                                {order.status === STATUS_LIST.DONE ? "Выполнен"
                                                                    : order.status === STATUS_LIST.ACCEPTED ? "Подтвержден"
                                                                        : order.status === STATUS_LIST.REJECTED ? "Отказ" : "Ожидание"}
                                                            </button>}</li>
                                                        </ul>
                                                    </li>
                                                )
                                            })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>}
        </Box>
    );
};

export default Calendar;
