


import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RefugesAttribute, RefugeArticlesAttribute } from '../../types/schema.types';
import * as moment from 'moment';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { DeviceAttribute } from '../../redux/device/device.action';
import { Title, Meta } from '@angular/platform-browser';
import { DataView } from 'primeng/dataview';
import { Paginator } from 'primeng/paginator';

@Component({
    selector: 'app-refuge-detail',
    templateUrl: 'refuge-detail.component.html',
    styleUrls: ['refuge-detail.component.scss']
})

export class RefugeDetailComponent implements OnInit {


    @Input('refugeId') refugeId: string;
    @Input('articleId') articleId: string;




    @ViewChild('pDataView') pDataView: DataView
    @ViewChild('pPaginator') pPaginator: Paginator

    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    imgRegexp = /<img src\s*=\s*\\*"(.+?)\\*"\s*(\/)?>/;
    youtubeRegexp = /<iframe.+?src="https?:\/\/www.youtube.com\/embed\/([a-zA-Z0-9_-]{11})"[^>]+?><\/iframe>/;
    item: RefugesAttribute = {};
    totalRecords: number = 1;
    searchTarget: 'title' | 'nickname' = 'title';
    articleRow: number = 15;

    isInit: boolean = false;

    isReady: Boolean = false;


    itemId;

    doneFirstLoad: boolean = false;

    bests
    populars
    deviceInfo = null;
    isMobile

    infiniteList = [];
    infiniteListMap = new Map<number, any>();
    sumItems: number = 0;

    progressDisplay: boolean = false;

    sortOptions: { value: any, label: string }[]

    isPopular: boolean = false;
    currFirst;

