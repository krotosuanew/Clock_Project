import React from 'react';
import {Box, Typography} from '@mui/material';
import {useTranslation} from "react-i18next";
import "../../i18next"


const AboutCompany = () => {
    const {t} = useTranslation()
    return (<Box sx={{my: 3}}>
            <Typography variant="h4" color="text.secondary">
                {t("startPage.aboutCompany")}
            </Typography>
        </Box>


    );
};

export default AboutCompany;
