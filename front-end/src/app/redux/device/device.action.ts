import { Action, ActionCreator } from "redux";

export const SET_CURRENT_DEVICE = '[Device] Set Current';

export interface SetCurrentDeviceAction extends Action {
    device: DeviceAttribute
}

export interface DeviceAttribute {
    isMobile: boolean,
    browser: string,
    deviceInfo

}


export const setCurrentDevice: ActionCreator<SetCurrentDeviceAction> = ((device: DeviceAttribute) => {
    return {
        type: SET_CURRENT_DEVICE,
        device
    }
})