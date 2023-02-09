import React, {useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import {Box, CircularProgress, Container} from "@mui/material";
import {useDispatch} from "react-redux";
import {checkUser} from "./asyncActions/users";

const HEIGHT_NAV_BAR = 10

const App = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    useEffect(async () => {
        try {
            await dispatch(checkUser())
        } catch (e) {
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
        <BrowserRouter>
            <NavBar/>
            <Box sx={{bgcolor: '#eceaea'}}>
                <Container sx={{
                    bgcolor: '#fff', mt: 6,
                    minHeight: document.documentElement.clientHeight - HEIGHT_NAV_BAR,
                }}>
                    <AppRouter/>
                </Container>
                <Box sx={{width: "100%", bgcolor: '#eceaea'}}>
                </Box>
            </Box>

        </BrowserRouter>
    );
}

export default App;
