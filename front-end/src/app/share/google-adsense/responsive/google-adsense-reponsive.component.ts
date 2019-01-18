


import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'google-adsense-reponsive',
    templateUrl: 'google-adsense-reponsive.component.html',
    styleUrls: ['google-adsense-reponsive.component.scss']
})

export class GoogleAdsenseResponsiveComponent implements OnInit {


    @Input('isRect') isRect: boolean = false;

    constructor() {


    }

    ngOnInit() {




    }
}