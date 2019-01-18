


import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-scroll-top-tool',
    templateUrl: 'scroll-top.component.html',
    styleUrls: ['scroll-top.component.scss']
})

export class ScrollTopComponent implements OnInit {

    isActive: boolean = true;


    constructor(private router: Router) {

    }

    scrollTop() {
        const scrollHeight = window.scrollY,
            scrollStep = Math.PI / (500 / 15),
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

    ngOnInit() {
        this.isActive = this.router.url.includes('/game/defence') ? false : true;
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.isActive = event.url.includes('/game/defence') ? false : true;

            }
        })


    }
}