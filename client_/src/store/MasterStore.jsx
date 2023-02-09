const defaultState = {
    masters: [],
    isEmpty: false,
}
const SET_MASTERS = "SET_MASTERS"
const SET_IS_EMPTY = "SET_IS_EMPTY"

export const masterReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_MASTERS:
            return {...state, masters: action.payload}

        case SET_IS_EMPTY:
            return {...state, isEmpty: action.payload}

        default:
            return state

    }
}

export const setMasterAction = (payload) => ({type: SET_MASTERS, payload})
export const setIsEmptyMasterAction = (payload) => ({type: SET_IS_EMPTY, payload})