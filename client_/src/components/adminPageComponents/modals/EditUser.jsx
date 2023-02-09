import React, {useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputAdornment,
    Modal,
    OutlinedInput,
    TextField,
    Typography
} from "@mui/material";
import {updateUser} from "../../../http/userAPI";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Controller, useForm} from "react-hook-form";
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
const EditUser = (({open, onClose, userToEdit, alertMessage, getUsers}) => {
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
    const changeUser = async ({email, password}) => {
        const changeInfo = {
            email
        }
        if (password) {
            changeInfo.password = password
        }
        try {
            await updateUser(userToEdit.id, changeInfo)
            await getUsers()
            alertMessage(t("EditUser.alertEdit.successes"), false)
            close()
        } catch (e) {
            alertMessage(t("EditUser.alertEdit.successes"), true)
        }
    }
    const close = () => {
        onClose()
    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    return (
        <Modal
            open={open}
            onClose={close}
        >
            <Box>
                <form onSubmit={handleSubmit(changeUser)}>
                    <Box sx={style}>
                        <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                            {t("EditUser.topic")}
                        </Typography>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <TextField
                                {...register("email", {
                                    required: t("EditUser.email"),
                                    shouldFocusError: false,
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: t("EditUser.errors.emailInvalid")
                                    }
                                })}
                                error={Boolean(errors.email)}
                                sx={{mb: 1}}
                                id="Email"
                                label={t("EditUser.email")}
                                variant="outlined"
                                helperText={errors.email?.message}
                                type={"email"}
                                name={"email"}
                                defaultValue={userToEdit.email}
                                required
                                onBlur={() => trigger("email")}
                            />
                            {getValues("editPassword") ?
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <FormControl
                                        error={Boolean(errors.password || errors.passwordCheck?.type === "isSame")}
                                        variant="outlined">
                                        <InputLabel required htmlFor="password">{t("EditUser.password")}</InputLabel>
                                        <OutlinedInput
                                            {...register("password", {
                                                required: dirtyFields?.password ? t("EditUser.errors.password") : null,
                                                minLength: {
                                                    value: 6,
                                                    message: t("EditUser.errors.passwordLength")
                                                },
                                            })}
                                            autoComplete="new-password"
                                            id="password"
                                            label={t("EditUser.errors.password")}
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
                                                    htmlFor="passwordCheck">{t("EditUser.checkPassword")}</InputLabel>
                                        <OutlinedInput
                                            {...register("passwordCheck", {
                                                required: dirtyFields?.passwordCheck ? t("EditUser.errors.checkPassword") : null,
                                                minLength: {
                                                    value: 6,
                                                    message: t("EditUser.errors.passwordLength")
                                                },
                                                validate: {
                                                    isSame: value => dirtyFields?.passwordCheck && dirtyFields?.password ? value === getValues("password") || t("EditUser.errors.passwordInvalid") : null
                                                }
                                            })}
                                            defaultValue=""
                                            autoComplete="new-password"
                                            id="passwordCheck"
                                            label={t("EditUser.checkPassword")}
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
                                </Box> : null}
                            <Box>
                                <FormControlLabel
                                    label={t("EditUser.changePassword")}
                                    control={
                                        <Controller
                                            name={"editPassword"}
                                            render={({}) => {
                                                return (
                                                    <Checkbox onChange={(e) => {
                                                        setValue("editPassword", e.target.checked)
                                                        setValue("password", null)
                                                        clearErrors(["password", 'passwordCheck'])
                                                    }}/>
                                                );
                                            }}
                                            control={control}
                                        />
                                    }/>
                            </Box>
                            <Box
                                sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                            >
                                <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                        disabled={Object.keys(errors).length !== 0}
                                        type="submit">
                                    {t("buttonEdit")}
                                </Button>
                                <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                        onClick={close}>{t("buttonClose")}</Button>
                            </Box>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
});

export default EditUser;
