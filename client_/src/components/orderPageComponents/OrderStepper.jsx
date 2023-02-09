import * as React from "react";
import {useEffect, useState} from "react";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControlLabel,
    Grow,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Popover,
    Radio,
    RadioGroup,
    Rating,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {fetchMastersForOrder} from "../../http/masterAPI";
import {createOrder} from "../../http/orderAPI";
import {checkEmail} from "../../http/userAPI";
import {CUSTOMER_ORDER_ROUTE, START_ROUTE} from "../../utils/consts";
import SelectorSize from "./SelectorSize";
import SelectorCity from "../SelectorCity";
import {DatePicker, LocalizationProvider, TimePicker} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ruLocale from 'date-fns/locale/ru'
import Login from "../authPageComponents/Login";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ReviewModal from "../ReviewModal";
import {setUserNameAction} from "../../store/UserStore";
import {addHours, getHours, isToday, set} from 'date-fns'
import {useDispatch, useSelector} from "react-redux";
import TablsPagination from "../TablsPagination";
import {Controller, FormProvider, useForm} from "react-hook-form";
import PopupState, {bindPopover, bindTrigger} from 'material-ui-popup-state';
import jwt_decode from "jwt-decode";
import AddPhoto from "./AddPhoto";
import ReactPayPal from "./PayPal";
import {useTranslation} from "react-i18next";
import "../../i18next"
import enLocale from "date-fns/locale/en-US";
import {update} from "../../asyncActions/users";

const localeMap = {
    en: enLocale,
    ru: ruLocale,
};

