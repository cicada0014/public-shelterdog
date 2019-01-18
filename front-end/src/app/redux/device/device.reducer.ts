import { Action } from "redux";
import { DeviceAttribute, SET_CURRENT_DEVICE, SetCurrentDeviceAction } from "./device.action";



export interface DeviceState {
    currentDevice: DeviceAttribute
};



const initialState: DeviceState = {
    currentDevice: null
}


export const DeviceReducer = function (state: DeviceState = initialState, action: Action): DeviceState {
    switch (action.type) {
        case SET_CURRENT_DEVICE:
            const device: DeviceAttribute = (<SetCurrentDeviceAction>action).device
            return {
                currentDevice: device
            };
        default:
            return state
    }

}