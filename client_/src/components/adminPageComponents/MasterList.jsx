import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Box,
    Button,
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
    Rating,
    Select,
    Slider,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {activateMaster, deleteMaster, fetchMasters} from "../../http/masterAPI";
import CreateMaster from "./modals/CreateMaster";
import EditMaster from "./modals/EditMaster";
import TablsPagination from "../TablsPagination";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ReviewModal from "../ReviewModal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {fetchCities} from "../../http/cityAPI";
import {FormProvider, useForm} from "react-hook-form";
import SelectorMultiple from "./modals/SelectorMultiple";
import {useTranslation} from "react-i18next";

const marks = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 1,
        label: '1',
    },
    {
        value: 2,
        label: '2',
    },
    {
        value: 3,
        label: '3',
    }, {
        value: 4,
        label: '4',
    }, {
        value: 5,
        label: '5',
    },
];

const defaultValues = {
    rating: [0, 5],
    masterId: null,
    forFilter: true,
    masterName: "",
    cityList: []
}
const MasterList = ({alertMessage}) => {
    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        getValues,
        reset,
        formState: {errors}
    } = useForm({
        defaultValues
    });
    const {t} = useTranslation()
    const [createVisible, setCreateVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [idToEdit, setIdToEdit] = useState(null);
    const [nameToEdit, setNameToEdit] = useState(null)
    const [ratingToEdit, setRatingToEdit] = useState(null)
    const [cityToEdit, setCityToEdit] = useState(null);
    const [citiesList, setCitiesList] = useState([])
    const [openReview, setOpenReview] = useState(false)
    const [masterId, setMasterId] = useState(null)
    const [mastersList, setMastersList] = useState(null)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [limit, setLimit] = useState(10)
    const [ascending, setAscending] = useState(true)
    const [sorting, setSorting] = useState("name")
    const [loading, setLoading] = useState(true)
    const [openCityList, setOpenCityList] = useState(null)
    const [filters, setFilters] = useState({})
    const [rating, setRating] = React.useState([0, 5]);
    const citiesLimit = 2
    const getMasters = async (page, limit, sorting, ascending, filters) => {
        try {
            const res = await fetchMasters(null, page, limit, sorting, ascending, filters)
            if (res.status === 204) {
                setMastersList([])
                setTotalCount(0)
                return
            }
            setMastersList(res.data.rows)
            setTotalCount(res.data.count)
        } catch (e) {
            setMastersList([])
        } finally {
            setLoading(false)
        }
    }
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
    }, [])
    useEffect(async () => {
        await getMasters(page, limit, sorting, ascending, filters)
    }, [page, limit, sorting, ascending, filters])
    if (loading && !getValues("forFilter")) {
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
    const changeActiveted = async (master) => {
        let changeInfo = {
            id: master.id,
            isActivated: !master.isActivated
        }
        try {
            await activateMaster(changeInfo)
            master.isActivated = !master.isActivated
            alertMessage(t("MasterList.alertStatus.successes"), false)
        } catch (e) {
            alertMessage(t("MasterList.alertStatus.fail"), true)
        }
    }

    const removeMaster = async (id) => {
        try {
            await deleteMaster(id)
            alertMessage(t("MasterList.alertRemove.successes"), false)
            await getMasters(page, limit, sorting, ascending)
        } catch (e) {
            alertMessage(t("MasterList.alertRemove.fail"), true)
        }
    }

    const createCityList = (master, all) => {
        return master.cities
            .reduce((cityList, masterCity, index) => {
                if (index === 0) {
                    cityList += masterCity.name
                } else if (index < citiesLimit) {
                    cityList += `, ${masterCity.name}`
                } else if (all) {
                    cityList += `, ${masterCity.name}`
                }
                return cityList
            }, '')
    }
    const forEdit = (master) => {
        let changeCity = []
        setEditVisible(true)
        setIdToEdit(master.id)
        setNameToEdit(master.name)
        setRatingToEdit(master.rating)
        changeCity = master.cities.map(item => item.id)
        setCityToEdit(citiesList.filter(cities => changeCity.indexOf(cities.id) > -1))
    }
    const getReviews = (id) => {
        setMasterId(id)
        setOpenReview(true)
    }
    const sortingList = (param) => {
        if (sorting === param) {
            setAscending(!ascending)
            return
        }
        setAscending(true)
        setSorting(param)
    }

    const ratingChange = (event, newValue) => {
        setRating(newValue);
    };
    const createFilter = async ({cityList, masterName}) => {
        const filter = {
            cityIDes: cityList.length !== 0 ? cityList.map(city => city.id) : null,
            rating: rating,
            masterName: masterName !== "" ? masterName : null,
        }
        setPage(1)
        setLoading(true)
        setFilters(filter)
    };
    const resetFilter = async () => {
        reset()
        setValue("reset", true)
        setRating([0, 5])
        setFilters({})
        setLoading(true)
    };

    return (<Box sx={{position: "relative"}}>
        <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: document.documentElement.clientHeight - 130}}>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                    {t("MasterList.listName")}
                </Typography>
            </Box>
            <FormProvider register={register} errors={errors} trigger={trigger} getValues={getValues}
                          setValue={setValue}>
                <form onSubmit={handleSubmit(createFilter)}>
                    <Box sx={{minHeight: 150}}>
                        <Typography sx={{mb: 1, mt: -2}} variant="h6" component="div">
                            {t("Filter.topic")}
                        </Typography>
                        <Box sx={{display: "flex", justifyContent: "space-evenly"}}>
                            <Box>
                                <SelectorMultiple name={"cityList"} fetch={fetchCities}
                                                  label={t("MasterList.filter.selectCity")} id={"cities"}/>
                                <TextField
                                    {...register("masterName",)}
                                    size={"small"}
                                    sx={{mt: 1}}
                                    id="masterName"
                                    label={t("MasterList.filter.name")}
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{width: 300, mt: -4}}>
                                <Typography id="rating-slider" gutterBottom>
                                    {t("MasterList.filter.rating")}
                                </Typography>
                                <Slider
                                    {...register("rating",)}
                                    sx={{width: 150}}
                                    min={0}
                                    max={5}
                                    getAriaLabel={() => 'Temperature range'}
                                    value={rating}
                                    onChange={ratingChange}
                                    valueLabelDisplay="auto"
                                    marks={marks}
                                />
                            </Box>
                            <Box
                                sx={{width: 200, mb: 2}}>
                                <Button size={"small"} variant="contained" sx={{mb: 1}} color={"error"}
                                        onClick={resetFilter}>
                                    {t("Filter.buttonReset")}</Button>
                                <Button variant="contained" size={"small"} type="submit" color={"success"}>
                                    {t("Filter.buttonAccept")}</Button>
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
                        key={1}
                        divider
                        secondaryAction={<Tooltip title={t("MasterList.addMaster")}
                                                  placement="top"
                                                  arrow>
                            <IconButton sx={{width: 20}}
                                        edge="end"
                                        aria-label="Add"
                                        onClick={() => setCreateVisible(true)}>

                                <AddIcon/>
                            </IconButton>
                        </Tooltip>}>
                        <ListItemButton
                            selected={sorting === "id"}
                            sx={{ml: -2, maxWidth: 100}}
                            onClick={() => sortingList("id")}>
                            {t("MasterList.masterId")}
                            {ascending ? sorting === "id" && <ExpandMoreIcon/> : sorting === "id" && <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "userId"}
                            sx={{width: 120}}
                            onClick={() => sortingList("userId")}>
                            {t("MasterList.userId")}
                            {ascending ? sorting === "userId" && <ExpandMoreIcon/> : sorting === "userId" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                        <ListItemButton
                            selected={sorting === "name"}
                            sx={{maxWidth: 100, mr: 5}}
                            onClick={() => sortingList("name")}>
                            {t("MasterList.name")}
                            {ascending ? sorting === "name" && <ExpandMoreIcon/> : sorting === "name" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>

                        <ListItemButton
                            selected={sorting === "rating"}
                            sx={{maxWidth: 100, mr: 2}}
                            onClick={() => sortingList("rating")}
                        >
                            {t("MasterList.rating")}
                            {ascending ? sorting === "rating" && <ExpandMoreIcon/> : sorting === "rating" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>

                        <ListItemText sx={{minWidth: 100, ml: 6}}
                                      primary={t("MasterList.cities")}
                        />
                        <ListItemText sx={{minWidth: 100, mr: -8}}
                                      primary={t("MasterList.reviews")}
                        />
                        <ListItemButton
                            selected={sorting === "isActivated"}
                            sx={{mr: 4, width: 100}}
                            onClick={() => sortingList("isActivated")}>
                            {t("MasterList.status")}
                            {ascending ? sorting === "isActivated" && <ExpandMoreIcon/> : sorting === "isActivated" &&
                                <ExpandLessIcon/>}
                        </ListItemButton>
                    </ListItem>

                    <Divider orientation="vertical"/>
                    {mastersList.length === 0 ? <h1> {t("emptyList")}</h1> :
                        mastersList.map((master) => {
                            return (
                                <ListItem
                                    key={master.id}
                                    divider
                                    secondaryAction={
                                        <Tooltip title={t("MasterList.removeMaster")}
                                                 placement="right"
                                                 arrow>
                                            <IconButton sx={{width: 10}}
                                                        edge="end"
                                                        aria-label="delete"
                                                        onClick={() => removeMaster(master.id)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Tooltip>}>
                                    <ListItemText sx={{width: 10}}
                                                  primary={master.id}
                                    />
                                    <ListItemText sx={{width: 10}}
                                                  primary={master.user.id}/>

                                    <ListItemText sx={{width: 10,}}
                                                  primary={master.name}/>

                                    <ListItemText sx={{width: 10}}
                                                  primary={
                                                      <Rating name="read-only" size="small" value={master.rating}
                                                              precision={0.1} readOnly/>}/>
                                    <ListItemText sx={{
                                        width: 5,
                                        pl: openCityList === master ? 5 : 0,
                                        maxHeight: 150,
                                        overflowY: "auto",
                                        wordBreak: "break-word"
                                    }}
                                                  primary={
                                                      <Box>
                                                          {openCityList === master ?
                                                              <Box>
                                                                  <Box
                                                                      sx={{width: 70}}>  {createCityList(master, true)}</Box>
                                                                  <Button
                                                                      onClick={() => setOpenCityList({})}>{t("MasterList.hide")}</Button>
                                                              </Box>
                                                              :
                                                              <Box>
                                                                  {createCityList(master)}
                                                                  {master.cities.length > citiesLimit ?
                                                                      <Button size="small"
                                                                              onClick={() => setOpenCityList(master)}>{t("MasterList.more")}</Button> : null}</Box>
                                                          }
                                                      </Box>
                                                  }/>
                                    <ListItemText sx={{width: 10, textAlign: "center"}}
                                                  primary={
                                                      <IconButton sx={{width: 5}}
                                                                  aria-label="Reviews"
                                                                  onClick={() => getReviews(master.id)}
                                                      >
                                                          <ReviewsIcon/>
                                                      </IconButton>
                                                  }/>
                                    <ListItemText sx={{width: 10, mr: 5}}
                                                  primary={
                                                      <Button color={master.isActivated ? "success" : "error"}
                                                              size="small"
                                                              variant="outlined"
                                                              onClick={() => changeActiveted(master)}>
                                                          {master.isActivated ? t("MasterList.active") : t("MasterList.notActive")}
                                                      </Button>
                                                  }
                                    />
                                    <Tooltip title={t("MasterList.editMaster")}
                                             placement="left"
                                             arrow>
                                        <IconButton sx={{width: 5}}
                                                    edge="end"
                                                    aria-label="Edit"
                                                    onClick={() => forEdit(master)}
                                        >
                                            <EditIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </ListItem>
                            )
                        })}
                </List>}
            {editVisible ? <EditMaster open={editVisible}
                                       onClose={() => setEditVisible(false)}
                                       idToEdit={idToEdit}
                                       alertMessage={alertMessage}
                                       nameToEdit={nameToEdit}
                                       ratingToEdit={ratingToEdit}
                                       getMasters={() => getMasters(page, limit, sorting, ascending)}
                                       cityChosen={cityToEdit}/> : null}
            {openReview ? <ReviewModal open={openReview}
                                       masterId={masterId}
                                       onClose={() => setOpenReview(false)}/> : null}

            {createVisible ? <CreateMaster open={createVisible}
                                           getMasters={() => getMasters(page, limit, sorting, ascending)}
                                           alertMessage={alertMessage}
                                           onClose={() => setCreateVisible(false)}/> : null}
        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <TablsPagination page={page} totalCount={totalCount} limit={limit} pagesFunction={(page) => setPage(page)}/>
            <FormControl variant="standard" sx={{m: 1, width: 60, position: "absolute", left: 1000}} size="small">
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
export default MasterList;
