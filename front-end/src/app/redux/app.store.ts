import { InjectionToken } from '@angular/core';
import {
    createStore,
    Store,
    compose,
    StoreEnhancer,
    applyMiddleware,
} from 'redux';


import {
    AppState,
    default as reducer
} from './root.reducer';
// import { reduxLogger } from 'redux-logger';


export const AppStore = new InjectionToken('App.store');


const devtools: StoreEnhancer<AppState> =
    window['devToolsExtension'] ? window['devToolsExtension']() : f => f;


export function createAppStore(): Store<AppState> {
    return createStore(
        reducer,
        compose(devtools),
        // applyMiddleware(reduxLogger)
    );
}

// export const appStoreProviders = [
//     { provide: AppStore, useFactory: createAppStore }
// ];
