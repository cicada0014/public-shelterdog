import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { ErrorPageModule } from './error-page/error-page.module';
import { NotFoundPageComponent } from './error-page/404-page/404-page.component';
import { IndexPageComponent } from './pages/index.page.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from './app.interceptor';
// import { CommonDataService } from './common-data.service'
import { AdsenseModule } from 'ng2-adsense';
import { MarkdownModule } from 'ngx-markdown';
import { TokenVerifyPageComponent } from './error-page/token-verify/token-verify.component';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { NgReduxModule, NgRedux } from '@angular-redux/store';
import rootReducer, { AppState } from './redux/root.reducer';
import { createAppStore } from './redux/app.store';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NoAuthorizationPageComponent } from './error-page/401-page/401-page.component';
// import { createLogger } from 'redux-logger';




const routes: Routes = [
  {
    path: '',
    component: IndexPageComponent
  },
  {
    path: 'token-verify',
    component: TokenVerifyPageComponent
  },
  {
    path: 'no-authorization',
    component: NoAuthorizationPageComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
]





@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PagesModule,
    MarkdownModule.forRoot(),
    RouterModule.forRoot(routes),
    AdsenseModule.forRoot({
      adClient: 'ca-pub-2127030706496959',
      // adSlot: 7259870550,
    }),
    DeviceDetectorModule.forRoot(),
    ErrorPageModule,
    NgReduxModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
    // CommonDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<AppState>) {
    ngRedux.provideStore(createAppStore());
  }

}
