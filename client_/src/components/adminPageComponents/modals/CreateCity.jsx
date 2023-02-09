import React from 'react';
import {Box, Button, FormControl, InputAdornment, Modal, TextField, Typography} from "@mui/material";
import {createCity,} from "../../../http/cityAPI";
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
const CreateCity = ({open, onClose, alertMessage, getCities}) => {
    const {t} = useTranslation()
    const {register, handleSubmit, trigger, setError, formState: {errors}} = useForm();
    const addCity = async ({nameCity, price}) => {
        const cityInfo = {
            name: nameCity,
            price: price
        }
        try {
            await createCity(cityInfo)
            alertMessage(t("CreateCity.alertCreate.successes"), false)
            await getCities()
            close()
        } catch (e) {
            setError("nameCity", {
                type: "manual",
                message: t("CreateCity.errors.nameCity")
            })
            alertMessage(t("CreateCity.alertCreate.fail"), true)
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
                <form onSubmit={handleSubmit(addCity)}>
                    <Box sx={style}>
                        <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                            {t("CreateCity.topic")}
                        </Typography>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <FormControl>
                                <TextField
                                    {...register("nameCity", {
                                        required: t("CreateCity.name"),
                                    })}
                                    error={Boolean(errors.nameCity)}
                                    helperText={errors.nameCity?.message}
                                    sx={{mt: 1}}
                                    id="nameCity"
                                    name='nameCity'
                                    label={t("CreateCity.name")}
                                    variant="outlined"
                                    onBlur={() => trigger("nameCity")}
                                />
                                <TextField
                                    {...register("price", {
                                        required: t("CreateCity.errors.price"),
                                        min: {
                                            value: 1,
                                            message: t("CreateCity.errors.minPrice")
                                        }
                                    })}
                                    sx={{mt: 1}}
                                    error={Boolean(errors.price)}
                                    type="number"
                                    id="price"
                                    helperText={errors.price?.message}
                                    label={t("CreateCity.price")}
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
                                <Button color="success"
                                        type="submit"
                                        disabled={Object.keys(errors).length !== 0}
                                        sx={{flexGrow: 1,}}
                                        variant="outlined"
                                >
                                    {t("buttonAdd")}
                                </Button>
                                <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                        onClick={close}>
                                    {t("buttonClose")}
                                </Button>
                            </Box>
                        </Box>

                    </Box>
                </form>
            </Modal>
        </div>
    );
};

export default CreateCity;
