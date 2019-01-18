

import { NgRedux } from '@angular-redux/store';
import { combineReducers, Reducer } from 'redux';
import { UserState, UserReducer } from './user/user.reducer';
import { DeviceState, DeviceReducer } from './device/device.reducer';
import { EventReducer } from './event/event.reducer';

export interface AppState {
    user: UserState,
    device: DeviceState,
    event: any
}






const rootReducer: Reducer<AppState> = combineReducers<AppState>({
    user: UserReducer,
    device: DeviceReducer,
    event: EventReducer
});


export default rootReducer;