import React, {useEffect, useState} from 'react';
import {Box, Button, Divider, Grow, List, ListItem, ListItemText, Tab, TextField, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {ADMIN_ROUTE} from "../utils/consts";
import ReactApexChart from "react-apexcharts";
import {FormProvider, useForm} from "react-hook-form";
import SelectorMultiple from "../components/adminPageComponents/modals/SelectorMultiple";
import {fetchCities} from "../http/cityAPI";
import {fetchMasters} from "../http/masterAPI";
import {DateRangePicker, LocalizationProvider, TabContext, TabList, TabPanel} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import enLocale from 'date-fns/locale/en-US';
import {ordersStatistics} from "../http/orderAPI";
import {addMonths, endOfToday, startOfToday} from "date-fns";
import Loader from "../components/Loader";
import {useTranslation} from "react-i18next";
import "../i18next"

const TABS = {
    DATE: "order/data",
    CITY: "orders/city",
    TOP_THREE: "top_3",
    MASTER_STATISTICS: "master_statistics"
}
const STYLE_LIST = {
    NAME: {width: 60, position: "absolute", left: 50},
    TOTAL_ORDERS: {width: 100, position: "absolute", left: 180},
    RATING: {width: 100, position: "absolute", left: 300},
    ORDERS_FINISHED: {width: 100, position: "absolute", left: 450},
    ORDERS_UNFINISHED: {width: 100, position: "absolute", left: 600},
    SIZES: {width: 100, position: "absolute", left: 780},
    TOTAL_EARNED: {width: 70, position: "absolute", left: 1000},
}
const STYLE_COMPONENT_LIST = {
    NAME: {width: 60, position: "absolute", left: 50},
    TOTAL_ORDERS: {width: 100, position: "absolute", left: 180},
    RATING: {width: 100, position: "absolute", left: 300},
    ORDERS_FINISHED: {width: 100, position: "absolute", left: 450},
    ORDERS_UNFINISHED: {width: 100, position: "absolute", left: 600},
    SIZES: {
        width: 200,
        position: "absolute",
        left: 780,
        maxHeight: 60,
        overflowY: "auto",
        overflowX: "hidden",
        wordBreak: "break-word"
    },
    TOTAL_EARNED: {width: 70, position: "absolute", left: 1000},
}
const localeMap = {
    en: enLocale,
    ru: ruLocale,
};
const defaultValues = {
    date: [null, null],
    cityList: [],
    masterList: [],
}
const Statistics = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [ordersCountList, setOrdersCountList] = useState([])
    const [statistics, setStatistics] = useState([""])
    const [statisticsMaster, setStatisticsMaster] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [filters, setFilters] = useState({time: [addMonths(startOfToday(), -1), endOfToday()]})
    const [date, setDate] = useState([addMonths(startOfToday(), -1), endOfToday()]);
    const [tabs, setTabs] = useState(TABS.DATE);
    const [loading, setLoading] = useState(true)
    const [openSizesList, setOpenSizesList] = useState({})
    const sizesLimit = 3
    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        getValues,
        reset,
        watch,
        formState: {errors}
    } = useForm({
        defaultValues
    });
    const getOrders = async (filters, tabs) => {
        try {
            const res = await ordersStatistics(tabs !== TABS.DATE ?
                {time: date.includes(null) ? null : date,} : filters, tabs)
            if (res.status === 204) {
                setOrdersCountList([])
                setStatistics([""])
                setTotalCount(0)
                return
            }
            setTotalCount(res.data.totalCount)
            if (tabs === TABS.DATE || tabs === TABS.CITY) {
                setOrdersCountList(res.data.ordersCountList)
                setStatistics(res.data.statisticsList)
            } else if (tabs === TABS.TOP_THREE) {
                setOrdersCountList(res.data.masterList.map(master => master.totalOrders))
                setStatistics(res.data.masterList.map(master => master.name))
            } else if (tabs === TABS.MASTER_STATISTICS) {
                setOrdersCountList([])
                setStatistics([""])
                setTotalCount(0)
                setStatisticsMaster(res.data.masterListStatistics)
            }
        } catch (e) {
            setOrdersCountList([])
        } finally {
            setLoading(false)
        }
    }
    const dateOrdersStatistics = {
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        dataLabels: {
            style: {
                fontSize: '28px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        stroke: {
            curve: 'smooth',
            lineCap: 'butt',
            width: 2,
            dashArray: 0,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 10
            },
        },
        xaxis: {
            type: 'date',
            categories: statistics,
            tickPlacement: 'between',
            range: date,
            labels: {
                trim: false,
                style: {
                    fontSize: '16px',
                    fontWeight: 600,
                }
            },
            title: {
                text: `${t("Statistics.totalOrders")}:${totalCount}`,
                style: {
                    fontSize: '20px',
                    fontWeight: 600,
                    cssClass: 'apexcharts-xaxis-title',
                },
            },
        },
        legend: {
            position: 'right',
            offsetY: 40
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                title: {
                    formatter: (seriesName) => seriesName = `${t("Statistics.orders")}`,
                },
            },
            style: {
                fontSize: '18px',
            },
        },
    }
    const cityOrdersStatistics = {
        dataLabels: {
            formatter:(value, {seriesIndex, dataPointIndex, w})=>  w.config.series[seriesIndex],
            textAnchor: 'middle',
            style: {
                fontSize: '28px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
            }
        },
        title: {
            text: ` ${t("Statistics.totalOrders")}:${totalCount}`,
            align: 'left',
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
                fontSize: '20px',
                fontWeight: 'bold',
            },
        },
        tooltip: {
            style: {
                fontSize: '18px',
            },
        },
        chart: {
            height: '400px',
            type: 'pie',
            offsetX: 250,
        },
        labels: statistics,
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 300
                },
                legend: {
                    position: 'bottom'
                },
            }
        }]
    }
    const topThreeStatistics = {
        chart: {
            type: 'donut',
            offsetX: 250,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '22px',
                            formatter:  (val)=> val
                        },
                        total: {
                            show: true,
                            label: `${t("Statistics.totalOrders")}`,
                            fontSize: '22px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 600,
                            color: '#373d3f',
                            formatter:  (w) =>w.globals.seriesTotals.reduce((a, b) => {
                                    return a + b
                                }, 0)
                        }
                    }
                }
            }
        },
        labels: statistics,
        dataLabels: {
            formatter:  (value, {seriesIndex, dataPointIndex, w}) =>w.config.series[seriesIndex],
            textAnchor: 'middle',
            style: {
                fontSize: '28px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    }
    const series = tabs === TABS.DATE ? [{data: ordersCountList}] : ordersCountList
    const options = tabs === TABS.DATE ? dateOrdersStatistics : tabs === TABS.CITY ? cityOrdersStatistics : TABS.TOP_THREE && topThreeStatistics
    useEffect(async () => {
        setLoading(true)
        await getOrders(filters, tabs)
    }, [filters, tabs])
    const createFilter = async ({masterList, date, cityList}) => {
        const filter = {
            cityIDes: cityList.length !== 0 ? cityList.map(city => city.id) : null,
            masterIDes: masterList.length !== 0 ? masterList.map(master => master.id) : null,
            time: date.includes(null) ? null : date,
        }
        setFilters(filter)
    };
    const resetFilter = async () => {
        reset()
        setDate([null, null])
        setFilters({})
    };
    const changeTabs = (event, newValue) => {
        setTabs(newValue);
    };
    const createSizesList = (master, all) => {
        let sizes = ""
        let count = 0
        for (const sizesKey in master.size) {
            if (count === 0) {
                sizes += ` ${sizesKey}:${master.size[sizesKey]}`
            } else if (count < sizesLimit || all) {
                sizes += `, ${sizesKey}:${master.size[sizesKey]}`
            }
            count++
        }
        return sizes
    }
    return (
        <Box sx={{
            all: "inherit",
            minHeight: document.documentElement.clientHeight,
            overflow: "hidden",
            background: "white",
            mt: 8,
            position: "relative",
            px: 2,
        }}>
            <Box sx={{display: "flex", direction: "colum"}}>
                <Link to={ADMIN_ROUTE}
                      style={{textDecoration: 'none', color: 'white'}}>
                    <Button
                        sx={{mt: 2}}
                        onClick={() => navigate(ADMIN_ROUTE)}>
                        {t("Statistics.back")}
                    </Button>
                </Link>
                <Typography variant="h5" sx={{mt: 2, ml: 2}}>
                    {t("Statistics.topic")}
                </Typography>
            </Box>
            <TabContext value={tabs}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <TabList onChange={changeTabs} aria-label="lab API tabs example">
                        <Tab label={t("Statistics.ordersDiagram")} value={TABS.DATE}/>
                        <Tab label={t("Statistics.circleDiagram")} value={TABS.CITY}/>
                        <Tab label={t("Statistics.topThree")} value={TABS.TOP_THREE}/>
                        <Tab label={t("Statistics.workersStatistics")} value={TABS.MASTER_STATISTICS}/>
                    </TabList>
                </Box>
                <Box>
                    <TabPanel value={TABS.DATE}>
                        <FormProvider register={register} errors={errors} watch={watch} trigger={trigger}
                                      getValues={getValues}
                                      setValue={setValue}>
                            <form onSubmit={handleSubmit(createFilter)}>
                                <Box>
                                    <Typography sx={{mb: 1}}>
                                        {t("Filter.topic")}
                                    </Typography>
                                    <Box sx={{display: "flex", justifyContent: "space-between", maxHeight: 130}}>
                                        <Box sx={{mb: 1}}>
                                            <SelectorMultiple name={"cityList"} fetch={fetchCities}
                                                              label={t("Statistics.filter.city")} id={"cities"}/>
                                            <SelectorMultiple name={"masterList"} fetch={fetchMasters}
                                                              label={t("Statistics.filter.master")} id={"masters"}/>
                                        </Box>
                                        <Box>
                                            <LocalizationProvider
                                                dateAdapter={AdapterDateFns}
                                                locale={localeMap[localStorage.getItem("i18nextLng")]}
                                            >
                                                <DateRangePicker
                                                    {...register("date",)}
                                                    value={date}
                                                    endText={t("Statistics.filter.endData")}
                                                    startText={t("Statistics.filter.startData")}
                                                    onChange={(newValue) => {
                                                        setDate(newValue);
                                                        setValue("date", newValue)
                                                    }}
                                                    renderInput={(startProps, endProps) => (
                                                        <React.Fragment key={1}>
                                                            <TextField size={"small"}{...startProps} />
                                                            <Box sx={{mx: 2}}>{t("Statistics.filter.to")} </Box>
                                                            <TextField sx={{mt: "12px"}}
                                                                       size={"small"} {...endProps} />
                                                        </React.Fragment>
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Box>
                                        <Box
                                            sx={{width: 200, mt: 2}}>
                                            <Button size={"small"} variant="contained" sx={{mb: 1}} color={"error"}
                                                    onClick={resetFilter}>{t("Filter.buttonReset")}</Button>
                                            <Button variant="contained" size={"small"} type="submit"
                                                    color={"success"} key="two">{t("Filter.buttonAccept")}</Button>
                                        </Box>
                                    </Box>
                                </Box>
                                <Divider/>
                            </form>
                        </FormProvider>
                        {loading ? <Loader/> : ordersCountList?.length !== 0 ?
                            <ReactApexChart options={options} series={series} type="bar" height={600}/> :
                            <h1>{t("Statistics.emptyData")}</h1>}
                    </TabPanel>
                    <TabPanel value={TABS.CITY}>
                        <form onSubmit={handleSubmit(createFilter)}>
                            <Box>
                                <Typography sx={{mb: 1}}>
                                    {t("Filter.topic")}
                                </Typography>
                                <Box sx={{display: "flex", justifyContent: "space-between", minHeight: 100}}>
                                    <Box>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDateFns}
                                            locale={localeMap[localStorage.getItem("i18nextLng")]}
                                        >
                                            <DateRangePicker
                                                {...register("date",)}
                                                mask='__.__.____'
                                                value={date}
                                                endText={t("Statistics.filter.endData")}
                                                startText={t("Statistics.filter.startData")}
                                                onChange={(newValue) => {
                                                    setDate(newValue);
                                                    setValue("date", newValue)
                                                }}
                                                renderInput={(startProps, endProps) => (
                                                    <React.Fragment key={1}>
                                                        <TextField size={"small"}{...startProps} />
                                                        <Box sx={{mx: 2}}>{t("Statistics.filter.to")} </Box>
                                                        <TextField sx={{mt: "12px"}}
                                                                   size={"small"} {...endProps} />
                                                    </React.Fragment>
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    <Box
                                        sx={{width: 200, mt: 2}}>
                                        <Button size={"small"} variant="contained" sx={{mb: 1}} color={"error"}
                                                onClick={resetFilter}>{t("Filter.buttonReset")}</Button>
                                        <Button variant="contained" size={"small"} type="submit"
                                                color={"success"} key="two">{t("Filter.buttonAccept")}</Button>
                                    </Box>
                                </Box>
                            </Box>
                            <Divider/>
                        </form>
                        {loading ? <Loader/> : ordersCountList?.length !== 0 ?
                            <ReactApexChart options={options} series={series} type="pie" width={700}/> :
                            <h1>{t("Statistics.emptyData")}</h1>
                        }
                    </TabPanel>
                    <TabPanel value={TABS.TOP_THREE}>
                        <form onSubmit={handleSubmit(createFilter)}>
                            <Box>
                                <Typography sx={{mb: 1}}>
                                    {t("Filter.topic")}
                                </Typography>
                                <Box sx={{display: "flex", justifyContent: "space-between", minHeight: 100}}>
                                    <Box>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDateFns}
                                            locale={localeMap[localStorage.getItem("i18nextLng")]}
                                        >
                                            <DateRangePicker
                                                {...register("date",)}
                                                mask='__.__.____'
                                                value={date}
                                                endText={t("Statistics.filter.endData")}
                                                startText={t("Statistics.filter.startData")}
                                                onChange={(newValue) => {
                                                    setDate(newValue);
                                                    setValue("date", newValue)
                                                }}
                                                renderInput={(startProps, endProps) => (
                                                    <React.Fragment key={1}>
                                                        <TextField size={"small"}{...startProps} />
                                                        <Box sx={{mx: 2}}>{t("Statistics.filter.to")} </Box>
                                                        <TextField sx={{mt: "12px"}}
                                                                   size={"small"} {...endProps} />
                                                    </React.Fragment>
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    <Box
                                        sx={{width: 200, mt: 2}}>
                                        <Button size={"small"} variant="contained" sx={{mb: 1}} color={"error"}
                                                onClick={resetFilter}>Сбросить фильтр</Button>
                                        <Button variant="contained" size={"small"} type="submit"
                                                color={"success"} key="two">Применить фильтр</Button>
                                    </Box>
                                </Box>
                            </Box>
                            <Divider/>
                        </form>
                        {loading ? <Loader/> : ordersCountList?.length !== 0 ?
                            <ReactApexChart options={options} series={series} type="donut" width={750}/> :
                            <h1>{t("Statistics.emptyData")}</h1>
                        }

                    </TabPanel>
                    <TabPanel value={TABS.MASTER_STATISTICS}>
                        <Grow in={!!TABS.MASTER_STATISTICS} key={1}>
                            <List disablePadding>
                                <ListItem
                                    key={1}
                                    sx={{minHeight: 70}}
                                    divider
                                >
                                    <ListItemText sx={STYLE_LIST.NAME}
                                                  primary={t("Statistics.name")}
                                    />
                                    <ListItemText sx={STYLE_LIST.TOTAL_ORDERS}
                                                  primary={t("Statistics.totalOrders")}
                                    />
                                    <ListItemText sx={STYLE_LIST.RATING}
                                                  primary={t("Statistics.rating")}
                                    />
                                    <ListItemText sx={STYLE_LIST.ORDERS_FINISHED}
                                                  primary={t("Statistics.finishedOrders")}
                                    />
                                    <ListItemText sx={STYLE_LIST.ORDERS_UNFINISHED}
                                                  primary={t("Statistics.unfinishedOrders")}
                                    />
                                    <ListItemText sx={STYLE_LIST.SIZES}
                                                  primary={t("Statistics.clock")}
                                    />
                                    <ListItemText sx={STYLE_LIST.TOTAL_EARNED}
                                                  primary={t("Statistics.totalEarned")}
                                    />
                                </ListItem>
                                <Divider orientation="vertical"/>
                                {statisticsMaster?.length === 0 ?
                                    <h1>{t("emptyList")}</h1> : statisticsMaster?.map((master, index) => {
                                        return (<ListItem
                                            key={index}
                                            sx={{minHeight: 80}}
                                            divider>
                                            <ListItemText sx={STYLE_COMPONENT_LIST.NAME}
                                                          primary={master.name}
                                            />
                                            <ListItemText sx={STYLE_COMPONENT_LIST.TOTAL_ORDERS}
                                                          primary={master.totalOrders}
                                            />
                                            <ListItemText sx={STYLE_COMPONENT_LIST.RATING}
                                                          primary={master.rating}
                                            />
                                            <ListItemText sx={STYLE_COMPONENT_LIST.ORDERS_FINISHED}
                                                          primary={master.statusFinished}/>
                                            <ListItemText sx={STYLE_COMPONENT_LIST.ORDERS_UNFINISHED}
                                                          primary={master.statusUnfinished}
                                            />
                                            <ListItemText sx={STYLE_COMPONENT_LIST.SIZES}
                                                          primary={
                                                              <Box>
                                                                  {openSizesList === master ?
                                                                      <Box>
                                                                          <Box
                                                                              sx={{width: 200}}>  {createSizesList(master, true)}</Box>
                                                                          <Button
                                                                              onClick={() => setOpenSizesList({})}>{t("Statistics.clockList.hidden")}</Button>
                                                                      </Box>
                                                                      :
                                                                      <Box>
                                                                          {createSizesList(master)}
                                                                          {Object.keys(master.size).length > sizesLimit ?
                                                                              <Button size="small"
                                                                                      onClick={() => setOpenSizesList(master)}>{t("Statistics.clockList.more")}</Button> : null}</Box>
                                                                  }
                                                              </Box>}
                                            />

                                            <ListItemText sx={STYLE_COMPONENT_LIST.TOTAL_EARNED}
                                                          primary={"$" + master.totalPrice}/>
                                        </ListItem>)
                                    })}
                                <Divider/>
                            </List>
                        </Grow>
                    </TabPanel>
                </Box>
            </TabContext>
        </Box>
    );
};

export default Statistics;
