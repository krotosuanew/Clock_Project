import React from 'react';
import {Box, Divider, Grow, Modal} from "@mui/material";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
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
const PhotoList = ({open, onClose, photosLinks}) => {
    const close = () => {
        onClose()
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={close}
            >
                <Box sx={style}>

                    <Box>
                        <h3>Фото:</h3>
                        <Divider/>
                        {photosLinks.length === 0 ? <Box>
                                Список пуст
                            </Box> :
                            photosLinks.map((photo, index) => {
                                return (
                                    <Grow in={!!photo} key={index}>
                                        <Box key={index} sx={{mt: 2}}>
                                            <img src={photo} width="450"/>
                                        </Box>
                                    </Grow>
                                )
                            })
                        }
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default PhotoList;
