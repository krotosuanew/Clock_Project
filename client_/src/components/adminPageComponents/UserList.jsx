import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Select,
    Tooltip,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TablsPagination from "../TablsPagination";
import {activateUser, deleteUser, fetchUsers} from "../../http/userAPI";
import EditUser from "./modals/EditUser";
import CreateUser from "./modals/CreateUser";
import {ROLE_LIST} from "../../store/UserStore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {useTranslation} from "react-i18next";
import "../../i18next"

const UserList = ({alertMessage}) => {
    const [editVisible, setEditVisible] = useState(false)
    const [createVisible, setCreateVisible] = useState(false)
    const [userToEdit, setUserToEdit] = useState(null);
    const [usersList, setUsersList] = useState(null)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(null)
    const [limit, setLimit] = useState(10)
    const [ascending, setAscending] = useState(true)
    const [sorting, setSorting] = useState("id")
    const [loading, setLoading] = useState(true)
    const {t} = useTranslation()
    const getUsers = async (page, limit, sorting, ascending) => {
        try {
            const res = await fetchUsers(page, limit, sorting, ascending)
            if (res.status === 204) {
                setUsersList([])
                setTotalCount(0)
            }
            setUsersList(res.data.rows)
            setTotalCount(res.data.count)
        } catch (e) {
            setUsersList([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(async () => {
        await getUsers(page, limit, sorting, ascending)
    }, [page, limit, sorting, ascending])

    const changeActiveted = async (user) => {
        const changeInfo = {
            id: user.id,
            isActivated: !user.isActivated
        }
        try {
            await activateUser(changeInfo)
            user.isActivated = !user.isActivated
            alertMessage(t("UserList.alertStatus.successes"), false)
        } catch (e) {
            alertMessage(t("UserList.alertStatus.fail"), true)
        }
    }

    const removeUser = async (id) => {
        try {
            await deleteUser(id)
            await getUsers(page, limit, sorting, ascending)
            alertMessage(t("UserList.alertRemove.successes"), false)
        } catch (e) {
            alertMessage(t("UserList.alertRemove.fail"), true)
        }
    }
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
    const sortingList = (param) => {
        if (sorting === param) {
            setAscending(!ascending)
            return
        }
        setAscending(true)
        setSorting(param)
    }
    return (<Box>
        <Box sx={{flexGrow: 1, maxWidth: "1fr", minHeight: document.documentElement.clientHeight - 130}}>
            <List subheader={<Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                    {t("UserList.listName")}
                </Typography>
            </Box>}>
                <ListItem
                    sx={{height: 60, mb: 1}}
                    secondaryAction={<Tooltip title={t("UserList.addUser")}
                                              placement="top"
                                              arrow>
                        <IconButton sx={{width: 20}}
                                    edge="end"
                                    aria-label="addUser"
                                    onClick={() => setCreateVisible(true)}
                        >
                            <AddIcon/>
                        </IconButton>
                    </Tooltip>}>
                    <ListItemButton
                        selected={sorting === "id"}
                        sx={{maxWidth: 150, position: "absolute", left: 0}}
                        onClick={() => sortingList("id")}>
                        {t("UserList.userId")}
                        {ascending ? sorting === "id" && <ExpandMoreIcon/> : sorting === "id" && <ExpandLessIcon/>}
                    </ListItemButton>
                    <ListItemButton
                        selected={sorting === "email"}
                        sx={{maxWidth: 100, position: "absolute", left: 270}}
                        onClick={() => sortingList("email")}>
                        Email
                        {ascending ? sorting === "email" && <ExpandMoreIcon/> : sorting === "email" &&
                            <ExpandLessIcon/>}
                    </ListItemButton>
                    <ListItemButton
                        selected={sorting === "role"}
                        sx={{maxWidth: 100, position: "absolute", right: 430}}
                        onClick={() => sortingList("role")}>
                        {t("UserList.role")}
                        {ascending ? sorting === "role" && <ExpandMoreIcon/> : sorting === "role" && <ExpandLessIcon/>}
                    </ListItemButton>
                    <ListItemButton
                        selected={sorting === "isActivated"}
                        sx={{maxWidth: 100, position: "absolute", right: 200}}
                        onClick={() => sortingList("isActivated")}>
                        {t("UserList.status")}
                        {ascending ? sorting === "isActivated" && <ExpandMoreIcon/> : sorting === "isActivated" &&
                            <ExpandLessIcon/>}
                    </ListItemButton>
                </ListItem>
                <Divider orientation="horizontal"/>

                {usersList.length === 0 ? <h1>{t("emptyList")}</h1> : usersList.map((user, index) => {
                    return (<ListItem
                            key={user.id}
                            divider
                            secondaryAction={user.role !== ROLE_LIST.ADMIN ? <Tooltip title={t("UserList.removeUser")}
                                                                                      placement="right"
                                                                                      arrow>
                                <IconButton sx={{width: 10}}
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => removeUser(user.id)}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip> : <Box sx={{width: 10}}
                            >
                            </Box>}
                        >
                            <ListItemText sx={{width: 10, height: 20, whiteSpace: 'wrap'}}
                                          primary=
                                              {user.id}
                            />
                            <ListItemText sx={{width: "40px", pr: 10}}
                                          primary={user.email}
                            />
                            <ListItemText sx={{width: 10}}
                                          primary={user.role}
                            />
                            <ListItemText sx={{width: 10}}
                                          primary={<Button color={user.isActivated ? "success" : "error"}
                                                           size="small"
                                                           variant="outlined"
                                                           onClick={() => changeActiveted(user)}
                                          >
                                              {user.isActivated ? t("UserList.statusList.active") : t("UserList.statusList.notActive")}
                                          </Button>}
                            />
                            {user.role !== ROLE_LIST.ADMIN ? <Tooltip title={t("UserList.editUser")}
                                                                      placement="left"
                                                                      arrow>
                                <IconButton sx={{width: 5}}
                                            edge="end"
                                            aria-label="Edit"
                                            onClick={() => {
                                                setEditVisible(true)
                                                setUserToEdit(user)
                                            }}
                                >
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip> : null}

                        </ListItem>
                    )
                })}

            </List>
            {editVisible ?
                <EditUser
                    open={editVisible}
                    userToEdit={userToEdit}
                    onClose={() => {
                        setEditVisible(false)
                    }}
                    getUsers={() => getUsers(page, limit, sorting, ascending)}
                    alertMessage={alertMessage}
                /> : null}
            {createVisible ?
                <CreateUser
                    getUsers={() => getUsers(page, limit, sorting, ascending)}
                    open={createVisible}
                    onClose={() => setCreateVisible(false)}
                    alertMessage={alertMessage}/> : null}

        </Box>
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <TablsPagination page={page} totalCount={totalCount} limit={limit} pagesFunction={(page) => setPage(page)}/>
            <FormControl variant="standard" sx={{m: 1, width: 60, position: "absolute", left: 1300}} size="small">
                <InputLabel id="limit">{t("limit")}</InputLabel>
                <Select
                    labelId="limit"
                    id="limit"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    label={t("limit")}
                >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                </Select>
            </FormControl>
        </Box>
    </Box>);
}
export default UserList;
