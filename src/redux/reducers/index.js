import { combineReducers } from "redux"
import { user } from "./user"
import { order } from "./order"


const Reducers = combineReducers({
    userState: user,
    orderState: order,
})

export default Reducers
