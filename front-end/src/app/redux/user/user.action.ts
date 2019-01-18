import { Action, ActionCreator } from "redux";
import { UsersAttribute } from "../../types/schema.types";

export const SET_CURRENT_USER = '[User] Set Current';

export interface SetCurrentUserAction extends Action {
    user: UsersAttribute
}


export const setCurrentUser: ActionCreator<SetCurrentUserAction> = ((user: UsersAttribute) => {
    return {
        type: SET_CURRENT_USER,
        user: user
    }
})