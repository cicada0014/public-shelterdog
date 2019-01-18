

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RefugeRequestsAttribute } from '../../types/schema.types';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { DeviceAttribute } from '../../redux/device/device.action';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-refuge-request',
    templateUrl: 'refuge-request.component.html',
    styleUrls: ['refuge-request.component.scss'],
    providers: [MessageService]
})

export class RefugeRequestComponent implements OnInit {



    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    public requestContent: string = '';

    public items: RefugeRequestsAttribute[];

    searchTarget;


    requestRow: number = 15;

    currentFirst: string = '0';

    totalRecords: number = 0;

    isMobile

    infiniteList = [];
    infiniteListMap = new Map<number, any>();


    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private titleService: Title
    ) {
        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile
        })

    }

    search() {

    }

    clearInfiniteList() {
        this.infiniteList.length = 0;
        this.infiniteListMap.clear();
    }

    appendItems(first) {
        this.http
            .get(`refuges/requests`, { params: { first: first, rows: this.requestRow + '' } })
            .toPromise()
            .then((r: any) => {
                this.items = r.requests;
                for (let request of this.items) {
                    if (!this.infiniteListMap.has(request.id)) {
                        this.infiniteListMap.set(request.id, null);
                        this.infiniteList.push(request);
                    }
                }
            })
            .catch(e => {
                console.log(e)
            })
    }

    // prependItems(startIndex, endIndex) {
    //     this.addItems(startIndex, endIndex, 'unshift');
    // }

    onScrollDown(ev) {
        if (this.infiniteList.length > 0) {
            // this.progressDisplay = true;
            const first = this.infiniteList.length;
            this.appendItems(first);
        }
    }
    onScrollUp(ev) {
    }


    getData() {
        this.http
            .get(`refuges/requests`, { params: { first: '0', rows: this.requestRow + '' } })
            .toPromise()
            .then((r: any) => {
                this.items = r.requests;
                this.totalRecords = r.totalRecords;
            })
            .catch(e => {
                console.log(e)
            })
    }

    ngOnInit() {
        this.titleService.setTitle('도피처 요청하기');

        if (this.isMobile) {
            this.clearInfiniteList();
            this.appendItems(0);
        } else {
            this.getData();
        }
    }



    loadData($event) {
        this.currentFirst = $event.first;
        this.http
            .get(`refuges/requests`, { params: { first: $event.first, rows: $event.rows } })
            .toPromise()
            .then((r: any) => {
                this.items = r.requests;
                this.totalRecords = r.totalRecords;
            })
            .catch(e => {
                console.log(e)
            })
    }

    convertTime(time) {
        return moment(time).format('YY-MM-DD')
    }
    empathize(request: RefugeRequestsAttribute) {
        this.http
            .post(`refuges/request/${request.id}/empathy`, null)
            .toPromise()
            .then(r => {
                if (this.isMobile) {
                    this.clearInfiniteList();
                    this.appendItems(0)
                }
                else {
                    this.loadData({ first: this.currentFirst, rows: this.requestRow + '' });
                    this.messageService.add({ key: 'request-toast', severity: 'success', summary: '존중', detail: '존중했습니다.' });
                }
            })
            .catch(e => {
                console.log(e)
                if (e.error.name == "SequelizeUniqueConstraintError") {
                    this.messageService.add({ key: 'request-toast', severity: 'error', summary: '중복', detail: '이미 존중하셨어요.' });
                } else if (e.status == 401) {
                    this.messageService.add({ key: 'request-toast', severity: 'error', summary: '로그인 필요', detail: '로그인 하셔야 해요!' });
                }
                else {
                    this.messageService.add({ key: 'request-toast', severity: 'error', summary: '존중 실패', detail: '잠시 후 다시 시도하세요.' });
                }

            })
    }

    requestRefuge() {
        if (!this.requestContent) {
            this.messageService.add({ key: 'request-toast', severity: 'warn', summary: '비어있음', detail: '요청 내용이 비어있습니다.' });
            return
        }
        this.http
            .post('refuges/request', {
                content: this.requestContent
            })
            .toPromise()
            .then(r => {
                this.messageService.add({ key: 'request-toast', severity: 'success', summary: '요청 성공', detail: '성공적으로 요청되었어요.' });
                this.requestContent = '';
                if (this.isMobile) {
                    this.clearInfiniteList();
                    this.appendItems(0)
                } else {
                    this.loadData({ first: this.currentFirst, rows: this.requestRow + '' });
                }
            })
            .catch(e => {
                if (e.error.message && e.error.message == 'Available in 24 hours') {
                    this.messageService.add({ key: 'request-toast', severity: 'error', summary: '중복 요청', detail: '요청 후 하루가 지나야 다시 요청 할 수 있어요.' });
                } else if (e.error.message && e.error.message == 'banned user') {
                    this.messageService.add({ key: 'request-toast', severity: 'error', summary: '권한 없음', detail: '차단된 사용자입니다.' });
                }
                else if (e.status == 401) {
                    this.messageService.add({ key: 'request-toast', severity: 'error', summary: '로그인 필요', detail: '로그인 하셔야 해요!' });
                }
                else {
                    this.messageService.add({ key: 'request-toast', severity: 'error', summary: '요청 실패', detail: '잠시 후 다시 시도하세요.' });
                }
                console.log(e)
            })
    }
}