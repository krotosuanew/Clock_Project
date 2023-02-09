const defaultState = {
    sizes: [],
    isEmpty: false,
    selectedSize: {date: "00:00:00"},

}
const SET_SIZES = "SET_SIZES"
const SET_SELECTED_SIZE = "SET_SELECTED_SIZE"
const SET_IS_EMPTY = "SET_IS_EMPTY"


export const sizeReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_SIZES:
            return {...state, sizes: action.payload}
        case SET_SELECTED_SIZE: {
            return {...state, selectedSize: action.payload}
        }
        case SET_IS_EMPTY: {
            return {...state, isEmpty: action.payload}
        }

        default:
            return state
    }
}
export const setSizesAction = (payload) => ({type: SET_SIZES, payload})
export const setIsEmptySizeAction = (payload) => ({type: SET_IS_EMPTY, payload})
export const setSelectedSizeAction = (payload) => ({type: SET_SELECTED_SIZE, payload})

