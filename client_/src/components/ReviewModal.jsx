import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Divider, Modal, Rating, Typography} from "@mui/material";
import {fetchReviews} from "../http/masterAPI";
import {useTranslation} from "react-i18next";
import "../i18next"

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
    whiteSpace: "pre-line",
    maxHeight: 800,
    overflowY: "auto",
    overflowX: "hidden",
    wordBreak: "break-word"
};
const ReviewModal = ({open, onClose, masterId}) => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const {t} = useTranslation()
    const close = () => {
        onClose()
    }
    useEffect(async () => {
        try {
            const res = await fetchReviews(masterId)
            if (res.data.count === 0) {
                setLoading(false)
                return
            }
            setLoading(false)
            setReviews(res.data.rows)
        } catch (e) {
            setLoading(false)
        }
    }, [])
    return (
        <div>
            <Modal
                open={open}
                onClose={close}
                data-testid={'modalReviews'}
            >
                <Box sx={style}>
                    {loading ? <Box sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <CircularProgress/>
                        </Box> :
                        <Box>
                            <h3>{t("reviews")}:</h3>
                            <Divider/>
                            {reviews.length === 0 ? <Box>
                                    {t("emptyList")}
                                </Box> :
                                reviews.map(review => {
                                    return (
                                        <Box key={review.id} sx={{mb: 1}}>
                                            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                                <Typography variant="h5" gutterBottom component="div">
                                                    {review.user.customer !== null ? review.user.customer.name : "Клиент"}
                                                </Typography>
                                                <Box>{
                                                    <Rating name="read-only" value={review.rating}
                                                            precision={0.5} readOnly/>}
                                                </Box>
                                            </Box>
                                            {review.review ?
                                                <Box>
                                                    {review.review}
                                                </Box>
                                                : null}
                                            <Divider sx={{mt: 1}}/>
                                        </Box>
                                    )
                                })
                            }
                        </Box>
                    }</Box>
            </Modal>
        </div>
    );
};

export default ReviewModal;
