import { UsersAttribute } from "../../types/schema.types";
import { Action } from "redux";
import { SET_CURRENT_USER, SetCurrentUserAction } from "./user.action";



export interface UserState {
    currentUser: UsersAttribute
};



const initialState: UserState = {
    currentUser: null
}


export const UserReducer = function (state: UserState = initialState, action: Action): UserState {
    switch (action.type) {
        case SET_CURRENT_USER:
            const user: UsersAttribute = (<SetCurrentUserAction>action).user
            return {
                currentUser: user
            };
        default:
            return state
    }

}