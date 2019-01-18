




import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { NoticesAttribute } from '../../../types/schema.types';
import * as moment from 'moment';

@Component({
    selector: 'app-notice-detail',
    templateUrl: 'notice-detail.component.html',
    styleUrls: ['notice-detail.component.scss'],
    providers: [MessageService]
})

export class NoticeDetailComponent implements OnInit {

    item: NoticesAttribute = {};
    itemId;


    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private routeParam: ActivatedRoute,
        private router :Router
    ) { }
    ngOnInit() {

        this.routeParam.params.subscribe(data => {
            this.itemId = data.id;
            this.getData();
        })
    }

    goToList(){
        this.router.navigateByUrl('notice/list');
    }

    convertTime(created_at) {
        return moment(created_at).format('YYYY-MM-DD')
    }
    getData() {
        this.http
            .get(`notice/${this.itemId}`)
            .toPromise()
            .then(r => {
                console.log(r);
                this.item = r as any;
            })
            .catch(e => {
                console.log(e)
            })
    }
}