    articleHeaders: { id: number, name: string }[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private titleService: Title,
        private metaService: Meta
    ) {
        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })
        this.sortOptions = [
            { label: '최신 글', value: 'latest' },
            { label: '인기 글', value: 'popular' },
        ]
        this.articleHeaders = [
            { id: 1, name: '고민 글' },
            { id: 2, name: '유머 글' },
            { id: 3, name: '정보 글' }
        ]
    }

    findHeader(header_id) {
        const result = this.articleHeaders.find(header => header.id == header_id)
        return result ? `[${result.name}]` : ''
    }

    selectSort($event) {
        this.currFirst = '0';
        this.isPopular = $event.value == 'popular';

        this.loadData({ first: this.currFirst });
    }

    // appendItems(first) {
    //     if (this.itemId !== 'best') {
    //         this.http
    //             .get(`refuges/${this.itemId}`, { params: { first: first + '', rows: this.articleRow + '' } })
    //             .toPromise()
    //             .then(r => {
    //                 this.item = r as any;
    //                 if (!this.refugeId) {
    //                     this.setMeta();

    //                 }
    //                 for (let article of this.item.RefugeArticles) {
    //                     if (!this.infiniteListMap.has(article.id)) {
    //                         this.infiniteListMap.set(article.id, null);
    //                         let imgs = this.imgRegexp.exec(article.content);
    //                         if (imgs && imgs.length > 0) {
    //                             let srcs = /src\=\"[^\s]*\"/.exec(imgs[0])
    //                             if (srcs) {
    //                                 article.thumbnail = srcs[0].substring(5, srcs[0].length - 1)
    //                             }
    //                         }
    //                         this.infiniteList.push(article);
    //                     }
    //                 }
    //                 this.progressDisplay = false;

    //             })
    //             .catch(e => {
    //                 this.progressDisplay = false;
    //                 console.log(e)
    //             })
    //     } else {
    //         this.http
    //             .get('article/bests', { params: { first: first + '', rows: this.articleRow + '' } })
    //             .toPromise()
    //             .then(r => {
    //                 this.bests = r as any;
    //                 for (let article of this.bests) {
    //                     if (!this.infiniteListMap.has(article.id)) {
    //                         this.infiniteListMap.set(article.id, null);
    //                         let imgs = this.imgRegexp.exec(article.content);
    //                         if (imgs && imgs.length > 0) {
    //                             let srcs = /src\=\"[^\s]*\"/.exec(imgs[0])
    //                             if (srcs) {
    //                                 article.thumbnail = srcs[0].substring(5, srcs[0].length - 1)
    //                             }
    //                         }
    //                         this.infiniteList.push(article);
    //                     }
    //                 }
    //                 this.progressDisplay = false;
    //             })
    //             .catch(e => {
    //                 this.progressDisplay = false;
    //                 console.log(e)
    //             })
    //     }
    // }

    // prependItems(startIndex, endIndex) {
    //     this.addItems(startIndex, endIndex, 'unshift');
    // }

    // onScrollDown(ev) {
    //     if (this.infiniteList.length > 0) {
    //         this.progressDisplay = true;
    //         const first = this.infiniteList.length;
    //         this.appendItems(first);
    //     }
    // }
    // onScrollUp(ev) {
    // }



    getRefugeTitleColor(item: RefugesAttribute) {
        if (item.meta) {
            const meta = JSON.parse(item.meta);
            return meta.titleColor
        } else {
            return '#000';
        }
    }
    // clearInfiniteList() {
    //     this.infiniteList.length = 0;
    //     this.infiniteListMap.clear();
    // }


    setMeta() {
        this.titleService.setTitle(`${this.item.name} 도피처 - Shelter Dog(쉘터 독)`);
        this.metaService.removeTag('keywords')
        this.metaService.addTag({ name: 'keywords', content: this.item.name });
        this.metaService.updateTag({ property: 'og:title', content: `${this.item.name} 도피처 - 싫어하는 것을 이야기하는 커뮤니티` });
        this.metaService.updateTag({ property: 'og:image', content: 'https://s3.ap-northeast-2.amazonaws.com/article.images/0c/94/93/5d/4c/48/d9/a9/55/d9/c6/54/d0/f3/84/8f' });
        this.metaService.updateTag({ property: 'og:description', content: `${this.item.name} 싫어하는 사람 여기 모여라!` });
        this.metaService.updateTag({ name: 'description', content: `${this.item.name} 싫어하는 사람 여기 모여라!` });
    }

    ngOnInit() {
        // refugeId가 있다는건 아티클 하단에 위치한다는 의미이다. 
        if (this.refugeId) {


            this.itemId = this.refugeId
            // this.clearInfiniteList();
            this.isPopular = false;

            const _memoFirst = localStorage.getItem('currentFirst')
            this.currFirst = _memoFirst ? _memoFirst : '0';
            // if (this.isMobile) {
            //     this.appendItems(0);
            // } else {
            //     // if (this.itemId) {
            //     //     this.loadData({ first: this.currFirst });
            //     // }
            // }
            if (this.isInit) {
                this.loadData({ first: this.currFirst });
            }

        } else {
            // Gnb를 통해 들어왔을대 이 경로를 탄다. 
            this.route.params
                .subscribe(data => {
                    if (this.itemId != data.refuge_id) {
                        // 무한스크롤 기록을 없애준다.
                        // this.clearInfiniteList();

                        this.isPopular = false;
                        // this.currFirst = '0';
                        // const _memoFirst = localStorage.getItem('currentFirst')
                        // this.currFirst = '0';
                        // localStorage.setItem('currentFirst', '0');
                        // if (!this.itemId) {
                        // } else {
                        const _memoFirst = localStorage.getItem('currentFirst')
                        this.currFirst = _memoFirst ? _memoFirst : '0';
                        console.log()
                        // }



                        this.totalRecords = 0;
                    } else {
                        const _memoFirst = localStorage.getItem('currentFirst')
                        this.currFirst = _memoFirst ? _memoFirst : '0';

                    }
                    this.itemId = data.refuge_id;
                    // if (this.isMobile) {
                    //     this.appendItems(0);
                    // } else {
                    if (this.isInit) {
                        this.loadData({ first: this.currFirst });
                    }
                    // }
                })
        }
    }

    fixedCount(empathy_count) {
        if (empathy_count) {
            return parseInt(empathy_count)
        } else {
            return 0
        }
    }


    loadData({ first = '0', rows = this.articleRow + '' }) {

        if (!this.isInit) {
            first = localStorage.getItem('currentFirst') ? localStorage.getItem('currentFirst') : '0';
            this.isInit = true;
        }

        this.currFirst = first;
        this.isReady = false;
        if (this.itemId !== 'best') {
            this.http
                .get(`refuges/${this.itemId}`, { params: { first: first, rows: rows, popular: this.isPopular ? 'true' : 'false' } })
                .toPromise()
                .then(r => {
                    this.item = r as any;
                    if (!this.refugeId) {
                        this.setMeta();
                    }
                    if (!this.isPopular) {
                        this.totalRecords = this.item.totalRecords;
                    } else {
                        this.populars = (<any>this.item).BestRefugeArticles;
                    }
                    for (let article of this.item.RefugeArticles) {

                        let imgs = this.imgRegexp.exec(article.content);
                        if (imgs && imgs.length > 0) {
                            let srcs = /src\=\"[^\s]*\"/.exec(imgs[0])
                            if (srcs) {
                                article.thumbnail = srcs[0].substring(5, srcs[0].length - 1)
                            }
                        }
                        if (this.youtubeRegexp.exec(article.content)) {
                            article.youtube = true;
                        }
                    }
                    this.pDataView.first = parseInt(first);
                    this.pPaginator._first = parseInt(first);

                    // console.log(this.pPaginator);
                    // console.log(this.pDataView)

                    // this.articleRow = this.item.RefugeArticles.length
                    // document.querySelector('.ui-g').appendChild('div')

                    this.isReady = true;


                })
                .catch(e => {
                    if (e.error.message == 'deactive refuge') {
                        this.router.navigateByUrl('/deactive-refuge')
                    } else {
                        console.log(e)
                        this.router.navigateByUrl('/')
                    }
                    this.isReady = true;
                })
        } else {
            // this.clearInfiniteList();
            this.http
                .get('article/bests', { params: { first, rows: this.articleRow + '' } })
                .toPromise()
                .then((r: any) => {
                    this.bests = r.result;

                    this.totalRecords = r.totalRecords
                    for (let article of this.bests) {
                        let imgs = this.imgRegexp.exec(article.content);
                        if (imgs && imgs.length > 0) {
                            let srcs = /src\=\"[^\s]*\"/.exec(imgs[0])
                            if (srcs) {
                                article.thumbnail = srcs[0].substring(5, srcs[0].length - 1)
                            }
                        }
                    }
                    this.isReady = true;
                    this.pDataView.first = parseInt(first);
                    this.pPaginator._first = parseInt(first);
                })
                .catch(e => {
                    console.log(e)
                    this.isReady = true;
                })
        }
    }

    convertTime(article: RefugeArticlesAttribute) {
        if (!article) {
            return
        }

        const _diffNow = moment().diff(moment(article.created_at), 'm');
        if (_diffNow < 1) {
            return '방금 전'
        } else if (_diffNow >= 1 && _diffNow < 60) {
            return `${Math.floor(_diffNow)}분 전`
        } else if (_diffNow >= 60 && _diffNow < 1440) {
            if (moment().date() != moment(article.created_at).date()) {
                return moment(article.created_at).format('YY-MM-DD')
            } else {
                return moment(article.created_at).format('HH:mm')
            }
        }
        else {
            return moment(article.created_at).format('YY-MM-DD')
        }

    }

    searchArticle() {


    }
    ngOnDestroy() {

    }

    onPage($event) {


        // console.log(this.pDataView)
        // console.log($event)
        if ($event) {
            this.currFirst = $event.first + ''
            localStorage.setItem('currentFirst', this.currFirst);
            this.router.navigateByUrl('/refuge-detail/' + this.itemId)
            window.scrollTo(0, 0);
            this.loadData($event);
        } else {
        }
    }

    goToArticle(article: RefugeArticlesAttribute) {

        let target = `/refuge-article/${article.id}`;
        if (this.itemId == 'best') {
            target += '/best'
        } else if (this.itemId == 'free') {
            target += '/free'
        }
        this.router.navigateByUrl(target)
    }
    goToWrite(refuge_id) {
        this.router.navigateByUrl(`/article-editor/${refuge_id}`)

    }
}