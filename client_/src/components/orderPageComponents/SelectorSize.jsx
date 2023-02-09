import * as React from 'react';
import {useEffect, useState} from 'react';
import {Box, FormControl, FormHelperText, InputLabel, MenuItem, Select} from '@mui/material';
import {fetchSize} from "../../http/sizeAPI";
import {Controller, useFormContext} from "react-hook-form";
import {useTranslation} from "react-i18next";
import "../../i18next"

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250,
        },
    },
};

export default function SelectorSize({setChosenSize, sizeToEdit, chosenSize, cleanMaster}) {
    const [clockList, setClockList] = useState([])
    const {control, errors, trigger, setValue} = useFormContext();
    const {t} = useTranslation()
    useEffect(async () => {
        try {
            const res = await fetchSize(null, null)
            if (res.status === 204) {
                setClockList([])
                return
            }
            setClockList(res.data.rows)
            if (sizeToEdit) {
                setChosenSize(res.data.rows.find(size => size.id === sizeToEdit))
            }
        } catch (e) {
            setClockList([])
        }
    }, []);
    const handelChange = (onChange, e) => {
        onChange(e)
        if (sizeToEdit) {
            setValue("openList", false)
        }
    }
    return (<Box sx={{minWidth: 120}}>
            <Controller
                name="size"
                control={control}
                render={({field: {onChange, value}, fieldState: {error}}) => (
                    <FormControl error={!!error} fullWidth>
                        <InputLabel id="size"> {t("SizeClocks.label")}</InputLabel>
                        <Select
                            labelId="size"
                            value={value || ""}
                            required
                            label={t("SizeClocks.label")}
                            onChange={(e) => handelChange(onChange, e)}
                            MenuProps={MenuProps}
                            onBlur={() => trigger("size")}
                          data-testid = "selectorSize"
                        >
                            {clockList.map((clock, index) => <MenuItem
                                key={index}
                                value={clock.id ?? ""}
                                onClick={() => setChosenSize(clock)}
                            >
                                {clock.name}
                            </MenuItem>) ?? null}

                        </Select>
                        <FormHelperText>{error?.message}</FormHelperText>
                    </FormControl>)}
                rules={{
                    required: t("SizeClocks.error")
                }}
            />
        </Box>
    );
}
