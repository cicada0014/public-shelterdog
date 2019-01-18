


import { Component, OnInit, HostListener } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { DeviceAttribute } from 'src/app/redux/device/device.action';

@Component({
    selector: 'app-right-side',
    templateUrl: 'right-side.component.html'
})




export class RightSideComponent implements OnInit {

    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    currTop: number = 0;
    isMobile: boolean = true;

    @HostListener('window:scroll', ['$event'])
    onWindowScroll($event) {
        if (!this.isMobile) {
            // console.log(document.querySelector('.footer-wrapper'), document.querySelector('.footer-wrapper').offsetTop)
            this.currTop = window.scrollY + window.innerHeight > (document.querySelector('.footer-wrapper') as any).offsetTop ? (document.querySelector('.footer-wrapper') as any).offsetTop - window.innerHeight : window.scrollY;
            // console.log(window.scrollY, window.innerHeight, (document.querySelector('.footer-wrapper') as any).offsetTop)
            // console.log(this.currTop);
            (document.querySelector('#right-side-wrapper') as any).style.top = `${this.currTop}px`;
        }
    }


    constructor() {
        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })


    }




    ngAfterViewInit() {
        setTimeout(() => {
            try {
                if (!this.isMobile) {
                    (window["adsbygoogle"] = window["adsbygoogle"] || []).push({});
                }
            } catch (e) {
                // console.error(e);
            }
        }, 2000);
    }


    ngOnInit() {
    }
}