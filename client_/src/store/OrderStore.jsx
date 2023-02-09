export const STATUS_LIST = {
    WAITING: "WAITING",
    REJECTED: "REJECTED",
    ACCEPTED: "ACCEPTED",
    DONE: "DONE",
}

const defaultState = {
    orders: [],
    isEmpty: false,
}
const SET_ORDERS = "SET_ORDERS"
const SET_IS_EMPTY = "SET_IS_EMPTY"
const CHANGE_STATUS = "CHANGE_STATUS"

export const orderReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_ORDERS:
            return {...state, orders: action.payload}

        case SET_IS_EMPTY:
            return {...state, isEmpty: action.payload}
        
        default:
            return state
    }
}

export const setIsEmptyOrderAction = (payload) => ({type: SET_IS_EMPTY, payload})
export const changeStatusOrderAction = (payload) => ({type: CHANGE_STATUS, payload})
