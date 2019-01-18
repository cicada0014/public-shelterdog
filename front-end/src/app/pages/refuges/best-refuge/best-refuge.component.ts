


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RefugeArticlesAttribute } from '../../../types/schema.types';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { select } from '@angular-redux/store';
import { DeviceAttribute } from 'src/app/redux/device/device.action';
import { Observable } from 'rxjs';
import { NguCarouselConfig } from '@ngu/carousel';

@Component({
    selector: 'app-best-refuge',
    templateUrl: 'best-refuge.component.html',
    styleUrls: ['best-refuge.component.scss']
})

export class BestRefugeComponent implements OnInit {

    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    isMobile: boolean = false;
    items: RefugeArticlesAttribute[] = [];

    imgRegexp = /<img src\s*=\s*\\*"(.+?)\\*"\s*(\/)?>/;




    public carouselTile: NguCarouselConfig = {
        grid: { xs: 2, sm: 3, md: 4, lg: 4, all: 0 },
        slide: 3,
        speed: 250,
        point: {
            visible: true
        },
        load: 2,
        velocity: 0,
        touch: true,
        easing: 'cubic-bezier(0, 0, 0.2, 1)'
    };



    constructor(
        private http: HttpClient,
        private router: Router,
        private domSanitizer: DomSanitizer,

    ) {

        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })
    }








    goToArticle(item: RefugeArticlesAttribute) {

        this.router.navigateByUrl(`refuge-article/${item.id}/best`);
    }


    fixNumber(targetNumber) {
        return parseInt(targetNumber);
    }

    ngOnInit() {


    }

    ngAfterContentInit() {
        this.http
            .get('article/bests',
                {
                    params: { first: '0', rows: '12' }
                }
            )
            .toPromise()
            .then((r: any) => {
                let _items: RefugeArticlesAttribute[] = r.result
                this.items = _items.map(item => {
                    let imgs = this.imgRegexp.exec(item.content);
                    if (imgs && imgs.length > 0) {
                        let srcs = /src\=\"[^\s]*\"/.exec(imgs[0])
                        if (srcs) {
                            item.thumbnail = srcs[0].substring(5, srcs[0].length - 1)
                        }
                        // let imgSrc = imgs[1].replace(/width\=\"\d+\"/, '');
                        // console.log(imgSrc.replace(/style\=\".*\"/, ''))


                    }
                    return item
                })
                // this.carouselTileItems.forEach(el => {
                //     this.carouselTileLoad(el);
                // });
            })
            .catch(e => {
                console.log(e)
            })
    }
}