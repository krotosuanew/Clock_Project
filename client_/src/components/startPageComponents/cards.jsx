import React from 'react';
import {Box, Card, CardContent, CardMedia, Typography} from '@mui/material';
import smallClock from "../../assets/img/small.jpg";
import normalClock from "../../assets/img/normal.jpg";
import largeClock from "../../assets/img/large.jpg";
import {useTranslation} from "react-i18next";
import "../../i18next"

const Cards = () => {
    const {t} = useTranslation()
    return (<Box sx={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', ml: 3}}>
        <Card sx={{maxWidth: 360}}>
            <CardMedia
                component="img"
                height="280"
                image={smallClock}
                alt="clock"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" align='center'>
                    {t("startPage.firstCard.title")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t("startPage.firstCard.description")}
                    <li>{t("startPage.firstCard.l1")}</li>
                    <li>{t("startPage.firstCard.l2")}</li>
                    <li>{t("startPage.firstCard.l3")}</li>
                    <li>{t("startPage.firstCard.l4")}</li>
                </Typography>
            </CardContent>
        </Card>

        <Card sx={{maxWidth: 360}}>
            <CardMedia
                component="img"
                height="280"
                image={normalClock}
                alt="clock"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" align='center'>
                    {t("startPage.secondCard.title")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t("startPage.secondCard.description")}
                    <li>{t("startPage.secondCard.l1")}</li>
                    <li>{t("startPage.secondCard.l2")}</li>
                    <li>{t("startPage.secondCard.l3")}</li>
                    <li>{t("startPage.secondCard.l4")}</li>
                </Typography>
            </CardContent>
        </Card>

        <Card sx={{maxWidth: 360}}>
            <CardMedia
                component="img"
                height="280"
                image={largeClock}
                alt="clock"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" align='center'>
                    {t("startPage.nextCard.title")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t("startPage.nextCard.description")}
                    <li>{t("startPage.nextCard.l1")}</li>
                    <li>{t("startPage.nextCard.l2")}</li>
                    <li>{t("startPage.nextCard.l3")}</li>
                    <li>{t("startPage.nextCard.l4")}</li>
                </Typography>
            </CardContent>

        </Card>
    </Box>);
};

export default Cards;
