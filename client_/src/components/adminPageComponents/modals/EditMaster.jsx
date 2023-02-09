import React, {useEffect} from 'react';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {FormControl, TextField} from "@mui/material";
import {updateMaster} from "../../../http/masterAPI";
import SelectorMasterCity from "./SelectorMasterCity";
import {FormProvider, useForm} from "react-hook-form";
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
const EditMaster = (({open, onClose, idToEdit, alertMessage, nameToEdit, ratingToEdit, cityChosen, getMasters}) => {
    const {t} = useTranslation()
    const {register, handleSubmit, trigger, setValue, getValues, formState: {errors}} = useForm();
    useEffect(() => {
        setValue("cityList", cityChosen)
    }, [])
    const changeMaster = async ({masterName, rating, cityList}) => {
        const changeInfo = {
            id: idToEdit,
            name: masterName.trim(),
            rating,
            cityId: cityList.map(city => city.id)
        }
        try {
            await updateMaster(changeInfo)
            await getMasters()
            close()
            alertMessage(t("EditMaster.alertEdit.successes"), false)
        } catch (e) {
            alertMessage(t("EditMaster.alertEdit.successes"), true)
        }
    }

    const close = () => {
        onClose()
    }

    return (
        <Modal
            open={open}
            onClose={close}
        >
            <div>
                <FormProvider register={register} errors={errors} trigger={trigger} setValue={setValue}
                              getValues={getValues}>
                    <form onSubmit={handleSubmit(changeMaster)}>
                        <Box sx={style}>
                            <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                                {t("EditMaster.topic")}
                            </Typography>
                            <Box sx={{display: "flex", flexDirection: "column"}}>
                                <FormControl>
                                    <TextField
                                        {...register("masterName", {
                                            required: t("EditMaster.name"),
                                            shouldFocusError: false,
                                        })}
                                        error={Boolean(errors.masterName)}
                                        helperText={errors.masterName?.message}
                                        sx={{my: 1}}
                                        id="masterName"
                                        defaultValue={nameToEdit}
                                        label={t("EditMaster.name")}
                                        variant="outlined"
                                        required
                                        onBlur={() => trigger("masterName")}
                                    />
                                    <TextField
                                        {...register("rating", {
                                            validate: {
                                                positive: value => parseInt(value) >= 0 || t("EditMaster.errors.ratingMin"),
                                                lessThanSix: value => parseInt(value) < 6 || t("EditMaster.errors.ratingMax"),
                                            },
                                            valueAsNumber: true,
                                            setValueAs: (value) => parseFloat(value)
                                        })}
                                        sx={{mb: 1}}
                                        id="rating"
                                        error={Boolean(errors.rating)}
                                        helperText={errors.rating?.message}
                                        label={t("EditMaster.rating")}
                                        variant="outlined"
                                        defaultValue={ratingToEdit}
                                        name="rating"
                                        inputProps={{
                                            step: 0.1,
                                            min: 0,
                                            max: 5,
                                            type: 'number',
                                        }}
                                        onBlur={() => trigger("rating")}
                                    />
                                    <SelectorMasterCity cityChosen={cityChosen}/>
                                </FormControl>
                                <Box
                                    sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                                >
                                    <Button color="success" sx={{flexGrow: 1,}}
                                            variant="outlined"
                                            type="submit"
                                            disabled={Object.keys(errors).length !== 0}>
                                        {t("buttonEdit")}
                                    </Button>
                                    <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                            onClick={close}> {t("buttonClose")}</Button>
                                </Box>
                            </Box>
                        </Box>
                    </form>
                </FormProvider>
            </div>
        </Modal>
    );
});

export default EditMaster;
