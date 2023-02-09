import React, {useState} from 'react';
import {Box, Button, Modal, Rating, TextField, Typography} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import {ratingMaster} from "../../http/masterAPI";
import {CUSTOMER_ORDER_ROUTE} from "../../utils/consts";
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import "../../i18next"

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
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const getLabelText = (rating) => {
    return `${rating} Star${rating !== 1 ? 's' : ''}, ${labels[rating]}`;
}
const MasterRating = ({openRating, onClose, uuid, getOrders, alertMessage}) => {
    const {t} = useTranslation()
    const user = useSelector(state => state.user)
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("")
    const [hoverRatingLabels, setHoverRatingLabels] = useState(-1);
    const location = useLocation();
    const customer = location.pathname === `${CUSTOMER_ORDER_ROUTE}/${user.user.id}`
    const sendRating = async () => {
        const post = {
            rating: rating,
            review: review,
            uuid: uuid,
        }
        try {
            await ratingMaster(post)
            if (customer) {
                getOrders()
                alertMessage(t("MasterRating.successes"), false)
            }
            close()
        } catch (e) {
            if (customer) {
                alertMessage(t("MasterRating.fail"), true)
            }
        }
    }

    const close = () => {
        setRating(0)
        onClose()
    }
    return (
        <div>
            <Modal
                open={openRating}
                onClose={close}
            >
                <Box sx={style}>
                    <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                        {t("MasterRating.topic")}
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
                            {rating !== null && (
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
                            label={t("MasterRating.comment")}
                            helperText={`${t("MasterRating.numberCharacters")}: ${1000 - review.length}`}
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
                        <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                onClick={close}> {t("buttonClose")} </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default MasterRating;
