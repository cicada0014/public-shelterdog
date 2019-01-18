




import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-ask',
    templateUrl: 'ask.component.html',
    styleUrls: ['ask.component.scss'],
    providers: [MessageService]
})

export class AskComponent implements OnInit {

    askCategories: { label: string, value: string }[] = [];
    selectedAskCategory: string
    askContent: string
    constructor(
        private http: HttpClient,
        private messageService: MessageService

    ) { }

    ngOnInit() {
        this.askCategories = [
            { label: '불편 사항', value: 'inconvenience' },
            { label: '오류/버그', value: 'error_or_bug' },
            { label: '제휴 문의', value: 'alliance' },
            { label: '기타', value: 'etc' },

        ]
    }

    sendAsk() {
        this.http
            .post('ask', {
                category: this.selectedAskCategory,
                content: this.askContent
            })
            .toPromise()
            .then(r => {

            })
            .catch(e => {
                console.error(e);
            })


    }
}