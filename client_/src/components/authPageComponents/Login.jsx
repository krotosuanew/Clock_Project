import {
    Box,
    Card,
    CardContent,
    Container,
    FormControl,
    FormHelperText,
    InputAdornment,
    OutlinedInput,
    TextField
} from "@mui/material";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {
    ADMIN_ROUTE,
    CUSTOMER_ORDER_ROUTE,
    MASTER_ORDER_ROUTE,
    ORDER_ROUTE,
    REGISTRATION_ROUTE,
} from "../../utils/consts";
import Button from "@mui/material/Button";
import React, {useState} from "react";
import {ROLE_LIST} from "../../store/UserStore";
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "../../asyncActions/users";
import {Controller, useForm} from "react-hook-form";
import {ERROR_401, ERROR_404} from "../../utils/constErrors";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import {useTranslation} from "react-i18next";
import "../../i18next"
import '../../pages/buttonStyle.css'
import GoogleIcon from '@mui/icons-material/Google';

const Login = ({alertMessage, nextPage, getMasters, orderEmail}) => {
    const {t} = useTranslation()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const location = useLocation()
    const isOrder = location.pathname === ORDER_ROUTE;
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const {register, handleSubmit, trigger, setError, control, formState: {errors}} = useForm({mode: 'onTouched'});
    const dataForAuthorizations = {}
    const singIn = async (data) => {
        try {
            const dataUser = await dispatch(loginUser(data))
            if (user.isActivated === false && dataUser.role !== ROLE_LIST.ADMIN) {
                alertMessage(t("Login.alert"), true)
                return
            }
            if (isOrder) {
                getMasters()
                nextPage()
            } else {
                dataUser.role === ROLE_LIST.CUSTOMER && dataUser.isActivated === true ?
                    navigate(`${CUSTOMER_ORDER_ROUTE}/${dataUser.id}`) :
                    dataUser.role === ROLE_LIST.MASTER && dataUser.isActivated === true ?
                        navigate(`${MASTER_ORDER_ROUTE}/${dataUser.id}`) : navigate(ADMIN_ROUTE)
            }
        } catch (e) {
            if (e.message === ERROR_401) {
                setError("password", {
                    type: "manual",
                    message: t("Login.errors.wrongPassword")
                })
            } else if (e.message === ERROR_404) {
                setError("email", {
                    type: "manual",
                    message: t("Login.errors.wrongEmail")
                })
            }
        }
    }

    const responseService = async (response) => {
        let dataUser
        if (!!response.tokenId) {
            dataForAuthorizations.responseGoogle = response.tokenId
            dataUser = await dispatch(loginUser(dataForAuthorizations, "google"))
        } else {
            dataForAuthorizations.responseFacebook = response
            dataUser = await dispatch(loginUser(dataForAuthorizations, "facebook"))
        }
        dataUser.role === ROLE_LIST.CUSTOMER && dataUser.isActivated === true ?
            navigate(`${CUSTOMER_ORDER_ROUTE}/${dataUser.id}`) :
            dataUser.role === ROLE_LIST.MASTER && dataUser.isActivated === true ?
                navigate(`${MASTER_ORDER_ROUTE}/${dataUser.id}`) : navigate(ADMIN_ROUTE)
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    return (
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
                        {t("Login.topic")}
                    </Typography>
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
                            <Controller
                                name={"email"}
                                rules={{
                                    required: t("Login.email"),
                                    shouldFocusError: false,
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: t("Login.errors.email")
                                    }
                                }}
                                defaultValue={orderEmail ?? ""}
                                render={({field: {onChange, value, onBlur}, fieldState: {error}}) => {
                                    return (
                                        <TextField
                                            error={!!error}
                                            sx={{mb: 2}}
                                            id="Email"
                                            label={t("Login.email")}
                                            variant="outlined"
                                            helperText={error?.message}
                                            onChange={onChange}
                                            value={value}
                                            type={"email"}
                                            onBlur={() => trigger("email")}
                                        />
                                    );
                                }}
                                control={control}
                            />
                            <FormControl error={Boolean(errors.password)} variant="outlined">
                                <InputLabel htmlFor="password">{t("Login.password")}</InputLabel>
                                <OutlinedInput
                                    {...register("password", {
                                        required: t("Login.password"),
                                        minLength: {
                                            value: 6,
                                            message: t("Login.errors.passwordLength")
                                        }
                                    })}
                                    autoComplete="new-password"
                                    id="password"
                                    label={t("Login.password")}
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
                                    onBlur={() => trigger("password")}
                                />
                                <FormHelperText>{errors.password?.message}</FormHelperText>
                            </FormControl>
                            <Box
                                sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                            >
                                {!isOrder ?
                                    <Box>
                                        <div>
                                            {t("Login.question")}
                                            <NavLink to={REGISTRATION_ROUTE}> {t("Login.toRegistration")}</NavLink>
                                        </div>

                                    </Box> : <div></div>}
                                <Button type="submit"
                                        variant="outlined"
                                        color={"warning"}
                                        disabled={Object.keys(errors).length !== 0}
                                >
                                    {t("Login.signIn")}
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
                                            <button onClick={renderProps.onClick} className={'googleBtn'} disabled={renderProps.disabled}><GoogleIcon sx={{mb:"3px",mr:"1px"}} fontSize={"small"} color={"error"}/>{t("Login.signIn")}</button>
                                        )}
                                        icon={true}
                                        buttonText={t("Login.signIn")}
                                        onSuccess={responseService}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Container>)
}

export default Login;