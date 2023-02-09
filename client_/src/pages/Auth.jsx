import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grow,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography
} from "@mui/material";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {
    ADMIN_ROUTE,
    CONGRATULATION_ROUTE,
    CUSTOMER_ORDER_ROUTE,
    LOGIN_ROUTE,
    MASTER_ORDER_ROUTE,
} from "../utils/consts";
import {registration} from "../http/userAPI";
import SelectorMasterCity from "../components/adminPageComponents/modals/SelectorMasterCity";
import MyAlert from "../components/adminPageComponents/MyAlert";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Login from "../components/authPageComponents/Login";
import {FormProvider, useForm} from "react-hook-form";
import {ERROR_400} from "../utils/constErrors";
import {useTranslation} from "react-i18next";
import "../i18next"
import {useDispatch} from "react-redux";
import {ROLE_LIST} from "../store/UserStore";
import {loginUser} from "../asyncActions/users";
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from "react-google-login";
import {gapi} from 'gapi-script';
import GoogleIcon from "@mui/icons-material/Google";
import "./buttonStyle.css"

const Auth = () => {
    const dispatch = useDispatch()
    const {t} = useTranslation()
    const location = useLocation();
    const navigate = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordCheck, setShowPasswordCheck] = useState(false)
    const [open, setOpen] = useState(false)
    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState("")
    const [dataService, setDataService] = useState(null)
    const dataForAuthorizations = {}

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                scope: 'email',
            });
        }

        gapi.load('client:auth2', start);
    }, [])
    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        clearErrors,
        getValues, watch, setError,
        formState: {errors, dirtyFields}
    } = useForm();
    const isAgree = watch("isAgree", false);
    const isMaster = watch("isMaster", false)
    const cityList = watch("cityList", null)
    const onlyCities = watch("onlyCities", false)
    const alertMessage = (message, bool) => {
        setOpen(true)
        setMessage(message)
        setIsError(bool)
    }

    const singIn = async ({email, password, name, cityList, isMaster}) => {
        try {
            dataForAuthorizations.email = email
            dataForAuthorizations.password = password
            dataForAuthorizations.name = name
            dataForAuthorizations.cityList = isMaster ? cityList.map(city => city.id) : undefined
            dataForAuthorizations.isMaster = isMaster
            await registration(dataForAuthorizations)
            navigate(CONGRATULATION_ROUTE)
        } catch (e) {
            if (e.message === ERROR_400) {
                setError("email", {
                    type: "manual",
                    message: t("Registration.errors.wrongEmail")
                })
            }
        }
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const responseService = async (response) => {
        if (isMaster && cityList === null) {
            setValue("onlyCities", true)
            setDataService(response)
            return
        }
        if (!!response.tokenId) {
            dataForAuthorizations.responseGoogle = response.tokenId
        } else {
            dataForAuthorizations.responseFacebook = response
        }
        dataForAuthorizations.isMaster = isMaster
        dataForAuthorizations.cityList = isMaster ? cityList?.map(city => city.id) : undefined
        const dataUser = await dispatch(loginUser(dataForAuthorizations, !!response.tokenId ? "google" : "facebook"))
        dataUser.role === ROLE_LIST.CUSTOMER && dataUser.isActivated === true ?
            navigate(`${CUSTOMER_ORDER_ROUTE}/${dataUser.id}`) :
            dataUser.role === ROLE_LIST.MASTER && dataUser.isActivated === true ?
                navigate(`${MASTER_ORDER_ROUTE}/${dataUser.id}`) : navigate(ADMIN_ROUTE)
    }

    const registerMasterFromService = async () => {
        if (!cityList || cityList.length === 0) {
            setError("cityList", {
                type: "manual",
                message:  t("SelectorMasterCity.error")
            })
        }
        if (!!dataService.tokenId) {
            dataForAuthorizations.responseGoogle = dataService.tokenId
        } else {
            dataForAuthorizations.responseFacebook = dataService
        }
        dataForAuthorizations.isMaster = isMaster
        dataForAuthorizations.cityList = isMaster ? cityList.map(city => city.id) : undefined
        const dataUser = await dispatch(loginUser(dataForAuthorizations, !!dataService.tokenId ? "google" : "facebook"))
        dataUser.role === ROLE_LIST.CUSTOMER && dataUser.isActivated === true ?
            navigate(`${CUSTOMER_ORDER_ROUTE}/${dataUser.id}`) :
            dataUser.role === ROLE_LIST.MASTER && dataUser.isActivated === true ?
                navigate(`${MASTER_ORDER_ROUTE}/${dataUser.id}`) : navigate(ADMIN_ROUTE)
    }

    return (
        isLogin ?
            <Login alertMessage={alertMessage}/> :
            <Container
                maxWidth="xl"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: window.innerHeight - 60,
                }}
            >
                <Card sx={{width: 800, p: 1}}>
                    <CardContent>
                        <Typography align="center" variant="h5">
                            {onlyCities ?  t("Registration.master") : t("Registration.topic")}
                        </Typography>
                        <FormProvider register={register} errors={errors} trigger={trigger} setValue={setValue}
                                      getValues={getValues}>
                            <form onSubmit={handleSubmit(singIn)}>
                                <Box
                                    sx={{
                                        width: 700,
                                        mt: 3,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                    }}
                                >
                                    {!onlyCities ? <FormControl error={true}>
                                            <TextField
                                                {...register("name", {
                                                    required: t("Registration.name"),
                                                    shouldFocusError: false,
                                                })}
                                                error={Boolean(errors.name)}
                                                helperText={errors.name?.message}
                                                sx={{my: 1}}
                                                id="name"
                                                label={t("Registration.name")}
                                                variant="outlined"
                                                required
                                                onBlur={() => trigger("name")}
                                            />
                                            <TextField
                                                {...register("email", {
                                                    required: t("Registration.email"),
                                                    shouldFocusError: false,
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: t("Registration.errors.email")
                                                    }
                                                })}
                                                error={Boolean(errors.email)}
                                                sx={{mb: 1}}
                                                id="Email"
                                                label={t("Registration.email")}
                                                variant="outlined"
                                                helperText={errors.email?.message}
                                                type={"email"}
                                                name={"email"}
                                                required
                                                onBlur={() => trigger("email")}
                                            />
                                            <FormControl
                                                error={Boolean(errors.password || errors.passwordCheck?.type === "isSame")}
                                                variant="outlined">
                                                <InputLabel required
                                                            htmlFor="password">{t("Registration.password")}</InputLabel>
                                                <OutlinedInput
                                                    {...register("password", {
                                                        required: t("Registration.password"),
                                                        minLength: {
                                                            value: 6,
                                                            message: t("Registration.errors.passwordLength")
                                                        },
                                                    })}
                                                    autoComplete="new-password"
                                                    id="password"
                                                    label={t("Registration.password")}
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    onBlur={() => {
                                                        trigger("password")
                                                        trigger("passwordCheck")
                                                    }}
                                                />
                                                <FormHelperText>{errors.password?.message}</FormHelperText>
                                            </FormControl>
                                            <FormControl sx={{my: 1}} error={Boolean(errors.passwordCheck)}
                                                         variant="outlined">
                                                <InputLabel required
                                                            htmlFor="passwordCheck">{t("Registration.checkPassword")}</InputLabel>
                                                <OutlinedInput
                                                    {...register("passwordCheck", {
                                                        required: t("Registration.checkPassword"),
                                                        minLength: {
                                                            value: 6,
                                                            message: t("Registration.errors.passwordLength")
                                                        },
                                                        validate: {
                                                            isSame: value => dirtyFields?.passwordCheck && dirtyFields?.password ? value === getValues("password") || t("CreateUser.errors.passwordInvalid") : null
                                                        }
                                                    })}
                                                    defaultValue=""
                                                    autoComplete="new-password"
                                                    id="passwordCheck"
                                                    label={t("Registration.checkPassword")}
                                                    type={showPasswordCheck ? 'text' : 'password'}
                                                    name="passwordCheck"
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                                                                edge="end"
                                                            >
                                                                {showPasswordCheck ? <VisibilityOff/> : <Visibility/>}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    onBlur={() => {
                                                        trigger("passwordCheck")
                                                        trigger("password")
                                                    }}
                                                />
                                                <FormHelperText>{errors.passwordCheck?.message}</FormHelperText>
                                            </FormControl>


                                            <Box>
                                                <Box>
                                                    <FormControl error={Boolean(errors.isAgree)}>
                                                        <FormControlLabel
                                                            label={t("Registration.agree")}
                                                            control={
                                                                <Checkbox
                                                                    required
                                                                    {...register("isAgree")}
                                                                />}/>
                                                        <FormHelperText>{errors.isAgree?.message}</FormHelperText>
                                                    </FormControl>
                                                </Box>
                                                <Box>
                                                    <FormControlLabel
                                                        label={t("Registration.isMaster")}
                                                        control={
                                                            <Checkbox  {...register("isMaster")}
                                                                       onClick={() => {
                                                                           clearErrors("cityList")
                                                                           setValue("cityList", null)
                                                                       }}/>}
                                                    />
                                                </Box>
                                            </Box>

                                            {isMaster &&
                                                <Grow in={isMaster}>
                                                    <Box>
                                                        <SelectorMasterCity/>
                                                    </Box>
                                                </Grow>}

                                            <Box
                                                sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                                            >

                                                <div>
                                                    {t("Registration.question")} <NavLink
                                                    to={LOGIN_ROUTE}>{t("Registration.toLogin")}</NavLink>
                                                </div>

                                                <Button type="submit" variant="outlined"
                                                        color={"warning"}
                                                        disabled={Object.keys(errors).length !== 0}>
                                                    {t("Registration.button")}
                                                </Button>
                                            </Box>
                                            <Box sx={{height: 40, display: "flex"}}>
                                                <FacebookLogin
                                                    textButton={t("Login.signIn")}
                                                    autoLoad={false}
                                                    appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
                                                    fields="name,email"
                                                    icon="fa-facebook"
                                                    cssClass="facebookBtn"
                                                    callback={responseService}/>
                                                <Box sx={{ml: 2}}>
                                                    <GoogleLogin
                                                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                                        autoLoad={false}
                                                        render={renderProps => (
                                                            <button onClick={renderProps.onClick} className={'googleBtn'} disabled={renderProps.disabled}><GoogleIcon sx={{mb:"3px",mr:"1px"}}  fontSize={"small"} color={"error"}/>{t("Login.signIn")}</button>
                                                        )}
                                                        icon={true}
                                                        buttonText={t("Login.signIn")}
                                                        onSuccess={responseService}
                                                    />
                                                </Box>
                                            </Box>

                                        </FormControl> :
                                        <Box>
                                            <Typography sx={{mb: 2}} variant="h5">
                                                {t("Registration.cities")}
                                            </Typography>
                                            <SelectorMasterCity/>
                                            <Button variant="outlined"
                                                    color={"warning"}
                                                    size={"small"}
                                                    sx={{mt: 2}}
                                                    onClick={() => registerMasterFromService()}
                                                    disabled={Object.keys(errors).length !== 0}>
                                                {t("Registration.confirm")}
                                            </Button>
                                        </Box>
                                    }
                                </Box>
                            </form>
                        </FormProvider>
                    </CardContent>
                </Card>
                <MyAlert open={open}
                         onClose={() => setOpen(false)}
                         message={message}
                         isError={isError}/>
            </Container>
    )
};

export default Auth;
