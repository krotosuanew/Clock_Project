import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Box,
    CircularProgress,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Select,
    Tooltip,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {deleteCity, fetchCities} from "../../http/cityAPI";
import CreateCity from "./modals/CreateCity";
import EditCity from "./modals/EditCity";
import TablsPagination from "../TablsPagination";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import "../../i18next"
import {useTranslation} from "react-i18next";

const STYLE_LIST = {
    ID: {width: 150, height: 70, position: "absolute", left: 0},
    NAME: {width: 250, height: 70, position: "absolute", left: 300},
    PRICE: {width: 200, height: 70, position: "absolute", left: 650, textAlign: "center"},
}
const STYLE_COMPONENT_LIST = {
    ID: {width: 60, position: "absolute", left: 15},
    NAME: {width: 100, position: "absolute", left: 350, wordWrap: "break-word"},
    PRICE: {width: 100, position: "absolute", left: 690, textAlign: "center"},
    EDIT: {position: "absolute", right: 40}
}

const CityList = ({alertMessage}) => {
    const {t} = useTranslation()
    const [cityVisible, setCityVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [cityToEdit, setCityToEdit] = useState(null);
    const [citiesList, setCitiesList] = useState(null)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [limit, setLimit] = useState(10)
    const [sorting, setSorting] = useState("name")
    const [ascending, setAscending] = useState(false)
    const [loading, setLoading] = useState(true)

    const getCities = async (page, limit, sorting, ascending) => {
        try {
            const res = await fetchCities(page, limit, sorting, ascending)
            if (res.status === 204) {
                setCitiesList([])
                setTotalCount(0)
                return
            }
            setTotalCount(res.data.count)
            setCitiesList(res.data.rows)
        } catch (e) {
            setCitiesList([])
        } finally {
            setLoading(false)
        }

    }
    useEffect(async () => {
        await getCities(page, limit, sorting, ascending)
    }, [page, limit, sorting, ascending])

    const removeCity = async (id) => {
        try {
            await deleteCity(id)
            await getCities(page, limit, sorting, ascending)
            alertMessage(t("CityList.alertRemove.successes"), false)
        } catch (e) {
            alertMessage(t("CityList.alertRemove.fail"), true)
        }
    }
    if (loading) {
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

    return (<Box>
        <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: document.documentElement.clientHeight - 135}}>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                    {t("CityList.listName")}
                </Typography>
            </Box>
            <Divider/>
            <List disablePadding>
                <ListItem
                    sx={{height: 70}}
                    key={1}
                    divider
                    secondaryAction={<Tooltip title={t("CityList.addCity")}
                                              placement="top"
                                              arrow>
                        <IconButton sx={{width: 20}}
                                    edge="end"
                                    aria-label="addCity"
                                    onClick={() => setCityVisible(true)}
                        >
                            <AddIcon/>
                        </IconButton>
                    </Tooltip>}
                >

                    <ListItemButton
                        selected={sorting === "id"}
                        sx={STYLE_LIST.ID}
                        onClick={() => sortingList("id")}
                    >
                        ID
                        {!ascending ? sorting === "id" && <ExpandMoreIcon/> : sorting === "id" && <ExpandLessIcon/>}
                    </ListItemButton>

                    <ListItemButton
                        selected={sorting === "name"}
                        sx={STYLE_LIST.NAME}
                        onClick={() => sortingList("name")}
                    >
                        <ListItemText primary={t("CityList.cityName")}/>
                        {!ascending ? sorting === "name" && <ExpandMoreIcon/> : sorting === "name" && <ExpandLessIcon/>}
                    </ListItemButton>
                    <ListItemButton
                        selected={sorting === "price"}
                        sx={STYLE_LIST.PRICE}
                        onClick={() => sortingList("price")}
                    >
                        <ListItemText primary={t("CityList.cityName")}/>
                        {!ascending ? sorting === "price" && <ExpandMoreIcon/> : sorting === "price" &&
                            <ExpandLessIcon/>}
                    </ListItemButton>
                </ListItem>
                <Divider orientation="vertical"/>
                {citiesList.length === 0 ? <h1>{t("CityList.emptyList")}</h1> : citiesList.map((city, index) => {
                    return (<ListItem
                            sx={{height: 60}}
                            key={city.id}
                            divider
                            secondaryAction={<Tooltip title={t("CityList.removeCity")}
                                                      placement="right"
                                                      arrow>
                                <IconButton sx={{width: 10}}
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => removeCity(city.id)}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>}
                        >
                            <ListItemText sx={STYLE_COMPONENT_LIST.ID}
                                          primary={city.id}
                            />
                            <ListItemText sx={STYLE_COMPONENT_LIST.NAME}
                                          primary={city.name}
                            />
                            <ListItemText sx={STYLE_COMPONENT_LIST.PRICE}
                                          primary={"$" + city.price}
                            />
                            <Tooltip title={t("CityList.editCity")}
                                     placement="left"
                                     arrow>
                                <IconButton sx={STYLE_COMPONENT_LIST.EDIT}
                                            edge="end"
                                            aria-label="Edit"
                                            onClick={() => {
                                                setEditVisible(true)
                                                setCityToEdit(city)
                                            }}
                                >
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>
                        </ListItem>

                    )
                })}
            </List>

            {editVisible ? <EditCity
                open={editVisible}
                onClose={() => {
                    setEditVisible(false)
                }}
                getCities={() => getCities(page, limit, sorting, ascending)}
                cityToEdit={cityToEdit}
                alertMessage={alertMessage}
            /> : null}

            {cityVisible ? <CreateCity open={cityVisible}
                                       getCities={() => getCities(page, limit, sorting, ascending)}
                                       onClose={() => setCityVisible(false)}
                                       alertMessage={alertMessage}/> : null}
        </Box>
        <Box style={{display: "flex", justifyContent: "center"}}>
            <TablsPagination page={page} totalCount={totalCount} limit={limit} pagesFunction={(page) => setPage(page)}/>
            <FormControl variant="standard" sx={{m: 1, width: 60, position: "absolute", left: 1300}} size="small">
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

    </Box>);
}
export default CityList;
