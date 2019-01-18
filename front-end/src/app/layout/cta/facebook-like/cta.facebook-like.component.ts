



import { Component, OnInit } from '@angular/core';
import { select } from '@angular-redux/store';
import { DeviceAttribute } from 'src/app/redux/device/device.action';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-cta-facebook-like',
    templateUrl: 'cta.facebook-like.component.html',
    styleUrls: ['cta.facebook-like.component.scss']
})

export class CTAFacebookLikeComponent implements OnInit {



    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    deviceInfo;

    targetPageUrl: string = '';



    constructor(

    ) {

        this.currentDevice$.subscribe(data => {

            if (data.isMobile) {
                this.deviceInfo = data.deviceInfo;
                // console.log(this.deviceInfo)
                if (this.deviceInfo.os == 'android') {
                    this.targetPageUrl = `fb://page/2027311537328943`
                } else {
                    this.targetPageUrl = `fb://profile/2027311537328943`
                }
            } else {
                // this.targetPageUrl = `https://www.facebook.com/shelterdogpage`
            }


        })



    }

    ngOnInit() {





    }


    openFacebookPage() {

        (<any>window).ga('send', 'event', {
            eventCategory: 'fb-page-like',
            eventLabel: 'vending-machine',
            eventAction: 'click',
            eventValue: 1
        });

        if (this.targetPageUrl) {
            window.open(this.targetPageUrl, 'blank');
        }
        window.open(`https://www.facebook.com/shelterdogpage`, '_blnak');
    }

}