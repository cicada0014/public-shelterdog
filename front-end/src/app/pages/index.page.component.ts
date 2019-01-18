



import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { WideDisplay } from '../redux/event/event.action';
import { MessageService } from 'primeng/api';
import { UpdateService } from '../service/update.service';
import { DeviceAttribute } from '../redux/device/device.action';
import { HttpClient } from '@angular/common/http';
import { isNull } from 'util';


// const { detect } = require('detect-browser');



@Component({
    selector: 'app-index-page',
    templateUrl: `index.page.component.html`,
    styleUrls: ['index.page.component.scss']
})

export class IndexPageComponent implements OnInit {


    routingSpinner = false;

    msgs;
    browserCheckMsg;
    isWide: boolean = false;
    isFullScreen: boolean = false;
    isMobile: boolean = false;
    @select(['event', 'wideDisplay']) wideDisplay$: Observable<any>;
    @select(['event', 'selectGNBTabData']) selectGNBTabData$: Observable<string>;
    @select(['event', 'fullScreen']) fullScreen$: Observable<any>;
    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    gnbTabCurrSelected: string = 'none';

    forGNBItems: {
        refuge: { label: string, targetLink: string }[],
        about: { label: string, targetLink: string }[]
    } = {
            refuge: [],
            about: [
                {
                    label: 'ShelterDog이란?',
                    targetLink: 'about'
                },
                {
                    label: '공지사항',
                    targetLink: 'notice'
                }
            ]

        }



    constructor(
        private router: Router,
        private messageService: MessageService,
        private updateService: UpdateService,
        private http: HttpClient
        // private route : ActivatedRoute 

    ) {

        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.routingSpinner = true;
            }
            if (event instanceof NavigationEnd) {
                this.routingSpinner = false;
            }
        })

        this.selectGNBTabData$.subscribe(data => {
            if (isNull(data)) {
                this.gnbTabCurrSelected = 'none';
            } else {
                this.gnbTabCurrSelected = data;
            }
            // console.log(this.gnbTabCurrSelected)
        })


        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
            if (!(data.browser == 'chrome' || data.browser == 'safari')) {
                setTimeout(() => {
                    this.messageService.add(
                        {
                            severity: 'warn',
                            summary: '',
                            key: 'browser',
                            life: 2000,
                            detail: '이 사이트는 크롬, 사파리 브라우저에 최적화 되어있습니다.',
                        })
                    setTimeout(() => {
                        this.messageService.clear()
                    }, 2000);
                }, 0);
            }

        })


    }

    reload() {
        (<any>window).ga('send', 'event', {
            eventCategory: 'update',
            eventLabel: 'reload',
            eventAction: 'click',
            eventValue: 1
        });
        window.location.reload();
    }

    ngAfterViewInit() {

        this.wideDisplay$.subscribe(data => {
            setTimeout(() => {
                this.isWide = data;
            }, 0);
        })
        this.fullScreen$.subscribe(data => {
            setTimeout(() => {
                this.isFullScreen = data
            }, 0);
        })





    }


    goNavItem(navItem) {
        localStorage.setItem('currentFirst', '0');
        this.router.navigateByUrl(navItem.targetLink)
    }
    ngOnInit() {


        this.http
            .get('refuges/list')
            .toPromise()
            .then(r => {
                let refuges = r as any;
                this.forGNBItems.refuge = refuges.map(refuge => { return { label: refuge.name, targetLink: 'refuge-detail/' + refuge.id } });
            })
            .catch(e => {
                console.log(e)
            })


    }




    closeMenu($event) {
        if ($event.target) {
            if (document.querySelector('.ui-menuitem-active')) {
                document.querySelector('.ui-menuitem-active').classList.remove('ui-menuitem-active')
            }
        }
    }
}