

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { select } from '@angular-redux/store';
import { DeviceAttribute } from 'src/app/redux/device/device.action';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-default-podcast',
    templateUrl: 'podcast.component.html',
    styleUrls: ['podcast.component.scss']

})

export class DefaultPodCastComponent implements OnInit {


    item;


    isMobile: boolean = false;
    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    constructor(
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private router: Router


    ) {
        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })

    }
    goPodcast() {
        this.router.navigateByUrl('podcast')
    }

    convertTime(time) {
        return moment(time).format('YYYY-MM-DD');
    }


    getData() {
        this.http
            .get('podcast/latest')
            .toPromise()
            .then(r => {

                let _item = r as any;
                _item.link = this.sanitizer.bypassSecurityTrustHtml(_item.link);
                this.item = _item;
            })
            .catch(e => {
                console.log(e)
            })
    }

    ngOnInit() {
        this.getData();

    }
}