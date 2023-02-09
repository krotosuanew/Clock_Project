import React from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, InputAdornment, TextField} from "@mui/material";
import {updateCity} from "../../../http/cityAPI";
import {useForm} from "react-hook-form";
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
const EditCity = ({open, onClose, cityToEdit, alertMessage, getCities}) => {
    const {register, handleSubmit, trigger, setError, formState: {errors}} = useForm();
    const {t} = useTranslation()
    const changeCity = async ({nameCity, price}) => {
        const cityInfo = {
            id: cityToEdit.id,
            name: nameCity.trim(),
            price: price
        }
        try {
            await updateCity(cityInfo)
            await getCities()
            alertMessage(t("EditCity.alertEdit.successes"), false)
            close()
        } catch (e) {
            setError("nameCity", {
                type: "manual",
                message: t("EditCity.errors.nameCity")
            })
            alertMessage(t("EditCity.alertEdit.fail"), true)
        }
    }
    const close = () => {
        onClose()
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={close}
            >
                <form onSubmit={handleSubmit(changeCity)}>
                    <Box sx={style}>
                        <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                            {t("EditCity.topic")}
                        </Typography>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <FormControl>
                                <TextField
                                    {...register("nameCity", {
                                        required: t("EditCity.name"),
                                        shouldFocusError: false,
                                    })}
                                    error={Boolean(errors.nameCity)}
                                    helperText={errors.nameCity?.message}
                                    sx={{mt: 1}}
                                    defaultValue={cityToEdit.name}
                                    id="nameCity"
                                    name='nameCity'
                                    label={t("EditCity.name")}
                                    variant="outlined"
                                    onBlur={() => trigger("nameCity")}
                                />
                                <TextField
                                    {...register("price", {
                                        required: t("EditCity.errors.price"),
                                        shouldFocusError: false,
                                        min: {
                                            value: 1,
                                            message: t("EditCity.errors.minPrice")
                                        }
                                    })}
                                    sx={{mt: 1}}
                                    defaultValue={cityToEdit.price}
                                    error={Boolean(errors.price)}
                                    type="number"
                                    id="price"
                                    helperText={errors.price?.message}
                                    label={t("EditCity.price")}
                                    variant="outlined"
                                    onBlur={() => trigger("price")}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                />
                            </FormControl>
                            <Box
                                sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                            >
                                <Button color="success" type="submit" sx={{flexGrow: 1,}} variant="outlined"
                                        disabled={Object.keys(errors).length !== 0}
                                > {t("buttonAdd")}</Button>
                                <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                        onClick={close}> {t("buttonClose")}</Button>
                            </Box>
                        </Box>
                    </Box>
                </form>

            </Modal>
        </div>
    );
};

export default EditCity;
