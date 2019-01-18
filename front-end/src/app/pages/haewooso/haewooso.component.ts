

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import * as moment from 'moment';
import { HaewoosoArticlesAttribute, UsersAttribute } from 'src/app/types/schema.types';
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/redux/root.reducer';
import { showLoginModal } from 'src/app/redux/event/event.action';

@Component({
    selector: 'app-haewooso',
    templateUrl: 'haewooso.component.html',
    styleUrls: ['haewooso.component.scss']
})

export class HaewoosoComponent implements OnInit {



    userId;
    isAdmin;
    @select(['user', 'currentUser']) currentUser$: Observable<UsersAttribute>;
    infiniteList = [];
    infiniteListMap = new Map<number, any>();
    progressDisplay: boolean;

    articleRow: number = 20
    constructor(
        private http: HttpClient,
        private ngRedux: NgRedux<AppState>
    ) {
        this.currentUser$.subscribe((data) => {
            if (data) {
                this.isAdmin = data.isAdmin;
                this.userId = data.id
            } else {
                this.isAdmin = false;
            }
        })
    }

    clearInfiniteList() {
        this.infiniteList.length = 0;
        this.infiniteListMap.clear();
    }

    ngOnInit() {

        this.clearInfiniteList();
        this.appendItems(0);

    }



    displayDelTime(article: HaewoosoArticlesAttribute) {
        return `${Math.ceil(moment(article.created_at).add(1, 'd').diff(moment()) / (1000 * 60 * 60))}시간 뒤 삭제`
    }


    convertTime(article: HaewoosoArticlesAttribute) {
        if (!article) {
            return
        }


        return moment(article.created_at).format('MM-DD HH:mm');

        // const _diffNow = moment().diff(moment(article.created_at), 'm');
        // if (_diffNow < 1) {
        //     return '방금 전'
        // } else if (_diffNow >= 1 && _diffNow < 60) {
        //     return `${Math.floor(_diffNow)}분 전`
        // } else if (_diffNow >= 60 && _diffNow < 1440) {
        //     if (moment().date() != moment(article.created_at).date()) {
        //         return moment(article.created_at).format('YY-MM-DD')
        //     } else {
        //         return moment(article.created_at).format('HH:mm')
        //     }
        // }
        // else {
        //     return moment(article.created_at).format('YY-MM-DD')
        // }

    }

    deleteConfirmArticle(article: HaewoosoArticlesAttribute) {

        let isConfirm = confirm('정말 삭제하시겠습니까?');
        if (isConfirm) {
            this.http
                .delete(`haewooso/article/${article.id}`)
                .toPromise()
                .then(r => {
                    console.log(r)
                    this.clearInfiniteList();
                    this.appendItems(0);
                    alert('삭제되었습니다.')
                })
                .catch(e => {
                    console.log(e)
                })
        }






    }


    onScrollUp($event) {

    }
    onScrollDown($event) {
        if (this.infiniteList.length > 0) {
            this.progressDisplay = true;
            const first = this.infiniteList.length;
            this.appendItems(first);
        }

    }


    uploadCompleate() {
        this.clearInfiniteList();
        this.appendItems(0);
    }



    checkExpandFoldArticle(article, i) {
        let target = document.querySelector(`#real-content` + i);
        if (target) {
            if (target.clientHeight > 70) {
                return true
            }
        }
        return false;

    }



    appendItems(first) {
        this.http
            .get(`haewooso/article/list`, { params: { first: first + '', rows: this.articleRow + '' } })
            .toPromise()
            .then(r => {
                // console.log(r);
                let _temp = [];
                for (let article of r as any) {
                    if (!this.infiniteListMap.has(article.id)) {
                        this.infiniteListMap.set(article.id, null);
                        _temp.push(article);
                        if (article.GraphObject && article.GraphObject.GraphEdges) {
                            setTimeout(() => {
                                for (let me of article.GraphObject.GraphEdges) {
                                    if (me.GraphObject) {
                                        // article.isMe = true;
                                        article.meEdge = me;
                                        return;
                                    }
                                }
                            }, 0);
                        }
                    }
                }

                this.infiniteList = this.infiniteList.concat(_temp);
                this.progressDisplay = false;

            })
            .catch(e => {
                this.progressDisplay = false;
                console.log(e)
            })

    }


    empathyAction($event: TouchEvent, article: HaewoosoArticlesAttribute) {
        $event.stopPropagation();
        if (article.meEdge) {
            this.cancelEmpathy(article)
        } else {
            this.empathyArticle(article)
        }
    }

    empathyArticle(article: HaewoosoArticlesAttribute) {
        this.http
            .post(`haewooso/${article.id}/empathy`, null)
            .toPromise()
            .then(r => {
                // console.log(r)
                if (article.GraphObject) {
                    article.GraphObject.GraphEdges.push(r);
                } else {
                    article.GraphObject = {};
                    article.GraphObject.GraphEdges = []
                    article.GraphObject.GraphEdges.push(r);
                }
                article.meEdge = r as any;
            })
            .catch(e => {
                console.log(e)
                if (e.status == 401) {
                    this.ngRedux.dispatch(showLoginModal(true))
                }

            })

    }

    cancelEmpathy(article: HaewoosoArticlesAttribute) {
        this.http
            .delete(`haewooso/empathy/${article.meEdge.id}`)
            .toPromise()
            .then(r => {

                let targetIndex = article.GraphObject.GraphEdges.findIndex(edge => edge.id == article.meEdge.id);
                article.GraphObject.GraphEdges.splice(targetIndex, 1);
                delete article.meEdge;
            })
            .catch(e => {
                console.log(e)
            })
    }


    commentToArticle(article: HaewoosoArticlesAttribute, commentForm) {

        if (!commentForm.value) {
            alert('내용을 입력하세요.')
            return
        }

        this.http
            .post(`haewooso/comment`,
                {
                    content: commentForm.value,
                    haewooso_article_id: article.id

                })
            .toPromise()
            .then(r => {
                commentForm.value = '';
                article.HaewoosoArticleComments.push(r)
                alert('댓글을 작성했습니다.');
            })
            .catch(e => {
                console.log(e)
                if (e.status == 401) {
                    this.ngRedux.dispatch(showLoginModal(true))
                } else {
                    alert('작성 실패');
                }

            })
    }

    deleteCommmentConfirm(comments: Array<any>, comment) {
        let isConfirm = confirm('정말 삭제하시겠습니까?');
        if (isConfirm) {
            this.http
                .delete(`haewooso/comment/${comment.id}`)
                .toPromise()
                .then(r => {
                    alert('삭제되었습니다.')
                    let targetIndex = comments.findIndex(c => c.id == comment.id);
                    console.log(targetIndex)
                    if (targetIndex > -1) {
                        comments.splice(targetIndex, 1)
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }

    deleteArticle() {

    }




}