import {fetchCities} from "../http/cityAPI";
import {setCitiesAction} from "../store/CityStore";

export const getCities = (page, limit) => {
    return async dispatch => {
        try {
            const res = await fetchCities(page, limit)
            if (res.status === 204) {
                dispatch(setCitiesAction([]))
                return
            }
            dispatch(setCitiesAction(res.data.rows))
        } catch (e) {
            dispatch(setCitiesAction([]))
        }
    }
}