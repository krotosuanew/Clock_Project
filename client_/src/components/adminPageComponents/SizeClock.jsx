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
import {deleteSize, fetchSize} from "../../http/sizeAPI";
import CreateSize from "./modals/CreateSize";
import EditSize from "./modals/EditSize";
import TablsPagination from "../TablsPagination";
import {set} from 'date-fns'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {useTranslation} from "react-i18next";
import "../../i18next"

const STYLE_LIST = {
    ID: {width: 150, height: 70, position: "absolute", left: 10},
    NAME: {width: 150, height: 70, position: "absolute", left: 360},
    DATE: {width: 150, height: 70, position: "absolute", right: 260},
}
const STYLE_COMPONENT_LIST = {
    ID: {width: 150, position: "absolute", left: 30},
    NAME: {width: 150, position: "absolute", left: 380, wordWrap: "break-word"},
    DATE: {width: 150, position: "absolute", left: 670, textAlign: "center"},
    EDIT: {position: "absolute", right: 40}
}


const SizeList = ({alertMessage}) => {
    const {t} = useTranslation()
    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [idToEdit, setIdToEdit] = useState(null);
    const [sizeToEdit, setSizeToEdit] = useState(null);
    const [dateToEdit, setDateToEdit] = useState(null);
    const [sizesList, setSizesList] = useState(null)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [limit, setLimit] = useState(10)
    const [sorting, setSorting] = useState("date")
    const [ascending, setAscending] = useState(false)
    const [loading, setLoading] = useState(true)
    const getSizes = async (page, limit, sorting, ascending) => {
        try {
            const res = await fetchSize(page, limit, sorting, ascending)
            if (res.status === 204) {
                setSizesList([])
                setTotalCount(0)
                return
            }
            setSizesList(res.data.rows)
            setTotalCount(res.data.count)
        } catch (e) {
            setSizesList([])
        } finally {
            setLoading(false)
        }
    }
    useEffect(async () => {
        await getSizes(page, limit, sorting, ascending)
    }, [page, limit, sorting, ascending])


    const removeSize = async (id) => {
        try {
            await deleteSize(id)
            await getSizes(page, limit, sorting, ascending)
            alertMessage(t("SizeClockList.alertRemove.successes"), false)
        } catch (e) {
            alertMessage(t("SizeClockList.alertRemove.successes"), true)
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
        <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: document.documentElement.clientHeight - 130}}>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                    {t("SizeClockList.topic")}
                </Typography>
            </Box>
            <Divider/>
            <List disablePadding>
                <ListItem
                    key={1}
                    divider
                    sx={{height: 70}}
                    secondaryAction={<Tooltip title={t("SizeClockList.addClock")}
                                              placement="top"
                                              arrow>
                        <IconButton sx={{width: 20}}
                                    edge="end"
                                    aria-label="addSize"
                                    onClick={() => setCreateVisible(true)}
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
                        <ListItemText primary="ID"/>
                        {!ascending ? sorting === "id" && <ExpandMoreIcon/> : sorting === "id" && <ExpandLessIcon/>}
                    </ListItemButton>
                    <ListItemButton
                        selected={sorting === "name"}
                        sx={STYLE_LIST.NAME}
                        onClick={() => sortingList("name")}
                    >
                        {t("SizeClockList.name")}
                        {!ascending ? sorting === "name" && <ExpandMoreIcon/> : sorting === "name" && <ExpandLessIcon/>}
                    </ListItemButton>
                    <ListItemButton
                        selected={sorting === "date"}
                        sx={STYLE_LIST.DATE}
                        onClick={() => sortingList("date")}
                    >
                        {t("SizeClockList.date")}
                        {!ascending ? sorting === "date" && <ExpandMoreIcon/> : sorting === "date" && <ExpandLessIcon/>}
                    </ListItemButton>
                </ListItem>
                <Divider orientation="vertical"/>

                {sizesList.length === 0 ? <h1>{t("emptyList")}</h1> : sizesList.map((size, index) => {

                    return (<ListItem
                        key={size.id}
                        divider
                        sx={{height: 70}}
                        secondaryAction={<Tooltip title={t("SizeClockList.removeClock")}
                                                  placement="right"
                                                  arrow>
                            <IconButton sx={{width: 10}}
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => removeSize(size.id)}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>}
                    >
                        <ListItemText sx={STYLE_COMPONENT_LIST.ID}
                                      primary={size.id}
                        />
                        <ListItemText sx={STYLE_COMPONENT_LIST.NAME}
                                      primary={size.name}
                        />
                        <ListItemText sx={STYLE_COMPONENT_LIST.DATE}
                                      primary={size.date}
                        />
                        <Tooltip title={t("SizeClockList.editClock")}
                                 placement="left"
                                 arrow>
                            <IconButton sx={STYLE_COMPONENT_LIST.EDIT}
                                        edge="end"
                                        aria-label="Edit"
                                        onClick={() => {
                                            setEditVisible(true)
                                            setIdToEdit(size.id)
                                            setSizeToEdit(size)
                                            setDateToEdit(set(new Date(), {
                                                hours: size.date.slice(0, 2),
                                                minutes: 0,
                                                seconds: 0
                                            }))
                                        }}
                            >
                                <EditIcon/>
                            </IconButton>
                        </Tooltip>
                    </ListItem>)
                })}
            </List>
            {createVisible ? <CreateSize open={createVisible}
                                         getSize={() => getSizes(page, limit, sorting, ascending)}
                                         alertMessage={alertMessage}
                                         onClose={() => {
                                             setCreateVisible(false)
                                         }}/> : null}
            {editVisible ? <EditSize
                getSize={() => getSizes(page, limit, sorting, ascending)}
                open={editVisible}
                onClose={() => setEditVisible(false)}
                idToEdit={idToEdit}
                alertMessage={alertMessage}
                sizeToEdit={sizeToEdit}
                dateToEdit={dateToEdit}
            /> : null}
        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
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
export default SizeList;
