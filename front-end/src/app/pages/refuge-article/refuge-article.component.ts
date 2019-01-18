


import { Component, OnInit, ViewChild, ElementRef, SecurityContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { RefugeArticlesAttribute, RefugeArticleCommentsAttribute, RefugesAttribute, UsersAttribute } from '../../types/schema.types';
import * as moment from 'moment';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DomSanitizer, Title, Meta, SafeHtml } from '@angular/platform-browser';
import { setCurrentUser } from '../../redux/user/user.action';
import { NgRedux, select } from '@angular-redux/store';
import { AppState } from '../../redux/root.reducer';
import { Observable } from 'rxjs';
import { showLoginModal, showSignUpModal } from '../../redux/event/event.action';
import { DeviceAttribute } from '../../redux/device/device.action';
import { RefugeDetailComponent } from '../refuge-detail/refuge-detail.component';
import { isNull } from 'util';


declare let Kakao: any;


@Component({
    selector: 'app-refuge-article',
    templateUrl: 'refuge-article.component.html',
    styleUrls: ['refuge-article.component.scss'],
    providers: [MessageService, ConfirmationService]
})

export class RefugeArticleComponent implements OnInit {

    @ViewChild('articleList') articleList: RefugeDetailComponent
    @ViewChild('commentFormRef') commentFormRef: ElementRef;



    @select(['user', 'currentUser']) currentUser$: Observable<UsersAttribute>;
    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>


    articleHeaders: { id: number, name: string }[] = [];

    isCommentAnonymous: boolean = false;
    detail_refuge_id: any;
    isLoggedIn: boolean = false;
    isMobile: boolean = false;
    isFromBest: boolean = false;
    userId: number;


    comentFormTarget: RefugeArticleCommentsAttribute = {};


    articleToastKey: string = 'article-toast'

    articleId: number;
    item: RefugeArticlesAttribute = {};
    messageTimerId;
    imgRegexp = /<img src\s*=\s*\\*"(.+?)\\*"\s*(\/)?>/;




    quillEditor;

    // empathyResultMsgs = [];


    constructor(
        private http: HttpClient,
        private routeParam: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer,
        private messageService: MessageService,
        private ngRedux: NgRedux<AppState>,
        private confirmationService: ConfirmationService,
        private titleService: Title,
        private metaService: Meta
    ) {
        this.articleHeaders = [
            { id: 1, name: '고민 글' },
            { id: 2, name: '유머 글' },
            { id: 3, name: '정보 글' }
        ]

        this.currentUser$.subscribe(user => {
            this.isLoggedIn = user ? true : false;
            if (user) {
                this.userId = user.id
            }
        })
        this.currentDevice$.subscribe(device => {
            this.isMobile = device.isMobile
        })


    }


    toTrashCan() {
        this.confirmationService.confirm({
            key: 'delete',
            message: '이 게시글을 아카이브합니다. 해당 게시글은 이제 일반 유저들에게 보이지 않습니다.',
            accept: () => {
                //Actual logic to perform a confirmation
                this.http
                    .patch(`admin/article/archive`, {
                        id: this.item.id
                    })
                    .toPromise()
                    .then(r => {
                        alert('완료.')
                        this.router.navigateByUrl(`refuge-detail/${this.item.refuge_id}`)
                    })
                    .catch(e => {
                        alert('실패 - 에러')
                    })
            }
        })
    }
    findHeader(header_id) {

        const result = this.articleHeaders.find(header => header.id == header_id)
        return result ? result.name : ''
    }

    webcheck() {
        if (!this.isLoggedIn) {
            this.showLoginDialog()
        }
    }


    goToList() {
        this.router.navigateByUrl(`refuge-detail/${this.isFromBest ? 'best' : this.item.refuge_id}`);
    }

    updateArticle() {
        this.router.navigateByUrl(`article-editor/${this.item.id}/edit`);

    }

