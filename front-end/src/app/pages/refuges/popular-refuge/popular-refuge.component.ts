

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RefugesAttribute, RefugeArticlesAttribute } from '../../../types/schema.types';
import { Router } from '@angular/router';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { DeviceAttribute } from '../../../redux/device/device.action';

@Component({
    selector: 'app-popular-refuge',
    templateUrl: 'popular-refuge.component.html',
    styleUrls: ['popular-refuge.component.scss']
})

export class PopularRefugeComponent implements OnInit {
    isMobile: boolean;

    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;
    imgRegexp = /<img src\s*=\s*\\*"(.+?)\\*"\s*(\/)?>/;

    items: {
        articles: {
            content: string,
            created_at: any,
            hit: number,
            id: number,
            refuge_name: string,
            score: string,
            title: string,
            user_id: number,
            thumbnail?:string
        }[],
        count: number,
        refuge_id: number,
        refuge_name: string,
        meta: any
    }[] = [];

    constructor(
        private http: HttpClient,
        private router: Router

    ) {
        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })


    }

    goToArticle(item: {
        content: string,
        created_at: any,
        hit: number,
        id: number,
        refuge_name: string,
        score: string,
        title: string,
        user_id: number,
    }) {
        this.router.navigateByUrl(`refuge-article/${item.id}`);
    }
    goToRefuge(item: { articles: any[], count: number, refuge_id: number, refuge_name: string }) {
        this.router.navigateByUrl(`refuge-detail/${item.refuge_id}`)
    }


    getRefugeTitleColor(item: RefugesAttribute) {
        if (item.meta) {
            const meta = JSON.parse(item.meta);
            return meta.titleColor
        } else {
            return '#000';
        }
    }

    ngOnInit() {

        this.http
            .get('refuges/popular', { params: { first: '0', rows: '5' } })
            .toPromise()
            .then(r => {
                this.items = r as any;
                for (let popularRefuge of this.items) {
                    for (let article of popularRefuge.articles) {
                        let imgs = this.imgRegexp.exec(article.content);
                        if (imgs && imgs.length > 0) {
                            let srcs = /src\=\"[^\s]*\"/.exec(imgs[0])
                            if (srcs) {
                                article.thumbnail = srcs[0].substring(5, srcs[0].length - 1)
                            }
                        }
                    }
                }

            })
            .catch(e => {
                console.log(e)
            })



    }
}