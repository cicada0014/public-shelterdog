

import { Component, OnInit, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'src/app/redux/root.reducer';
import { selectGNBTab } from 'src/app/redux/event/event.action';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-mobile-gnb-tabs',
    templateUrl: 'mobile-gnb-tabs.component.html',
    styleUrls: ['mobile-gnb-tabs.component.scss']
})

export class MobileGNBTabsComponent implements OnInit {

    targetGuideNumber: number = 0;


    currActive;

    guideXPos: number = 0;
    guideWidth: number = 0;
    guideDisplay: boolean = false;
    @select(['event', 'selectGNBTabData']) selectGNBTabData$: Observable<string>;
    connectBarXPos: number = 0;
    connectBarWidth: number = 0;
    connectBarDisplay: boolean = false;
    mobileGNBTabs: { label: string, active: boolean, new?: boolean, down?:boolean, activateCallback: Function }[];
    navLinks;
    constructor(
        private router: Router,
        private ngRedux: NgRedux<AppState>
    ) {


        this.selectGNBTabData$.subscribe(data => this.currActive = data)


        this.navLinks = [
            'about',
            'game',
        ]
        this.mobileGNBTabs = [
            {
                label: '도피처', down: true, active: false, activateCallback: () => {
                    if (this.currActive != 'refuge') {
                        this.ngRedux.dispatch(selectGNBTab('refuge'));
                        // this.displayGuide(0)
                        this.connectBarDisplay = true;
                        let tavNav = document.querySelector(`#${this.mobileGNBTabs[0].label}-nav`);
                        let { top, right, bottom, left } = tavNav.getBoundingClientRect()
                        this.connectBarXPos = left;
                    } else {
                        this.connectBarDisplay = false
                        this.ngRedux.dispatch(selectGNBTab('none'));
                    }
                }
            },
            {
                label: '해우소', new: false,
                active: false, activateCallback: () => {
                    this.router.navigateByUrl('haewooso');
                    this.ngRedux.dispatch(selectGNBTab('none'));
                    this.connectBarDisplay = false;


                }
            },
            {
                label: '오락실', new: false, active: false, activateCallback: () => {
                    this.router.navigateByUrl('game/index')
                    this.ngRedux.dispatch(selectGNBTab('none'));
                    this.connectBarDisplay = false;
                }
            },
            {
                label: '라디오', active: false, activateCallback: () => {
                    this.router.navigateByUrl('podcast/list')
                    this.ngRedux.dispatch(selectGNBTab('none'));
                    this.connectBarDisplay = false;
                }
            },
            // {
            //     label: 'About',
            //     active: false, activateCallback: () => {

            //         if (this.currActive != 'about') {
            //             this.ngRedux.dispatch(selectGNBTab('about'));
            //             this.connectBarDisplay = true;
            //             let tavNav = document.querySelector(`#${this.mobileGNBTabs[4].label}-nav`);
            //             let { top, right, bottom, left } = tavNav.getBoundingClientRect()
            //             this.connectBarXPos = left;
            //         } else {
            //             this.ngRedux.dispatch(selectGNBTab('none'));
            //             this.connectBarDisplay = false;
            //         }
            //         // this.displayGuide(4)
            //         // this.router.navigateByUrl('game/index')
            //     }
            // },
            {
                label: '자판기',
                new: true,
                active: false, activateCallback: () => {
                    this.router.navigateByUrl('vending_machine')
                    this.ngRedux.dispatch(selectGNBTab('none'));
                    this.connectBarDisplay = false;
                }
            }
        ];


    }

    activateTab(tab) {
        tab.activateCallback()
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        let tabItem = document.querySelector(`.gnb-tab-item`);
        setTimeout(() => {
            this.guideWidth = tabItem.clientWidth;
            this.connectBarWidth = tabItem.clientWidth;
            let tavNav = document.querySelector(`#${this.mobileGNBTabs[this.targetGuideNumber].label}-nav`);
            let { top, right, bottom, left } = tavNav.getBoundingClientRect()
            this.guideXPos = left;
            if (this.targetGuideNumber == 0 || this.targetGuideNumber == 4) {
                this.connectBarXPos = left;
            }

        }, 0);
    }

    ngAfterViewInit() {
        let tabItem = document.querySelector(`.gnb-tab-item`);
        setTimeout(() => {
            this.guideWidth = tabItem.clientWidth;
            this.connectBarWidth = tabItem.clientWidth;
        }, 0);
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            // console.log(event)
            this.ngRedux.dispatch(selectGNBTab('none'));
            if (event instanceof NavigationEnd) {

                if (event.url == '/refuges') {
                    this.mobileGNBTabs.forEach(tab => tab.active = false);
                    this.guideDisplay = false;
                    return
                }

                if (event.url.includes('refuge-detail') || event.url.includes('refuge-article') || event.url.includes('refuge-request')) {
                    this.targetGuideNumber = 0;
                }
                if (event.url.includes('game')) {
                    this.targetGuideNumber = 2

                }
                if (event.url.includes('podcast')) {
                    this.targetGuideNumber = 3

                }
                // if (event.url.includes('about') || event.url.includes('notice')) {
                //     this.targetGuideNumber = 4;
                // }
                if (event.url.includes('vending_machine')) {
                    this.targetGuideNumber = 4;
                }
                if (event.url.includes('haewooso')) {
                    this.targetGuideNumber = 1;
                }

                this.connectBarDisplay = false;

                this.displayGuide(this.targetGuideNumber)

            }

        })


    }


    displayGuide(targetNumberIndex: number) {


        this.mobileGNBTabs.forEach(tab => tab.active = false);
        this.guideDisplay = true;
        this.mobileGNBTabs[targetNumberIndex].active = true
        let tavNav = document.querySelector(`#${this.mobileGNBTabs[targetNumberIndex].label}-nav`);
        let { top, right, bottom, left } = tavNav.getBoundingClientRect()
        this.guideXPos = left;
    }



}