    deleteArticle() {
        this.confirmationService.confirm({
            key: 'delete',
            message: '정말 삭제 하시겠습니까? 삭제하면 내용이 복구 되지 않습니다.',
            accept: () => {
                //Actual logic to perform a confirmation
                this.http
                    .delete(`article/${this.articleId}`)
                    .toPromise()
                    .then(r => {
                        alert('삭제되었습니다.')
                        this.router.navigateByUrl(`refuge-detail/${this.item.refuge_id}`)
                    })
                    .catch(e => {
                        alert('삭제 실패')
                    })
            }
        });
    }


    getRefugeTitleColor(item: RefugesAttribute) {
        if (item && item.meta) {
            const meta = JSON.parse(item.meta);
            return meta.titleColor
        } else {
            return '#000';
        }
    }


    deleteComment(comment: RefugeArticleCommentsAttribute) {
        this.confirmationService.confirm({
            key: 'delete',
            message: '정말 삭제 하시겠습니까? 삭제하면 내용이 복구 되지 않습니다.',
            accept: () => {
                this.http
                    .delete(`article/comment/${comment.id}`, {
                        headers: {
                            'x-comment-parent': comment.parent ? 'false' : 'true'
                        }
                    })
                    .toPromise()
                    .then(r => {
                        this.getArticle();
                        this.messageService.add({ key: this.articleToastKey, severity: 'info', summary: '삭제', detail: '이 댓글을 삭제하였습니다.' });
                    })
                    .catch(e => {
                        console.log(e)
                    })

            }
        })



    }

    showLoginDialog() {
        this.ngRedux.dispatch(showLoginModal(true))
    }

    showSignUpDialog() {
        this.ngRedux.dispatch(showSignUpModal(true))
    }



