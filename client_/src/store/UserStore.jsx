const defaultState = {
    users: [],
    user: {},
    isAuth: false,
    isEmpty: false,
    userRole: "",
    userName: "",
}
export const ROLE_LIST = {
    ADMIN: "ADMIN",
    CUSTOMER: "CUSTOMER",
    MASTER: "MASTER"
}

const SET_USER = "SET_USER"
const SET_USER_NAME = "SET_USER_NAME"
const SET_USER_ROLE = "SET_USER_ROLE"
const SET_IS_AUTH = "SET_IS_AUTH"
const SET_IS_EMPTY = "SET_IS_EMPTY"
const SET_PAGE = "SET_PAGE"
const REMOVE_USER = "REMOVE_USER"
const RESET = "RESET"

export const userReducer = (state = defaultState, action) => {
    switch (action.type) {

        case SET_USER:
            return {...state, user: action.payload}

        case SET_USER_NAME:
            return {...state, userName: action.payload}

        case SET_USER_ROLE:
            return {...state, userRole: action.payload}

        case SET_IS_EMPTY:
            return {...state, isEmpty: action.payload}

        case SET_IS_AUTH:
            return {...state, isAuth: action.payload}

        case SET_PAGE:
            return {...state, page: action.payload}


        case REMOVE_USER:
            return {...state, users: state.users.filter(user => user.id !== action.payload)}


        case RESET:
            return state = defaultState
        default:
            return state
    }
}

export const setUserAction = (payload) => ({type: SET_USER, payload})
export const setUserNameAction = (payload) => ({type: SET_USER_NAME, payload})
export const setUserRoleAction = (payload) => ({type: SET_USER_ROLE, payload})
export const setIsEmptyUserAction = (payload) => ({type: SET_IS_EMPTY, payload})
export const setIsAuthUserAction = (payload) => ({type: SET_IS_AUTH, payload})
export const setPageUserAction = (payload) => ({type: SET_PAGE, payload})
export const removeUserAction = (payload) => ({type: REMOVE_USER, payload})
export const resetUserAction = () => ({type: RESET})