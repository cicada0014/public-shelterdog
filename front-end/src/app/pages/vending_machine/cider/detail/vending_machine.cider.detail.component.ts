



import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { VendingMachineItemsAttribute, VendingMachineItemCommentsAttribute, UsersAttribute } from 'src/app/types/schema.types';
import { NguCarouselConfig, NguCarouselStore, NguCarousel } from '@ngu/carousel';
import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'src/app/redux/root.reducer';
import { showLoginModal } from 'src/app/redux/event/event.action';
import { ConfirmationService, MessageService } from 'primeng/api';
import { isNull } from 'util';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DeviceAttribute } from 'src/app/redux/device/device.action';


declare let Kakao: any;

@Component({
    selector: 'app-vending-machine-cider-detail',
    templateUrl: 'vending_machine.cider.detail.component.html',
    styleUrls: ['vending_machine.cider.detail.component.scss'],
    providers: [MessageService, ConfirmationService]
})

export class VendingMachineCiderDetailComponent implements OnInit {

    @ViewChild('commentFormRef') commentFormRef: ElementRef;



    isExpansion: boolean = false;

    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    @select(['user', 'currentUser']) currentUser$: Observable<UsersAttribute>;
    @ViewChild('myCarousel') pageCarousel: NguCarousel<NguCarouselStore>;





    comentFormTarget: VendingMachineItemCommentsAttribute = {};


    isAdmin: boolean = false;
    userId: any;

    itemId: number;
    item: VendingMachineItemsAttribute
    recommendationItemList: VendingMachineItemsAttribute[] = [];

    isMobile: boolean = false;