    reportComment(commentId) {
        this.confirmationService.confirm({
            key: 'report',
            message: '신고하시겠습니까?',
            accept: () => {
                this.http
                    .post(`article/comment/${commentId}/report`, null)
                    .toPromise()
                    .then(r => {
                        this.messageService.add({ key: this.articleToastKey, severity: 'info', summary: '신고', detail: '이 댓글을 신고하였습니다.' });
                    })
                    .catch(e => {
                        console.log(e)
                        if (e.status == 401) {
                            this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '로그인 필요', detail: '신고하려면 로그인이 필요합니다.' });
                            this.showLoginDialog()
                            this.ngRedux.dispatch(setCurrentUser(null))
                        } else if (e.status == 400) {
                            if (e.error.name == "SequelizeUniqueConstraintError") {
                                this.messageService.add({ key: this.articleToastKey, severity: 'warn', summary: '중복 신고', detail: '이미 신고를 하셨어요!' });
                            }
                        }
                    })

            }
        })







    }

    reportArticle() {

        this.confirmationService.confirm({
            key: 'report',
            message: '신고하시겠습니까?',
            accept: () => {
                this.http
                    .post(`article/${this.articleId}/report`, null)
                    .toPromise()
                    .then(r => {
                        this.messageService.add({ key: this.articleToastKey, severity: 'info', summary: '신고', detail: '이 게시글을 신고하였습니다.' });
                        // this.empathyResultMsgs.push({ severity: 'info', summary: '신고', detail: '이 게시글을 신고하였습니다.' });
                    })
                    .catch(e => {
                        if (this.messageTimerId) {
                            clearTimeout(this.messageTimerId)
                        }
                        console.log(e)
                        // this.empathyResultMsgs = [];
                        if (e.status == 401) {
                            this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '로그인 필요', detail: '신고하려면 로그인이 필요합니다.' });
                            this.showLoginDialog();
                            // this.empathyResultMsgs.push({ severity: 'error', summary: '로그인 필요', detail: '신고를 하려면 로그인이 필요해요.' });
                            this.ngRedux.dispatch(setCurrentUser(null))
                        } else if (e.status == 400) {
                            if (e.error.name == "SequelizeUniqueConstraintError") {
                                this.messageService.add({ key: this.articleToastKey, severity: 'warn', summary: '중복 신고', detail: '이미 신고를 하셨습니다.' });
                                // this.empathyResultMsgs.push({ severity: 'warn', summary: '중복 신고', detail: '이미 신고를 하셨어요!' });
                            }
                        }
                        this.messageTimerId = setTimeout(() => {
                            // this.empathyResultMsgs = [];
                        }, 2500);
                    })
            }
        })
    }

    // sanitizeContent(content: string) {
    //     console.log(this.sanitizer)
    //     return this.sanitizer.sanitize(content);
    // }

    empathize() {
        this.http
            .post(`article/${this.articleId}/empathy`, null)
            .toPromise()
            .then(r => {
                this.getArticle();
            })
            .catch(e => {
                if (this.messageTimerId) {
                    clearTimeout(this.messageTimerId)
                }
                console.log(e)
                if (e.status == 401) {
                    // this.empathyResultMsgs = [];
                    // if (document.querySelector('.empathy-tool')) {
                    //     window.scrollTo(0, ((<any>document.querySelector('.empathy-tool')).offsetTop / 2));
                    // }
                    this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '로그인 필요', detail: '존중하려면 로그인이 필요합니다.' });
                    // this.empathyResultMsgs.push({ severity: 'error', summary: '로그인 필요', detail: '존중을 하려면 로그인이 필요해요.' });
                    this.showLoginDialog();
                    this.ngRedux.dispatch(setCurrentUser(null))
                    // this.messageTimerId = setTimeout(() => {
                    //     this.empathyResultMsgs = [];
                    // }, 2500);
                }
            })
    }

    cancelEmpathy() {
        this.http
            .delete(`article/empathy/${this.item.isUserEmpathy}`)
            .toPromise()
            .then(r => {
                this.getArticle();
            })
            .catch(e => {
                console.log(e)
                if (e.status == 401) {

                    // this.empathyResultMsgs = [];
                    // if (document.querySelector('.empathy-tool')) {
                    //     window.scrollTo(0, ((<any>document.querySelector('.empathy-tool')).offsetTop / 2));
                    // }
                    this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '로그인 필요', detail: '존중을 취소 하려면 로그인이 필요합니다.' });
                    // this.empathyResultMsgs.push({ severity: 'error', summary: '로그인 필요', detail: '존중을 취소 하려면 로그인이 필요해요.' });
                    this.showLoginDialog();
                    this.ngRedux.dispatch(setCurrentUser(null))
                    // setTimeout(() => {
                    //     this.empathyResultMsgs = [];
                    // }, 2500);
                }
            })
    }

    convertTime(time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }


    shareClick() {
        (<any>window).ga('send', 'event', {
            eventCategory: 'share',
            eventLabel: 'kakao',
            eventAction: 'click',
            eventValue: 1
        });
    }
    // initShareKakaoLink() {
    //     // // 카카오링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.
    //     setTimeout(() => {
    //         Kakao.Link.createDefaultButton({
    //             container: document.querySelector('#kakao-link-btn'),
    //             objectType: 'feed',
    //             content: {
    //                 title: `Shelter Dog : ${this.item.title}`,
    //                 description: '싫어하는 것들을 이야기해보자! Shelter Dog',
    //                 imageUrl: `${this.item.thumbnail}`,
    //                 link: {
    //                     mobileWebUrl: window.location.href,
    //                     webUrl: window.location.href
    //                 }
    //             },
    //         });
    //     }, 0);
    // }




    setMeta() {
        this.titleService.setTitle(`${this.item.title} - Shelter Dog(쉘터 독)`);
        this.metaService.removeTag('keywords')
        this.metaService.addTag({ name: 'keywords', content: this.item.Refuge.name });
        this.metaService.updateTag({ property: 'og:title', content: this.item.title });
        this.metaService.updateTag({ property: 'og:image', content: this.item.thumbnail ? this.item.thumbnail : 'https://s3.ap-northeast-2.amazonaws.com/article.images/0c/94/93/5d/4c/48/d9/a9/55/d9/c6/54/d0/f3/84/8f' });
        this.metaService.updateTag({ property: 'og:description', content: this.item.content.replace(/<(.|\n)*?>/g, '') });
        this.metaService.updateTag({ name: 'description', content: this.item.content.replace(/<(.|\n)*?>/g, '') });
    }

    getArticle(hit?: boolean, from?: string) {
        this.http
            .get(`article/${this.articleId}`, {
                headers: {
                    "x-hit-read": hit ? 'yes' : 'no'
                }
            })
            .toPromise()
            .then(r => {
                let _item = r as any;

                // _item.content = this.sanitizeContent(_item.content);
                this.item = _item;
                this.detail_refuge_id = from ? from : this.item.refuge_id;
                let imgs = this.imgRegexp.exec(this.item.content);
                if (imgs && imgs.length > 0) {
                    let srcs = /src\=\"[^\s]*\"/.exec(imgs[0])
                    if (srcs) {
                        this.item.thumbnail = srcs[0].substring(5, srcs[0].length - 1)
                    }
                }
                this.setMeta();
                // this.initShareKakaoLink();
                // window.scrollTo(0, 0);
            })
            .catch(e => {
                if (e.status == 404) {
                    this.router.navigateByUrl('not-found-article?article=true')
                } else if (e.status == 406) {
                    console.log(e);
                    this.router.navigateByUrl('not-found-article?status=archive')
                } else {
                    console.log(e);
                }
            })
    }

    async ngOnInit() {

        this.routeParam.params
            .subscribe(data => {

                if (this.articleId && (this.articleId != data.id)) {
                    this.articleList.loadData({ first: localStorage.getItem('currentFirst') ? localStorage.getItem('currentFirst') : '0' });
                    document.querySelector('app-refuge-article').appendChild(document.querySelector('#commentForm'))
                }
                this.articleId = data.id
                this.isFromBest = data.from ? true : false;
                this.getArticle(true, data.from);
            })


    }


    

    ngOnDestroy() {
        // localStorage.removeItem('currentFirst')
    }


    updateComment(comment: RefugeArticleCommentsAttribute) {
        if (this.comentFormTarget.isUpdate) {
            delete this.comentFormTarget.isUpdate
        }
        this.comentFormTarget = comment;
        this.comentFormTarget.isUpdate = true;
        this.commentFormRef.nativeElement.value = comment.content;
        document.querySelector('#comment' + comment.id).appendChild(document.querySelector('#commentForm'))
    }

    appendcommentForm(comment: RefugeArticleCommentsAttribute) {
        if (this.comentFormTarget.isUpdate) {
            delete this.comentFormTarget.isUpdate
        }
        this.comentFormTarget = comment;
        this.commentFormRef.nativeElement.value = '';
        document.querySelector('#comment' + comment.id).appendChild(document.querySelector('#commentForm'))
    }


    ngAfterViewInit() {
        setTimeout(() => {
            try {
                (window["adsbygoogle"] = window["adsbygoogle"] || []).push({});
            } catch (e) {
                // console.error(e);
            }
        }, 2000);
    }

    registerUpdateComment(commentFormRef) {
        if (!commentFormRef.value) {
            this.messageService.add({ key: this.articleToastKey, severity: 'warn', summary: '내용', detail: '내용을 입력하세요.' });
            return
        }

        if (this.detectingMaliciousContent(commentFormRef.value)) {
            return
        }

        // commentFormRef.value = this.sanitizer.sanitize(SecurityContext.HTML, commentFormRef.value);
        this.http
            .patch(`article/comment/${this.comentFormTarget.id}`, {
                content: commentFormRef.value,
                anonymous: this.isCommentAnonymous
            })
            .toPromise()
            .then(r => {
                document.querySelector('app-refuge-article').appendChild(document.querySelector('#commentForm'))
                commentFormRef.value = '';
                this.getArticle();
            })
            .catch(e => {
                console.log(e)
                if (e.status == 401) {
                    this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '로그인 필요', detail: '댓글을 수정하려면 로그인이 필요합니다.' });
                    this.showLoginDialog();
                    this.ngRedux.dispatch(setCurrentUser(null))
                } else {
                    this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '', detail: '잠시 후 다시 시도하세요.' });
                }
            })

    }

    commentToComment(commentFormRef) {
        if (!commentFormRef.value) {
            this.messageService.add({ key: this.articleToastKey, severity: 'warn', summary: '내용', detail: '내용을 입력하세요.' });
            return
        }


        this.http
            .post(`article/comment/tocomment`, {
                content: commentFormRef.value,
                refuge_article_id: this.comentFormTarget.refuge_article_id,
                parent: this.comentFormTarget.parent ? this.comentFormTarget.parent : this.comentFormTarget.id,
                mention_id: this.comentFormTarget.user_id
            })
            .toPromise()
            .then(r => {
                document.querySelector('app-refuge-article').appendChild(document.querySelector('#commentForm'))
                commentFormRef.value = '';
                this.getArticle();
            })
            .catch(e => {
                console.log(e)
                if (e.status == 401) {
                    this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '로그인 필요', detail: '댓글을 달려면 로그인이 필요합니다.' });
                    this.showLoginDialog();
                    this.ngRedux.dispatch(setCurrentUser(null))
                } else {
                    if (e.error.message == 'banned user') {
                        this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '', detail: '차단된 사용자입니다.' });
                    }
                    else if (e.error.message == 'Available in 1 minute') {
                        this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '', detail: '글 작성 뒤 바로 작성 할 수 없습니다. 1분 마다 가능합니다.' });

                    }
                    else {
                        this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '', detail: '잠시 후 다시 시도하세요.' });
                    }
                }
            })

    }





    detectingMaliciousContent(content) {
        let imgs;
        const imgRegexp = /<img src\s*=\s*\\*"(.+?)\\*"\s*(\/)?>/g;
        // content = this.sanitizer.sanitize(SecurityContext.NONE, content);
        while (!isNull(imgs = imgRegexp.exec(content))) {
            if (imgs && imgs.length > 0) {
                for (let img of imgs) {
                    let srcs = /src\=\"[^\s]*\"/.exec(img)
                    if (srcs) {
                        if (srcs[0].substring(5, srcs[0].length - 1).substring(0, 5) !== 'https') {
                            this.messageService.add({ key: this.articleToastKey, severity: 'warn', summary: '이미지', detail: '보안되지 않은 사이트의 이미지는 넣을 수 없습니다.' })
                            return true
                        }
                    }
                }
                // let imgSrc = imgs[1].replace(/width\=\"\d+\"/, '');
                // console.log(imgSrc.replace(/style\=\".*\"/, ''))
            }
        }
        return false
    }




    registComment(userCommentForm, empathy?: string) {





        let content: string = userCommentForm.value;
        if (content) {
            if (this.detectingMaliciousContent(content)) {
                return
            }
            content = content.replace(/\n/, '<br>')

        } else {

            return
        }

        let comment: RefugeArticleCommentsAttribute = {
            refuge_article_id: this.articleId,
            content: content,
        }


        comment.anonymous = this.isCommentAnonymous;
        this.http
            .post(`article/comment`, comment, {
                headers: {
                    'x-comment-empathy': this.item.isUserEmpathy ? 'false' : (empathy ? 'true' : 'false'),
                }
            })
            .toPromise()
            .then(r => {
                document.querySelector('app-refuge-article').appendChild(document.querySelector('#commentForm'))
                userCommentForm.value = '';
                this.getArticle();
            })
            .catch(e => {
                console.log(e)
                if (e.status == 401) {
                    this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '로그인 필요', detail: '댓글을 달려면 로그인이 필요합니다.' });
                    this.showLoginDialog();
                    this.ngRedux.dispatch(setCurrentUser(null))
                } else {

                    if (e.error.message == 'banned user') {
                        this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '', detail: '차단된 사용자입니다.' });
                    }
                    else if (e.error.message == 'Available in 1 minute') {
                        this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '', detail: '글 작성 뒤 바로 작성 할 수 없습니다. 1분 마다 가능합니다.' });
                    }
                    else {
                        this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '', detail: '잠시 후 다시 시도하세요.' });
                    }

                }

            })
    }

}