const OrderStepper = ({alertMessage}) => {
    const {t} = useTranslation()
    const user = useSelector(state => state.user)
    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        setError,
        clearErrors,
        getValues, watch, control,
        formState: {errors, isValid}
    } = useForm({
        defaultValues: {
            openTime: false,
            openDate: false,
            openPayPal: true,
            date: new Date(),
            time: addHours(set(new Date(), {minutes: 0, seconds: 0}), 1),
            email: user?.user?.email ?? "",
            name: user.userName ?? "",
            photos: []
        }
    });
    const dispatch = useDispatch()
    const name = watch("name")
    const email = watch("email")
    const date = watch("date")
    const time = watch("time")
    const [activeStep, setActiveStep] = useState(0);
    const [changeName, setChangeName] = useState(null)
    const [regCustomer, setRegCustomer] = useState(null)
    const [chosenMaster, setChosenMaster] = useState(null);
    const [chosenCity, setChosenCity] = useState({id: null});
    const [chosenSize, setChosenSize] = useState({id: null});
    const [freeMasters, setFreeMasters] = useState([]);
    const [loading, setLoading] = useState(false)
    const [isAuth, setIsAuth] = useState(false)
    const [openReview, setOpenReview] = useState(false)
    const [masterId, setMasterId] = useState(null)
    const [limit, setLimit] = useState(3)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const steps = [t("OrderStepper.firstStep"), t("OrderStepper.secondStep"), t("OrderStepper.nextStep")];
    const navigate = useNavigate();
    const getMasters = async () => {
        setLoading(true)
        try {
            const res = await fetchMastersForOrder(chosenCity.id, set(new Date(date), {
                    hours: getHours(time),
                    minutes: 0,
                    seconds: 0, milliseconds: 0
                }),
                chosenSize.id, page, limit)
            if (res.status === 204) {
                setFreeMasters([])
                setLoading(false)
                return
            }
            setFreeMasters(res.data.rows)
            setTotalCount(res.data.count);
            setLoading(false)
        } catch (e) {
            setFreeMasters([])
        } finally {
            setLoading(false)
        }
    }


    const handleNext = async (event) => {
        const {email, name, photos} = event
        if (user.isAuth || regCustomer !== null) {
            if (user.userName !== name && changeName === null) {
                setValue("emailExists", false)
                setRegCustomer(false)
                return
            }
            if (activeStep === 0) {
                await getMasters()
                console.log(activeStep)
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else if (activeStep === 1 && chosenMaster) {
                setChosenMaster(Number(chosenMaster))
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                setLoading(true)
                const orderInfo = {
                    name,
                    time: set(new Date(date), {hours: getHours(time), minutes: 0, seconds: 0, milliseconds: 0}),
                    email,
                    changeName,
                    cityId: chosenCity.id,
                    masterId: chosenMaster,
                    sizeClockId: chosenSize.id,
                    regCustomer,
                    price: chosenSize.date.slice(0, 2) * chosenCity.price,
                    photos: photos,
                }
                try {
                    const res = await createOrder(orderInfo)
                    if (changeName) {
                        const dataUser = jwt_decode(res.data.token)
                        if (dataUser.name) {
                            dispatch(setUserNameAction(name))
                            localStorage.setItem('token', res.data.token)
                            dispatch(setUserNameAction(dataUser.name))
                        }
                    }
                    setValue("orderId", res.data.orderId)
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                } catch (e) {
                    alertMessage('Мастер занят', true)
                    setActiveStep(1)
                    setLoading(true)
                    await getMasters()
                } finally {
                    setLoading(false)
                }
            }
        } else {
            setLoading(true)
            try {
                const res = await checkEmail(email)
                if (res.status === 204) {
                    setValue("emailExists", false)
                } else if (res.status === 200) {
                    setValue("emailExists", true)
                }
            } finally {
                setLoading(false)
            }
        }

    };
    const getReviews = (id) => {
        setMasterId(id)
        setOpenReview(true)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const choseMaster = (event, master) => {
        event ? setChosenMaster(event.target.value) : setChosenMaster(master);
    };
    useEffect(async () => {
        if (activeStep === 1) {
            setLoading(true)
            try {
                const res = await fetchMastersForOrder(chosenCity.id,
                    set(new Date(date), {
                        hours: getHours(time),
                        minutes: 0,
                        seconds: 0
                    }),
                    chosenSize.id,
                    page, limit)
                if (res.status === 204) {
                    setFreeMasters([])
                    return
                }
                setFreeMasters(res.data.rows)
            } catch {
                setFreeMasters([])
            } finally {
                setLoading(false)
            }
        }
    }, [page, limit])
    const change = async ({changeEmail, email}) => {
        await dispatch(update(changeEmail, email))
        setValue('email',changeEmail)
    }
    if (user.user && user.user.email?.includes("@clockwise.com")) {
        return (
            <form onSubmit={handleSubmit(change)}>
                <Typography sx={{mb: 2}} align="center" variant="h5">
                    {t("Registration.email")}
                </Typography>
                <Controller
                    name={"changeEmail"}
                    rules={{
                        required: t("Registration.email"),
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: t("Registration.errors.email")
                        }
                    }}
                    render={({field: {onChange, value, onBlur}, fieldState: {error}}) => {
                        return (
                            <TextField
                                fullWidth
                                error={!!error}
                                autoComplete="off"
                                id="changeEmail"
                                label={t("Registration.email")}
                                variant="outlined"
                                helperText={error?.message}
                                onChange={onChange}
                                value={value || ""}
                                type={"email"}
                                required
                                onBlur={() => trigger("changeEmail")}
                            />
                        );
                    }}
                    control={control}
                />
                <Button disabled={!!errors.changeEmail} fullWidth sx={{mt: 2}} type="submit" variant="outlined"
                        color={"warning"}> Изменить email</Button>
            </form>
        )
    }
    return (
        isAuth ?
            <Box>
                <Login
                    orderEmail={email}
                    getMasters={() => getMasters()}
                    nextPage={() => {
                        setActiveStep(0)
                        setIsAuth(false)
                    }}/>
            </Box>
            :
            <Box sx={{width: "100%"}}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => {
                        return (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <FormProvider register={register} errors={errors} control={control} trigger={trigger}
                              setValue={setValue} watch={watch}>
                    <form data-testid={"formOrder"} onSubmit={handleSubmit(handleNext)}>
                        {activeStep === 0 ? (
                            <Box sx={{mt: 2}}>
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <TextField
                                        {...register("name", {
                                            required: t("OrderStepper.name"),
                                            minLength: {
                                                value: 3,
                                                message: t("OrderStepper.errors.name")
                                            }
                                        })}
                                        autoComplete="off"
                                        error={Boolean(errors.name)}
                                        helperText={errors.name?.message}
                                        sx={{my: 1}}
                                        id="name"
                                        label={t("OrderStepper.name")}
                                        variant="outlined"
                                        inputProps={{"data-testid": "name-textField"}}
                                        required
                                        onBlur={() => trigger("name")}
                                    />
                                    <Controller
                                        name={"email"}
                                        rules={{
                                            required: t("OrderStepper.email"),
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: t("OrderStepper.errors.email")
                                            }
                                        }}
                                        render={({field: {onChange, value, onBlur}, fieldState: {error}}) => {
                                            return (
                                                <TextField
                                                    error={!!error}
                                                    autoComplete="off"
                                                    id={"Email"}
                                                    label={t("OrderStepper.email")}
                                                    variant="outlined"
                                                    helperText={error?.message}
                                                    onChange={onChange}
                                                    value={value || ""}
                                                    type={"email"}
                                                    required
                                                    onBlur={() => trigger("email")}
                                                    inputProps={{"data-testid": "email-textField"}}
                                                />
                                            );
                                        }}
                                        control={control}
                                    />
                                </Box>
                                <Box
                                    sx={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", my: 2}}
                                >
                                    <SelectorCity cleanMaster={() => setChosenMaster(null)}
                                                  chosenCity={chosenCity}
                                                  setChosenCity={(city) => setChosenCity(city)}/>
                                    <SelectorSize cleanMaster={() => setChosenMaster(null)}
                                                  chosenSize={chosenSize}
                                                  setChosenSize={(size) => setChosenSize(size)}/>
                                </Box>
                                <Box data-testid={"price"}  sx={{my: 2}}>{t("OrderStepper.orderInfo.price")}
                                    <b>{chosenSize.id !== null && chosenCity.id !== null ?
                                        "$" + chosenSize.date.slice(0, 2) * chosenCity.price : null} </b></Box>
                                <Controller
                                    name="date"
                                    control={control}
                                    render={({field: {onChange, value}, fieldState: {error}}) => (
                                        <LocalizationProvider sx={{cursor: "pointer"}} dateAdapter={AdapterDateFns}
                                                              locale={localeMap[localStorage.getItem("i18nextLng")]}>
                                            <DatePicker
                                                mask='__.__.____'
                                                label={t("OrderStepper.date")}
                                                disableHighlightToday
                                                value={value || ""}
                                                open={watch("openDate", false)}
                                                onChange={(newDate) => {
                                                    onChange(newDate);
                                                    setValue("openDate", false)
                                                    setValue("openList", false)
                                                    clearErrors("date")
                                                }}
                                                onError={(e) =>
                                                    setError("date", {
                                                        type: "manual",
                                                        message: t("OrderStepper.errors.date")
                                                    })}
                                                minDate={new Date()}
                                                renderInput={(params) =>
                                                    <TextField
                                                        onClick={() => setValue("openDate", true)}
                                                        helperText={errors.date?.message}
                                                        sx={{
                                                            mr: 2,
                                                            '& .MuiInputBase-input': {
                                                                cursor: "pointer",
                                                            }
                                                        }}
                                                        {...params} />}
                                            />
                                        </LocalizationProvider>)}
                                    rules={t("OrderStepper.errors.emptyDate")}
                                />
                                <Controller
                                    name="time"
                                    control={control}
                                    render={({field: {onChange, value}, fieldState: {error}}) => (
                                        <LocalizationProvider dateAdapter={AdapterDateFns}
                                                              locale={ruLocale}>
                                            <TimePicker
                                                readOnly
                                                label={t("OrderStepper.time")}
                                                value={value || ""}
                                                open={watch("openTime", false)}
                                                onChange={(newValue) => {
                                                    onChange(newValue)
                                                    setValue("openTime", false)
                                                    setValue("openList", false)
                                                    clearErrors("time")
                                                }}
                                                onError={() =>
                                                    setError("time", {
                                                        type: "manual",
                                                        message: t("OrderStepper.errors.time")
                                                    })}
                                                onBlur={() => trigger("time")}
                                                ampm={false}
                                                views={["hours"]}
                                                minTime={isToday(getValues("date")) ?
                                                    addHours(set(new Date(), {minutes: 0, seconds: 0}), 1) :
                                                    new Date(0, 0, 0, 8)}
                                                maxTime={new Date(0, 0, 0, 22)}
                                                renderInput={(params) =>
                                                    <TextField helperText={t("OrderStepper.helperText")}
                                                               sx={{
                                                                   '& .MuiInputBase-input': {
                                                                       cursor: "pointer"
                                                                   }
                                                               }}
                                                               onClick={() => {
                                                                   setValue("openTime", true)
                                                               }}
                                                               {...params} />}
                                            />
                                        </LocalizationProvider>)}
                                    rules={{
                                        required: t("OrderStepper.errors.emptyTime")
                                    }}
                                />
                                <AddPhoto alertMessage={alertMessage}/>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    pt: 2
                                }}>
                                    {activeStep === 0 ?
                                        <Link to={START_ROUTE}
                                              style={{textDecoration: 'none', color: 'black'}}>
                                            <Button
                                                data-testid={"buttonStartPage"}
                                                color="inherit"
                                                onClick={() => {
                                                    navigate(START_ROUTE)
                                                }}
                                                sx={{mr: 1}}
                                            >
                                                {t("OrderStepper.startPage")}
                                            </Button>
                                        </Link>
                                        :
                                        <Button
                                            color="inherit"
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            sx={{mr: 1}}
                                        >
                                            {t("OrderStepper.startPage")}
                                        </Button>}
                                    <PopupState
                                        variant="popover"
                                        type="submit" popupId="demo-popup-popover">
                                        {(popupState) => (
                                            <div>
                                                <Button
                                                    data-testid={"buttonNextPage"}
                                                    type='submit'
                                                    {...bindTrigger(popupState)}
                                                >
                                                    {t("OrderStepper.next")}
                                                </Button>
                                                {(regCustomer === null && !user.isAuth || user.isAuth && user.userName !== name || changeName === null && user.isAuth) && isValid && !loading ?
                                                    <Popover
                                                        {...bindPopover(popupState)}
                                                        data-testid="popover"
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'center',
                                                        }}
                                                        transformOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'center',
                                                        }}
                                                    >{
                                                        getValues("emailExists") ?
                                                            <Box sx={{
                                                                display: 'flex',
                                                                flexDirection: "column",
                                                                mb: 1
                                                            }}>
                                                                <Typography sx={{p: 2}}>
                                                                    {t("OrderStepper.authorizationHeader")}
                                                                </Typography>
                                                                <Button onClick={() => {
                                                                    setIsAuth(true)
                                                                }}>
                                                                    {t("OrderStepper.authorization")}
                                                                </Button>
                                                            </Box>
                                                            : user.isAuth && user.userName !== name && changeName === null ?
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    flexDirection: "column",
                                                                    mb: 1
                                                                }}>
                                                                    <Typography sx={{p: 2}}>
                                                                        {t("OrderStepper.changeData")}
                                                                    </Typography>
                                                                    <div style={{textAlign: "center"}}>
                                                                        {user.isAuth && user.userName !== name ?
                                                                            <b>Имя</b> : null}</div>
                                                                    <Button
                                                                            onClick={() => {
                                                                                setChangeName(true)
                                                                                getMasters()
                                                                                setActiveStep((prevActiveStep) => prevActiveStep + 1)

                                                                            }}>
                                                                        {t("OrderStepper.yesButton")}
                                                                    </Button>
                                                                    <Button onClick={() => {
                                                                        setChangeName(false)
                                                                        getMasters()
                                                                        setActiveStep((prevActiveStep) => prevActiveStep + 1)
                                                                    }}>
                                                                        {t("OrderStepper.noButton")}
                                                                    </Button>
                                                                </Box> :
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    flexDirection: "column",
                                                                    mb: 1
                                                                }}>
                                                                    <Typography sx={{p: 2}}>
                                                                        {t("OrderStepper.registration")}
                                                                    </Typography>
                                                                    <Button onClick={() => {
                                                                        setRegCustomer(true)
                                                                        setChangeName(false)
                                                                        getMasters()
                                                                        setActiveStep((prevActiveStep) => prevActiveStep + 1)
                                                                    }}>
                                                                        {t("OrderStepper.yesButton")}
                                                                    </Button>
                                                                    <Button onClick={() => {
                                                                        setRegCustomer(false)
                                                                        setChangeName(false)
                                                                        getMasters()
                                                                        setActiveStep((prevActiveStep) => prevActiveStep + 1)
                                                                    }}>
                                                                        {t("OrderStepper.noButton")}
                                                                    </Button>

                                                                </Box>
                                                    }
                                                    </Popover> : null}
                                            </div>
                                        )}
                                    </PopupState>

                                </Box>
                            </Box>
                        ) : activeStep === steps.length - 1 ? (
                                loading ?
                                    <Box sx={{
                                        mt: 2,
                                        display: "flex",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}>
                                        <Box>{t("OrderStepper.loading")}</Box>
                                        <CircularProgress/>
                                    </Box> :
                                    <Box sx={{mt: 2}}>
                                        <Box sx={{ml: 4}}>
                                            <Box sx={{mb: 1}}> {t("OrderStepper.orderInfo.name")}<b>{name}</b>
                                            </Box>
                                            <Box sx={{mb: 1}}> {t("OrderStepper.orderInfo.email")}<b>{email}</b>
                                            </Box>
                                            <Box
                                                sx={{mb: 1}}>{t("OrderStepper.orderInfo.clock")}<b>{chosenSize.name}</b></Box>
                                            <Box sx={{mb: 1}}> {t("OrderStepper.orderInfo.city")}
                                                <b>{chosenCity.name}</b></Box>
                                            <Box sx={{mb: 1}}>{t("OrderStepper.orderInfo.date")}
                                                <b>{date.toLocaleDateString("uk-UA")} </b></Box>
                                            <Box sx={{mb: 1}}>{t("OrderStepper.orderInfo.time")} Время
                                                заказа: <b>{time.toLocaleTimeString("uk-UA")}</b></Box>
                                            <Box> {t("OrderStepper.orderInfo.master")}
                                                <b>{freeMasters.find(item => item.id === chosenMaster).name}</b></Box>
                                            <Box sx={{my: 1}}>{t("OrderStepper.orderInfo.price")}
                                                <b>{chosenSize.id !== null && chosenCity.id !== null ? "$" + chosenSize.date.slice(0, 2) * chosenCity.price : null} </b>
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            pt: 2
                                        }}>
                                            <Button
                                                color="inherit"
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                                sx={{mr: 1}}
                                            >
                                                {t("OrderStepper.Back")}
                                            </Button>
                                            <Button
                                                type={"submit"}
                                                disabled={!chosenMaster}>
                                                {t("OrderStepper.sendOrder")}
                                            </Button>
                                        </Box>
                                    </Box>) :
                            ///////////////////////////////////////////////////////////////////////////////////////////////////
                            activeStep === steps.length - 2 ? (
                                <Box sx={{mt: 2, position: "relative"}}>
                                    {loading ?
                                        (
                                            <Box sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}>
                                                <CircularProgress/>
                                            </Box>
                                        )
                                        : totalCount === 0 ? (
                                            <Typography  data-testid="emptyList" variant="h4" sx={{my: 2, textAlign: "center"}}>
                                                {t("OrderStepper.emptyList")}
                                            </Typography>) : (
                                            <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: 300}}>
                                                <Typography  data-testid="freeMasters"sx={{my: 4,}}>
                                                    {t("OrderStepper.freeMasters")}
                                                </Typography>
                                                <List disablePadding>
                                                    <ListItem key={1} divider
                                                    >
                                                        <ListItemText sx={{width: 10, textAlign: "center"}}
                                                                      primary="№"/>
                                                        <ListItemText sx={{width: 10, textAlign: "center"}}
                                                                      primary={t("OrderStepper.nameMaster")}/>
                                                        <ListItemText sx={{width: 10, textAlign: "center"}}
                                                                      primary={t("OrderStepper.rating")}/>
                                                        <ListItemText sx={{width: 10, textAlign: "center"}}
                                                                      primary={t("OrderStepper.city")}/>
                                                        <ListItemText sx={{width: 10, textAlign: "center", mr: 5}}
                                                                      primary={t("OrderStepper.reviews")}/>

                                                    </ListItem>
                                                    <Divider orientation="vertical"/>
                                                    <RadioGroup
                                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                                        name="controlled-radio-buttons-group"
                                                        value={chosenMaster}
                                                        onChange={choseMaster}
                                                    >
                                                        {freeMasters.length === 0 ? (
                                                            <Typography sx={{mb: 2}}>
                                                                {t("OrderStepper.emptyList")}
                                                            </Typography>
                                                        ) : (
                                                            freeMasters.map((master, index) => {
                                                                return (
                                                                    <Grow in={!!master} key={master.id}>
                                                                        <ListItem
                                                                            divider
                                                                            data-testid={'masterList'}
                                                                            style={{cursor: 'pointer'}}
                                                                            selected={chosenMaster === master.id}
                                                                            onClick={() => choseMaster(null, master.id)}
                                                                            secondaryAction={
                                                                                <Tooltip
                                                                                    title={t("OrderStepper.selectMaster")}
                                                                                    placement="right"
                                                                                    arrow>
                                                                                    <FormControlLabel
                                                                                        data-testid={'radioSelect'}
                                                                                        value={master.id}
                                                                                        control={<Radio/>}
                                                                                        label=""/>
                                                                                </Tooltip>
                                                                            }
                                                                        >
                                                                            <ListItemText
                                                                                sx={{width: 10, textAlign: "center"}}
                                                                                primary={index + 1}/>
                                                                            <ListItemText
                                                                                sx={{width: 10, textAlign: "center"}}
                                                                                primary={master.name}/>
                                                                            <ListItemText
                                                                                sx={{width: 10, textAlign: "center"}}
                                                                                primary={<Rating name="read-only"
                                                                                                 size="small"
                                                                                                 precision={0.2}
                                                                                                 value={master.rating}
                                                                                                 readOnly/>}/>
                                                                            <ListItemText
                                                                                sx={{width: 10, textAlign: "center"}}
                                                                                primary={master.cities[0].name}/>
                                                                            <ListItemText
                                                                                sx={{width: 10, textAlign: "center"}}
                                                                                primary={
                                                                                    <IconButton sx={{width: 5}}
                                                                                                data-testid={'reviewButton'}
                                                                                                aria-label="Reviews"
                                                                                                onClick={() => getReviews(master.id)}
                                                                                    >
                                                                                        <ReviewsIcon/>
                                                                                    </IconButton>
                                                                                }/>
                                                                        </ListItem>
                                                                    </Grow>
                                                                );
                                                            })
                                                        )}
                                                    </RadioGroup>
                                                </List>
                                                <Box sx={{display: "flex", justifyContent: "center"}}>
                                                    <TablsPagination page={page} totalCount={totalCount} limit={limit}
                                                                     pagesFunction={(page) => setPage(page)}/>
                                                </Box>
                                                {loading ? <CircularProgress size={30}
                                                                             sx={{
                                                                                 position: "absolute",
                                                                                 right: 5,
                                                                                 bottom: 85
                                                                             }}/> : ""}
                                            </Box>)
                                    }
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        pt: 2
                                    }}>
                                        <Button
                                            color="inherit"
                                            onClick={handleBack}
                                            sx={{mr: 1}}
                                        >
                                            {t("OrderStepper.Back")}
                                        </Button>
                                        <Button type="submit"
                                                data-testid={'goToNext'}
                                                disabled={!chosenMaster}>
                                            {t("OrderStepper.next")}
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{display: 'flex', justifyContent: "center", mt: 2}}>
                                    <Box>
                                        <Typography variant="h4" sx={{
                                            my: 2,
                                            textAlign: "center"
                                        }}>{t("OrderStepper.orderCreated")}</Typography>
                                        <Typography variant="h6" sx={{
                                            my: 2,
                                            textAlign: "center"
                                        }}>{t("OrderStepper.sendOrderToMail")}</Typography>
                                        <Box>
                                            <ReactPayPal orderId={getValues("orderId")}
                                                         isAuth={user.isAuth}
                                                         userLink={`${CUSTOMER_ORDER_ROUTE}/${user.user.id}`}
                                                         value={chosenSize.date.slice(0, 2) * chosenCity.price}/>
                                        </Box>
                                    </Box>
                                </Box>

                            )}
                        {openReview ? <ReviewModal open={openReview}
                                                   masterId={masterId}
                                                   onClose={() => setOpenReview(false)}/> : null}
                    </form>
                </FormProvider>
            </Box>
    );
}
export default OrderStepper;
