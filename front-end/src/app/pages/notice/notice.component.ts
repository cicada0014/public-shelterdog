




import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { NoticesAttribute } from '../../types/schema.types';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-notice',
    templateUrl: 'notice.component.html',
    styleUrls: ['notice.component.scss'],
    providers: [MessageService]
})

export class NoticeComponent implements OnInit {

    items: NoticesAttribute[] = [];


    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private router: Router,
        private titleService: Title,
        private metaService: Meta
    ) { }

    goToNotice(itemId) {
        this.router.navigateByUrl(`notice/${itemId}`);
    }

    convertTime(created_at) {
        return moment(created_at).format('YYYY-MM-DD')
    }

    setMeta() {
        this.titleService.setTitle(`Shelter Dog(쉘터 독) 공지사항`);
        this.metaService.removeTag('keywords')
        this.metaService.addTag({ name: 'keywords', content: '공지사항' });
        this.metaService.updateTag({ property: 'og:title', content: ` Shelter Dog(쉘터 독) 공지사항 - 싫어하는 것을 이야기하는 커뮤니티` });
        this.metaService.updateTag({ property: 'og:image', content: 'https://s3.ap-northeast-2.amazonaws.com/article.images/0c/94/93/5d/4c/48/d9/a9/55/d9/c6/54/d0/f3/84/8f' });
        this.metaService.updateTag({ property: 'og:description', content: `Shelter Dog(쉘터 독) 공지사항 - 싫어하는 것을 이야기하는 커뮤니티` });
        this.metaService.updateTag({ name: 'description', content: `Shelter Dog(쉘터 독) 공지사항 - 싫어하는 것을 이야기하는 커뮤니티` });
    }
    ngOnInit() {
        this.http
            .get('notice/list')
            .toPromise()
            .then(r => {
                this.items = r as any;
                this.setMeta();
            })
            .catch(e => {
                console.log(e)
            })
    }


}