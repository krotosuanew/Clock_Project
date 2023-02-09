import {check, facebookAuth, googleAuth, login, updateEmail} from "../http/userAPI";
import {
    setIsAuthUserAction,
    setIsEmptyUserAction,
    setUserAction,
    setUserNameAction,
    setUserRoleAction
} from "../store/UserStore";
import {ERROR_401, ERROR_404} from "../utils/constErrors";

export const loginUser = (dataForAuthorizations, service) => {
    return async dispatch => {
        try {
            const dataUser = dataForAuthorizations.email ? await login(dataForAuthorizations) : service === "google" ? await googleAuth(dataForAuthorizations) : await facebookAuth(dataForAuthorizations)
            dispatch(setUserAction(dataUser))
            dispatch(setIsAuthUserAction(true))
            dispatch(setUserNameAction(dataUser.name))
            dispatch(setUserRoleAction(dataUser.role))
            return dataUser
        } catch (e) {
            dispatch(setIsEmptyUserAction(true))
            if (e.message === "Request failed with status code 401") {
                throw new Error(ERROR_401)
            } else if (e.message === "Request failed with status code 404") {
                throw new Error(ERROR_404)
            }
        }
    }
}

export const update = (changeEmail, email) => {
    return async dispatch => {
        try {
            const dataUser = await updateEmail(changeEmail, email)
            dispatch(setUserAction(dataUser))
            dispatch(setIsAuthUserAction(true))
            dispatch(setUserNameAction(dataUser.name))
            dispatch(setUserRoleAction(dataUser.role))
            return dataUser
        } catch (e) {
            dispatch(setIsEmptyUserAction(true))
            if (e.message === "Request failed with status code 401") {
                throw new Error(ERROR_401)
            } else if (e.message === "Request failed with status code 404") {
                throw new Error(ERROR_404)
            }
        }
    }
}
export const checkUser = () => {
    return async dispatch => {
        if (localStorage.getItem('token')) {
            try {
                const data = await check()
                dispatch(setUserAction(data))
                dispatch(setUserNameAction(data.name))
                dispatch(setIsAuthUserAction(true))
                dispatch(setUserRoleAction(data.role))
            } catch {
                localStorage.removeItem('token')
            }
        }
    }
}