    public carouselTile: NguCarouselConfig = {
        grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
        slide: 10,
        speed: 250,
        point: {
            visible: false
        },
        load: 2,
        velocity: 0,
        touch: true,
        easing: 'cubic-bezier(0, 0, 0.2, 1)'
    };
    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private ngRedux: NgRedux<AppState>,
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router





    ) {

        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile
        })
        this.currentUser$.subscribe((data) => {
            if (data) {
                this.userId = data.id;
                this.isAdmin = data.isAdmin
            }
        })
    }

    pageControl(prev?) {
        // if (prev) {
        //     if (this.pageCarousel.activePoint > 0) {
        //         this.pageCarousel.activePoint--;
        //         this.pageCarousel.moveToSlide('', this.pageCarousel.activePoint, false);
        //     }
        // } else {
        //     this.pageCarousel.activePoint++;
        //     this.pageCarousel.moveToSlide('', this.pageCarousel.activePoint, false);
        // }
    }

    initShareKakaoLink() {
        // // 카카오링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.
        Kakao.Link.createDefaultButton({
            container: document.querySelector('#kakao-link-btn'),
            objectType: 'feed',
            content: {
                title: `쉘터독 자판기 : ${this.item.title}`,
                description: '공감과 사이다의 공간 Shelter Dog',
                imageUrl: this.item.thumbnail,
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href
                }
            },
        });
        setTimeout(() => {
        }, 1000);
    }


    test() {
        // console.log(this.pageCarousel)
    }


    shareFB() {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}%2F&amp;src=sdkpreparse`, '_blank');
    }


    expanseContent() {
        let _point
        if (this.isExpansion == false) {
            // this.pageCarousel.
            _point = this.pageCarousel.activePoint
        }
        this.isExpansion = this.isExpansion ? false : true

        setTimeout(() => {

            if (this.isExpansion) {

                let images: any = document.querySelectorAll('.expansion-image')
                window.scrollTo(0, images[_point].offsetTop)

            } else {
                let wrapper: any = document.querySelector('.carosel-wrapper');
                window.scrollTo(0, wrapper.offsetTop);
            }




        }, 0);


    }


    getRecommendationList() {

        let tagTargets = [];
        this.item.VendingMachineItemHashTags.forEach(itemTag => {
            if (itemTag.representation) {
                tagTargets.push(itemTag)
            }
        })
        let tag_id = tagTargets[Math.floor(Math.random() * tagTargets.length)].tag_id;
        let tag_id_two = this.item.VendingMachineItemHashTags.find(itemTag => itemTag.tag_id != tag_id).tag_id;
        this.http
            .get('vendingmachine/recommendation/list',
                {
                    params:
                    {
                        item_id: this.itemId + '',
                        tag_id: tag_id + '',
                        tag_id_two: tag_id_two + '',
                        mobile: this.isMobile ? 'true' : ''
                    }
                })
            .toPromise()
            .then(r => {
                this.recommendationItemList = r as any;
            })
            .catch(e => {
                console.log(e)
            })



    }



    likeAction() {
        if (this.item.meEdge) {
            this.dislikeThisItem()
        } else {
            this.likeThisItem();
        }

    }

    likeThisItem() {

        this.http
            .post(`vendingmachine/like/${this.itemId}`, null)
            .toPromise()
            .then(r => {
                if (this.item.GraphObject) {
                    this.item.GraphObject.GraphEdges.push(r);
                } else {
                    this.item.GraphObject = {};
                    this.item.GraphObject.GraphEdges = []
                    this.item.GraphObject.GraphEdges.push(r);
                }
                this.item.meEdge = r as any;
            })
            .catch(e => {
                console.log(e)
                if (e.status == 401) {
                    this.ngRedux.dispatch(showLoginModal(true))
                } else {
                    alert('잠시 후 시도하세요.')
                }
            })


    }
    dislikeThisItem() {
        this.http
            .delete(`vendingmachine/like/${this.item.meEdge.id}`)
            .toPromise()
            .then(r => {
                let targetIndex = this.item.GraphObject.GraphEdges.findIndex(edge => edge.id == this.item.meEdge.id);
                this.item.GraphObject.GraphEdges.splice(targetIndex, 1);
                delete this.item.meEdge;
            })
            .catch(e => {
                console.log(e)
                if (e.status == 401) {
                    this.ngRedux.dispatch(showLoginModal(true))
                } else {
                    alert('잠시 후 시도하세요.')
                }
            })

    }

    ngAfterViewInit() {

        // setTimeout(() => {
        //     console.log(this.pageCarousel)
        // }, 2000);
    }


    shareClick() {
        (<any>window).ga('send', 'event', {
            eventCategory: 'share',
            eventLabel: 'kakao_cider',
            eventAction: 'click',
            eventValue: 1
        });
    }


    getData(hit?: boolean) {
        this.http
            .get('vendingmachine/item/' + this.itemId, {
                headers: {
                    "x-hit-read": hit ? 'yes' : 'no'
                }
            })
            .toPromise()
            .then(r => {
                this.item = r as any;
                if (this.item.GraphObject && this.item.GraphObject.GraphEdges) {
                    setTimeout(() => {
                        for (let me of this.item.GraphObject.GraphEdges) {
                            if (me.GraphObject) {
                                // article.isMe = true;
                                this.item.meEdge = me;
                                return;
                            }
                        }
                    }, 0);
                }
                this.getRecommendationList();
                setTimeout(() => {
                    this.initShareKakaoLink();
                }, 0);
            })
            .catch(e => {
                console.log(e)
            })
    }

    ngOnInit() {


        this.route.params.subscribe(data => {
            this.itemId = data.id
            this.isExpansion = false;
            console.log(this.pageCarousel)
            if (this.pageCarousel) {
                this.pageCarousel.currentSlide = 0;
                this.pageCarousel.reset()
                // this.pageCarousel.moveTo(0);
            }
            this.getData(true);


        })
    }




    goList() {
        this.router.navigateByUrl('vending_machine/cider/list');
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
                            alert('보안되지 않은 사이트의 이미지는 넣을 수 없습니다.');
                            // this.messageService.add({ key: this.articleToastKey, severity: 'warn', summary: '이미지', detail: '보안되지 않은 사이트의 이미지는 넣을 수 없습니다.' })
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


    convertTime(time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }

    registComment(userCommentForm) {
        if (!userCommentForm.value) {
            alert('내용을 입력하세요.')
            return
        };

        let content: string = userCommentForm.value;
        if (content) {
            if (this.detectingMaliciousContent(content)) {
                return
            }
            content = content.replace(/\n/, '<br>')

        } else {

            return
        }
        let comment: VendingMachineItemCommentsAttribute = {
            item_id: this.itemId,
            content: content,
        }

        this.http
            .post('vendingmachine/comment', comment)
            .toPromise()
            .then(r => {
                userCommentForm.value = '';
                this.getData(false);
                // this.item.VendingMachineItemComments.push(r);
                alert('댓글을 작성했습니다.');
            })
            .catch(e => {
                console.log(e)
                if (e.status == 401) {
                    this.ngRedux.dispatch(showLoginModal(true))
                } else {
                    if (e.error.message == 'banned user') {
                        // this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '', detail: '차단된 사용자입니다.' });
                        alert('차단된 사용자')
                    }
                    else if (e.error.message == 'Available in 1 minute') {
                        alert('도배 방지. 1분내로 다시 작성할 수 없습니다.')
                        // this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '', detail: '글 작성 뒤 바로 작성 할 수 없습니다. 1분 마다 가능합니다.' });
                    }
                    else {
                        alert('잠시 후 다시 시도하세요.')
                        // this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '', detail: '잠시 후 다시 시도하세요.' });
                    }

                }
            })


    }

    deleteComment(comment: VendingMachineItemCommentsAttribute) {
        this.confirmationService.confirm({
            key: 'delete',
            message: '정말 삭제 하시겠습니까? 삭제하면 내용이 복구 되지 않습니다.',
            accept: () => {
                this.http
                    .delete(`vendingmachine/comment/${comment.id}`, {
                        headers: {
                            'x-comment-parent': comment.parent ? 'false' : 'true'
                        }
                    })
                    .toPromise()
                    .then(r => {
                        // this.getArticle();
                        this.getData(false);
                        // this.messageService.add({ key: this.articleToastKey, severity: 'info', summary: '삭제', detail: '이 댓글을 삭제하였습니다.' });
                        // let i = this.item.VendingMachineItemComments.findIndex(c => c.id == comment.id);
                        // this.item.VendingMachineItemComments.splice(i, 1);
                        alert('댓글이 삭제되었습니다.')
                    })
                    .catch(e => {
                        console.log(e)
                    })

            }
        })
    }





    commentToComment(commentFormRef) {
        if (!commentFormRef.value) {
            alert('내용을 입력하세요.')
            // this.messageService.add({ key: this.articleToastKey, severity: 'warn', summary: '내용', detail: '내용을 입력하세요.' });
            return
        }


        this.http
            .post(`vendingmachine/comment/tocomment`, {
                content: commentFormRef.value,
                item_id: this.comentFormTarget.item_id,
                parent: this.comentFormTarget.parent ? this.comentFormTarget.parent : this.comentFormTarget.id,
                mention_id: this.comentFormTarget.user_id
            })
            .toPromise()
            .then(r => {
                document.querySelector('app-vending-machine-cider-detail').appendChild(document.querySelector('#commentForm'))
                commentFormRef.value = '';
                this.getData(false);
            })
            .catch(e => {
                console.log(e)
                if (e.status == 401) {
                    this.ngRedux.dispatch(showLoginModal(true));
                } else {
                    if (e.error.message == 'banned user') {
                        alert('차단된 사용자입니다.')
                        // this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '', detail: '차단된 사용자입니다.' });
                    }
                    else if (e.error.message == 'Available in 1 minute') {
                        alert('도배 방지. 댓글을 단 후에 1분 뒤 작성가능합니다.')
                        // this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '', detail: '글 작성 뒤 바로 작성 할 수 없습니다. 1분 마다 가능합니다.' });

                    }
                    else {
                        alert('잠시 후 다시 시도하십시오.')
                        // this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '', detail: '잠시 후 다시 시도하세요.' });
                    }
                }
            })

    }


    updateComment(comment: VendingMachineItemCommentsAttribute) {
        if (this.comentFormTarget.isUpdate) {
            delete this.comentFormTarget.isUpdate
        }
        this.comentFormTarget = comment;
        this.comentFormTarget.isUpdate = true;
        this.commentFormRef.nativeElement.value = comment.content;
        document.querySelector('#comment' + comment.id).appendChild(document.querySelector('#commentForm'))
    }

    appendcommentForm(comment: VendingMachineItemCommentsAttribute) {
        if (this.comentFormTarget.isUpdate) {
            delete this.comentFormTarget.isUpdate
        }
        this.comentFormTarget = comment;
        this.commentFormRef.nativeElement.value = '';
        document.querySelector('#comment' + comment.id).appendChild(document.querySelector('#commentForm'))
    }

    reportComment(commentId) {
        this.confirmationService.confirm({
            key: 'report',
            message: '신고하시겠습니까?',
            accept: () => {
                this.http
                    .post(`vendingmachine/comment/${commentId}/report`, null)
                    .toPromise()
                    .then(r => {
                        alert('댓글을 신고하였습니다.')
                    })
                    .catch(e => {
                        console.log(e)
                        if (e.status == 401) {
                            this.ngRedux.dispatch(showLoginModal(true))
                        } else if (e.status == 400) {
                            if (e.error.name == "SequelizeUniqueConstraintError") {
                                alert('이미 신고를 하셨습니다.')
                                // this.messageService.add({ key: this.articleToastKey, severity: 'warn', summary: '중복 신고', detail: '이미 신고를 하셨어요!' });
                            }
                        }
                    })

            }
        })







    }
    registerUpdateComment(commentFormRef) {
        if (!commentFormRef.value) {
            alert('내용을 입력하셍.')
            // this.messageService.add({ key: this.articleToastKey, severity: 'warn', summary: '내용', detail: '내용을 입력하세요.' });
            return
        }
        if (this.detectingMaliciousContent(commentFormRef.value)) {
            return
        }

        // commentFormRef.value = this.sanitizer.sanitize(SecurityContext.HTML, commentFormRef.value);
        this.http
            .patch(`vendingmachine/comment/${this.comentFormTarget.id}`, {
                content: commentFormRef.value,
                // anonymous: this.isCommentAnonymous
            })
            .toPromise()
            .then(r => {
                document.querySelector('app-vending-machine-cider-detail').appendChild(document.querySelector('#commentForm'))
                commentFormRef.value = '';
                this.getData(false);
            })
            .catch(e => {
                console.log(e)
                if (e.status == 401) {
                    // this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '로그인 필요', detail: '댓글을 수정하려면 로그인이 필요합니다.' });
                    // this.showLoginDialog();
                    // this.ngRedux.dispatch(setCurrentUser(null))
                    this.ngRedux.dispatch(showLoginModal(true));
                } else {
                    // this.messageService.add({ key: this.articleToastKey, severity: 'error', summary: '', detail: '잠시 후 다시 시도하세요.' });
                    alert('잠시 후 다시 시도하세요.')
                }
            })

    }
    cancelUpdateComment() {
        if (this.comentFormTarget.isUpdate) {
            delete this.comentFormTarget.isUpdate
        }
        document.querySelector('app-vending-machine-cider-detail').appendChild(document.querySelector('#commentForm'))
    }


}