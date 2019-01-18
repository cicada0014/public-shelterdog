


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Observable } from 'rxjs';
import { DeviceAttribute } from 'src/app/redux/device/device.action';
import { select } from '@angular-redux/store';

@Component({
    selector: 'app-left-side',
    templateUrl: 'left-side.component.html'
})

export class LeftSideComponent implements OnInit {

    isShowRecommendation: boolean = false;
    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    recommendations;
    selectedRecommendation;

    isMobile: boolean = true;

    constructor(private router: Router) {

        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })

        this.recommendations = [
            { label: '명예의 전당', value: { id: 1, name: 'New York', code: 'NY' } },
            { label: '인기 게시물', value: { id: 2, name: 'Rome', code: 'RM' } },
        ];
    }
    goToRecommendation($event) {
        console.log($event)
    }



    ngOnInit() {

        this.isShowRecommendation = this.router.url.includes('refuge-detail');

        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                // Show loading indicator
            }

            if (event instanceof NavigationEnd) {
                // Hide loading indicator
                this.isShowRecommendation = event.url.includes('refuge-detail');
            }

            if (event instanceof NavigationError) {
                // Hide loading indicator
                // Present error to user
                console.log(event.error);
            }
        })
    }
    ngAfterViewInit() {
        setTimeout(() => {
            try {
                if(!this.isMobile){
                    (window["adsbygoogle"] = window["adsbygoogle"] || []).push({});
                }
            } catch (e) {
                // console.error(e);
            }
        }, 2000);
    }
}