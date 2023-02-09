const defaultState = {
    cities: [],
    isEmpty: false,
    selectedCity: [],
}
const SET_CITIES = "SET_CITIES"
const SET_SELECTED_CITY = "SET_SELECTED_CITY"
const SET_IS_EMPTY = "SET_IS_EMPTY"

export const cityReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_CITIES:
            return {...state, cities: action.payload}
        case SET_SELECTED_CITY:
            return {...state, selectedCity: action.payload}

        case SET_IS_EMPTY:
            return {...state, isEmpty: action.payload}

        default:
            return state
    }
}

export const setCitiesAction = (payload) => ({type: SET_CITIES, payload})
export const setSelectedCityAction = (payload) => ({type: SET_SELECTED_CITY, payload})
export const setEmptyCityAction = (payload) => ({type: SET_IS_EMPTY, payload})
