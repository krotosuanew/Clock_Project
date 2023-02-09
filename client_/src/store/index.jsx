import {applyMiddleware, combineReducers, createStore} from "redux";
import {cityReducer} from "./CityStore";
import {sizeReducer} from "./SizeStore";
import thunk from "redux-thunk";
import {orderReducer} from "./OrderStore";
import {userReducer} from "./UserStore";
import {masterReducer} from "./MasterStore";

export const rootReducer = combineReducers({
    cities: cityReducer,
    sizes: sizeReducer,
    user: userReducer,
    orders: orderReducer,
    masters: masterReducer,
})


export const store = createStore(rootReducer, applyMiddleware(thunk))