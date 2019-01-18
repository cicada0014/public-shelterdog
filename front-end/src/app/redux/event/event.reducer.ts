import { Action } from "redux";
import { ShowLoginModal, WideDisplay, SHOW_LOGIN_MODAL, SHOW_SIGNUP_MODAL, ShowSignupModal, WIDE_DISPLAY, FULL_SCREEN, FullScreen, ResetPassword, RESET_PASSWORD, SelectGNBTab, SELECT_GNB_TAB } from "./event.action";



export interface EventState {
    loginModal: boolean;
    signupModal: boolean;
    wideDisplay: boolean;
    resetPasswordModal: boolean
    fullScreen: boolean;
    selectGNBTabData: string;
};




const initialState: EventState = {
    loginModal: null,
    signupModal: null,
    resetPasswordModal: null,
    wideDisplay: null,
    fullScreen: null,
    selectGNBTabData: null
}


export const EventReducer = function (state: EventState = initialState, action: Action): EventState {
    switch (action.type) {
        case SHOW_LOGIN_MODAL:
            return {
                loginModal: (<ShowLoginModal>action).event,
                signupModal: state.signupModal,
                wideDisplay: state.wideDisplay,
                resetPasswordModal: state.resetPasswordModal,
                fullScreen: state.fullScreen,
                selectGNBTabData: state.selectGNBTabData
            };
        case SHOW_SIGNUP_MODAL:
            return {
                loginModal: state.loginModal,
                signupModal: (<ShowSignupModal>action).event,
                wideDisplay: state.wideDisplay,
                resetPasswordModal: state.resetPasswordModal,
                fullScreen: state.fullScreen,
                selectGNBTabData: state.selectGNBTabData
            };
        case WIDE_DISPLAY:
            return {
                loginModal: state.loginModal,
                signupModal: state.signupModal,
                resetPasswordModal: state.resetPasswordModal,
                wideDisplay: (<WideDisplay>action).event,
                fullScreen: state.fullScreen,
                selectGNBTabData: state.selectGNBTabData
            };
        case FULL_SCREEN:
            return {
                loginModal: state.loginModal,
                signupModal: state.signupModal,
                wideDisplay: state.wideDisplay,
                resetPasswordModal: state.resetPasswordModal,
                fullScreen: (<FullScreen>action).event,
                selectGNBTabData: state.selectGNBTabData
            };
        case RESET_PASSWORD:
            return {
                loginModal: state.loginModal,
                signupModal: state.signupModal,
                wideDisplay: state.wideDisplay,
                resetPasswordModal: (<ResetPassword>action).event,
                fullScreen: state.fullScreen,
                selectGNBTabData: state.selectGNBTabData
            };
        case SELECT_GNB_TAB:
            return {
                loginModal: state.loginModal,
                signupModal: state.signupModal,
                wideDisplay: state.wideDisplay,
                resetPasswordModal: state.resetPasswordModal,
                fullScreen: state.fullScreen,
                selectGNBTabData: (<SelectGNBTab>action).data,
            };
        default:
            return state
    }
}