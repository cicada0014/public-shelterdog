



import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PodcastsAttribute } from 'src/app/types/schema.types';
import { DomSanitizer } from '@angular/platform-browser';
import { DeviceAttribute } from 'src/app/redux/device/device.action';
import { Observable } from 'rxjs';
import { select } from '@angular-redux/store';

import * as moment from 'moment';

@Component({
    selector: 'app-podcast-list',
    templateUrl: 'podcast.list.component.html',
    styleUrls: ['podcast.list.component.scss']
})

export class PodcastListComponent implements OnInit {

    items: PodcastsAttribute[] = [];
    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    selectedItem: PodcastsAttribute;
    isMobile: boolean = false;

    constructor(
        private http: HttpClient,
        private sanitizer: DomSanitizer


    ) {

        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })

    }

    ngOnInit() {
        this.getData();

    }

    onScrollDown($event) {

    }

    playPodcast(item: PodcastsAttribute) {
        this.selectedItem = item;
        window.scrollTo(0, document.querySelector('.podcast-yt').scrollTop);
    }

    convertTime(created_at) {
        return moment(created_at).format('YYYY-MM-DD');
    }

    getData() {
        this.http
            .get('podcast/list')
            .toPromise()
            .then(r => {
                this.items = r as any;
                console.log(this.items)
                this.items = this.items.map((item) => {
                    item.link = this.sanitizer.bypassSecurityTrustHtml(item.link) as any;
                    return item
                })
                this.selectedItem = this.items[0];
                // this.items.unshift({ id: -1, title: '회차', description: '제목', created_at: '날짜' })

            })
            .catch(e => {
                console.log(e)
            })
    }
}