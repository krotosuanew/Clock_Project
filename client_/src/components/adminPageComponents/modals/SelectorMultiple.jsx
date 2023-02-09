import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {Autocomplete, CircularProgress, TextField} from '@mui/material';
import {useFormContext} from "react-hook-form";
import debounce from "lodash/debounce";
import {useTranslation} from "react-i18next";
import "../../../i18next"

export default function SelectorMultiple({name, fetch, label, id, OptionLabel}) {
    const {t} = useTranslation()
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([])
    const [inputValue, setInputValue] = React.useState("");
    const [changeValue, setChangeValue] = useState('');
    const {setValue, getValues, trigger} = useFormContext();
    const [loading, setLoading] = useState(false)
    const debouncedSave = useCallback(
        debounce(nextValue => setChangeValue(nextValue), 1000),
        [],
    );
    useEffect(async () => {
        setLoading(true)
        try {
            const res = id === "masters" ? await fetch(null, 1, 10, null, null, null, changeValue) :
                await fetch(1, 10, id === "email" ? id : null, null, changeValue)
            if (res.status === 204) {
                setOptions([])
                return
            }
            !!OptionLabel ? setOptions(res.data) : setOptions(res.data.rows)
        } catch (e) {
            setOptions([])
        } finally {
            setLoading(false)
        }
    }, [changeValue]);
    return (
        <div>
            <Autocomplete
                size={"small"}
                multiple
                limitTags={2}
                id={id}
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                value={getValues(name)}
                options={options}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={OptionLabel ? OptionLabel : (option) => option.name}
                onChange={(event, newValue, reason) => {
                    setValue(name, newValue)
                    trigger(name)
                }}
                clearOnBlur={false}
                clearText={t("Filter.remove")}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                    debouncedSave(newInputValue)
                }}
                renderInput={(params) => (
                    <TextField
                        fullWidth
                        {...params} label={label}
                        placeholder={label}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={10} sx={{mr: 6}}/> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
                sx={{width: 300, mt: 1}}
            />
        </div>
    );
}