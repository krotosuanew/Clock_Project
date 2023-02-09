import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputAdornment,
    OutlinedInput,
    TextField
} from "@mui/material";
import SelectorMasterCity from "./SelectorMasterCity";
import {registrationFromAdmin} from "../../../http/userAPI";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {ERROR_400} from "../../../utils/constErrors";
import {useTranslation} from "react-i18next";
import "../../../i18next"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const CreateUser = (({open, onClose, alertMessage, getUsers}) => {
    const {t} = useTranslation()
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordCheck, setShowPasswordCheck] = useState(false)
    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        control,
        clearErrors,
        getValues,
        formState: {errors, dirtyFields}
    } = useForm();
    const createUser = async ({email, password, name, cityList, setError, isMaster}) => {
        const userData = {
            email,
            password,
            isMaster: isMaster ?? false,
            name,
            isActivated: true,
            cityId: cityList?.map(city => city.id) ?? undefined
        }
        try {
            await registrationFromAdmin(userData)
            close()
            alertMessage(t("CreateUser.alertCreate.successes"), false)
            getUsers()
        } catch (e) {
            if (e.message === ERROR_400) {
                setError("email", {
                    type: "manual",
                    message: t("CreateUser.errors.email")
                })
            }
            alertMessage(t("CreateUser.alertCreate.fail"), true)
        }
    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    const close = () => {
        onClose()
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={close}
            >
                <Box sx={style}>
                    <Typography align="center" variant="h5">
                        {t("CreateUser.topic")}
                    </Typography>
                    <FormProvider register={register} errors={errors} trigger={trigger} setValue={setValue}
                                  getValues={getValues}>
                        <form onSubmit={handleSubmit(createUser)}>
                            <Box sx={{display: "flex", flexDirection: "column"}}>
                                <TextField
                                    {...register("name", {
                                        required: t("CreateUser.name"),
                                        shouldFocusError: false,
                                    })}
                                    error={Boolean(errors.name)}
                                    helperText={errors.name?.message}
                                    sx={{my: 1}}
                                    id="name"
                                    label={t("CreateUser.name")}
                                    variant="outlined"
                                    required
                                    onBlur={() => trigger("name")}
                                />

                                <TextField
                                    {...register("email", {
                                        required: t("CreateUser.email"),
                                        shouldFocusError: false,
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: t("CreateUser.errors.emailInvalid")
                                        }
                                    })}
                                    error={Boolean(errors.email)}
                                    sx={{mb: 1}}
                                    id="Email"
                                    label={t("CreateUser.email")}
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
                                    <InputLabel required htmlFor="password">{t("CreateUser.password")}</InputLabel>
                                    <OutlinedInput
                                        {...register("password", {
                                            required: dirtyFields?.password ? t("CreateUser.errors.password") : null,
                                            minLength: {
                                                value: 6,
                                                message: t("CreateUser.errors.passwordLength")
                                            },
                                        })}
                                        autoComplete="new-password"
                                        id="password"
                                        label={t("CreateUser.password")}
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
                                                htmlFor="passwordCheck">{t("CreateUser.checkPassword")}</InputLabel>
                                    <OutlinedInput
                                        {...register("passwordCheck", {
                                            required: dirtyFields?.passwordCheck ? t("CreateUser.errors.checkPassword") : null,
                                            minLength: {
                                                value: 6,
                                                message: t("CreateUser.errors.passwordLength")
                                            },
                                            validate: {
                                                isSame: value => dirtyFields?.passwordCheck && dirtyFields?.password ? value === getValues("password") || t("CreateUser.errors.passwordInvalid") : null
                                            }
                                        })}
                                        defaultValue=""
                                        autoComplete="new-password"
                                        id="passwordCheck"
                                        label={t("CreateUser.checkPassword")}
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
                                    <FormControlLabel
                                        label={t("CreateUser.isMater")}
                                        control={
                                            <Controller
                                                name={"isMaster"}
                                                render={({}) => {
                                                    return (
                                                        <Checkbox onChange={(e) => {
                                                            setValue("isMaster", e.target.checked)
                                                            setValue('cityList', null)
                                                            clearErrors("cityList")
                                                        }}/>
                                                    );
                                                }}
                                                control={control}
                                            />
                                        }
                                    />
                                </Box>
                                {getValues("isMaster") ?
                                    <Box>
                                        <SelectorMasterCity/>
                                    </Box>
                                    : null}


                                <Box
                                    sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                                >
                                    <Button color="success"
                                            type="submit"
                                            sx={{flexGrow: 1,}} variant="outlined"
                                            disabled={Object.keys(errors).length !== 0}>
                                        {t("buttonAdd")}
                                    </Button>
                                    <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                            onClick={close}> {t("buttonClose")}</Button>
                                </Box>
                            </Box>
                        </form>
                    </FormProvider>
                </Box>
            </Modal>
        </div>
    );
});

export default CreateUser;
