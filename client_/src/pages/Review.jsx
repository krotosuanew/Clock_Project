import * as React from 'react';
import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import {checkLink, ratingMaster} from "../http/masterAPI";
import {Button, CircularProgress, Rating, TextField, Typography} from "@mui/material";
import {START_ROUTE} from "../utils/consts";
import StarIcon from "@mui/icons-material/Star";
import {useTranslation} from "react-i18next";
import "../i18next"

const labels = {
    0.5: "😡",
    1: '😖',
    1.5: '😠',
    2: '😞',
    2.5: '😒',
    3: '😑',
    3.5: '😌',
    4: '😋',
    4.5: '😇',
    5: '🙀',
};
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 10,
    p: 4,
};

const getLabelText = (value) => {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}
const Review = () => {
    const {t} = useTranslation()
    const {uuid} = useParams()
    const navigate = useNavigate()
    const [open, setOpen] = useState(null)
    const [wrongLink, setWrongLink] = useState(false)
    const [rating, setRating] = useState(0);
    const [hoverRatingLabels, setHoverRatingLabels] = useState(null);
    const [loading, setLoading] = useState(true)
    const [review, setReview] = useState("")
    const sendRating = async () => {
        const post = {
            rating: rating,
            review: review,
            uuid: uuid,
        }
        try {
            await ratingMaster(post)
            setOpen(false)
        } catch (e) {

        }
    }
    useEffect(async () => {
        try {
            await checkLink(uuid)
            setWrongLink(false)
            setOpen(true)
        } catch (e) {
            setWrongLink(true)
            setOpen(false)
        } finally {
            setLoading(false)
        }
    }, [])
    if (loading) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: window.innerHeight - 60,
            }}>
                <CircularProgress/>
            </Box>
        )
    }
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: window.innerHeight - 60,
        }}>
            {open && <Box sx={style}>
                <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                    {t("Review.topic")}
                </Typography>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Box
                        sx={{
                            width: 200,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Rating
                            name="hover-feedback"
                            size="large"
                            value={rating}
                            precision={0.5}
                            getLabelText={getLabelText}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                            onChangeActive={(event, newHover) => {
                                setHoverRatingLabels(newHover);
                            }}
                            emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"/>}
                        />
                        {!rating || (
                            <Box sx={{
                                ml: 2,
                                fontSize: 25
                            }}>{labels[hoverRatingLabels !== -1 ? hoverRatingLabels : rating]}</Box>
                        )}
                    </Box>
                    <TextField
                        fullWidth
                        error={1000 < review.length}
                        rows={4}
                        id="review"
                        label={t("Review.comment")}
                        helperText={`${t("Review.numberCharacters")}: ${1000 - review.length}`}
                        multiline
                        value={review}
                        onChange={(e) => 1000 > review.length
                        || e.nativeEvent.inputType === "deleteContentBackward" ? setReview(e.target.value) : null}
                    />
                </Box>
                <Box
                    sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                >
                    <Button color="success" disabled={1000 < review.length} sx={{flexGrow: 1}} variant="outlined"
                            onClick={sendRating}
                    > {t("buttonSend")}</Button>
                </Box>
            </Box>}

            {!open && wrongLink ? <Box sx={{
                mt: 5,
                display: 'flex',
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Typography variant="h6" gutterBottom component="div">
                    {t("Review.link")}
                </Typography>
                <Link to={START_ROUTE}
                      style={{textDecoration: 'none', color: 'black'}}>
                    <Button size="large"
                            color="warning"
                            variant="contained"
                            onClick={() => navigate(START_ROUTE)}>
                        {t("Review.toStart")}
                    </Button>
                </Link>
            </Box> : !open && <Box sx={{
                mt: 5,
                display: 'flex',
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Typography variant="h6" gutterBottom component="div">
                    {t("Review.successesSend")}
                </Typography>
                <Link to={START_ROUTE}
                      style={{textDecoration: 'none', color: 'black'}}>
                    <Button size="large"
                            color="warning"
                            variant="contained"
                            onClick={() => navigate(START_ROUTE)}>
                        {t("Review.toStart")}
                    </Button>
                </Link>
            </Box>}

        </Box>
    )
};

export default Review