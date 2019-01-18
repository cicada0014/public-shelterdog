
import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CategoriesAttribute, RefugesAttribute } from '../../../types/schema.types';
import { Router } from '@angular/router';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { DeviceAttribute } from 'src/app/redux/device/device.action';

@Component({
    selector: 'app-refuge-list',
    templateUrl: 'refuge-list.component.html',
    styleUrls: ['refuge-list.component.scss']
})

export class RefugeListComponent implements OnInit {

    categories: CategoriesAttribute[] = [];
    isMobile: boolean = false;


    @Input('isSmallFont') isSmallFont: boolean;
    @Input('customText') customText: string;

    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;
    items: RefugesAttribute[] = [];

    constructor(
        private http: HttpClient,
        private router: Router
    ) {

        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })

    }

    ngOnInit() {
        this.getData();

    }

    goRefugeRequest() {
        this.router.navigateByUrl(`refuge-request`)
    }

    goToRefuge(refuge) {
        localStorage.setItem('currentFirst', '0');
        this.router.navigateByUrl(`refuge-detail/${refuge.id}`)
    }

    getData() {
        // this.http
        //     .get('refuges/categories/list')
        //     .toPromise()
        //     .then(r => {
        //         this.categories = r as any;
        //     })
        //     .catch(e => {
        //         console.log(e)
        //     })
        this.http
            .get('refuges/list')
            .toPromise()
            .then(r => {
                this.items = r as any;
            })
            .catch(e => {
                console.log(e)
            })
    }
}