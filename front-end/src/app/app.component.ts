import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { AppState } from './redux/root.reducer';
import { setCurrentDevice } from './redux/device/device.action';
import { DeviceDetectorService } from 'ngx-device-detector';



declare let Kakao
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {



  title = 'shelter';

  deviceInfo
  isMobile
  browser

  constructor(
    private router: Router,
    private ngRedux: NgRedux<AppState>,
    private deviceService: DeviceDetectorService,

    // private new

  ) {

    this.epicFunction();
    this.ngRedux.dispatch(setCurrentDevice({
      deviceInfo :this.deviceInfo,
      isMobile: this.isMobile,
      browser: this.browser
    }))









    Kakao.init('c4be4183aaf4371beec890d788cfff1e');
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {
        document.body.style.cursor = 'default';
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
        // this.scrollTop();
        // if (!event.url.includes('/refuge-article')) {
        // }
        window.scrollTo(0, 0);

        


      } else if (event instanceof NavigationStart) {
        document.body.style.cursor = 'wating'

      }
    });

  }





  scrollTop() {
    const scrollHeight = window.scrollY,
      scrollStep = Math.PI / (200 / 15),
      cosParameter = scrollHeight / 2;
    var scrollCount = 0,
      scrollMargin,
      scrollInterval = setInterval(function () {
        if (window.scrollY != 0) {
          scrollCount = scrollCount + 1;
          scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
          window.scrollTo(0, (scrollHeight - scrollMargin));
        }
        else clearInterval(scrollInterval);
      }, 15);
  }

  epicFunction() {
    // console.log('hello `Home` component');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.browser = this.deviceService.browser;
    // const isTablet = this.deviceService.isTablet();
    // const isDesktopDevice = this.deviceService.isDesktop();
    // console.log(this.deviceInfo);
    // console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    // console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
  }

}
