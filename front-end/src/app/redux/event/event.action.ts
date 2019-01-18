import { Action, ActionCreator } from "redux";

export const SHOW_LOGIN_MODAL = '[Event] Show Login Modal';
export const SHOW_SIGNUP_MODAL = '[Event] Show SignUp Modal';
export const WIDE_DISPLAY = '[Event] WideDisplay';
export const FULL_SCREEN = '[Event] FullScreen';
export const RESET_PASSWORD = '[Event] Reset Password';
export const SELECT_GNB_TAB = '[Event] Select GNB Tab';



export interface ShowLoginModal extends Action {
    event: boolean
}
export interface ShowSignupModal extends Action {
    event: boolean
}
export interface WideDisplay extends Action {
    event: boolean
}
export interface FullScreen extends Action {
    event: boolean
}
export interface ResetPassword extends Action {
    event: boolean
}

export interface SelectGNBTab extends Action {
    // event: boolean,
    data: string
}

export const showLoginModal: ActionCreator<ShowLoginModal> = ((event: any) => {
    return {
        type: SHOW_LOGIN_MODAL,
        event
    }
})
export const showSignUpModal: ActionCreator<ShowSignupModal> = ((event: any) => {
    return {
        type: SHOW_SIGNUP_MODAL,
        event
    }
})
export const wideDisplay: ActionCreator<WideDisplay> = ((event: any) => {
    return {
        type: WIDE_DISPLAY,
        event
    }
})
export const fullScreen: ActionCreator<FullScreen> = ((event: any) => {
    return {
        type: FULL_SCREEN,
        event
    }
})
export const showResetPasswordModal: ActionCreator<ResetPassword> = ((event: any) => {
    return {
        type: RESET_PASSWORD,
        event
    }
})

export const selectGNBTab: ActionCreator<SelectGNBTab> = ((data: string) => {
    return {
        type: SELECT_GNB_TAB,
        data
    }
})