


import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { select } from '@angular-redux/store';
import { DeviceAttribute } from 'src/app/redux/device/device.action';
import { Observable } from 'rxjs';


declare let Kakao;



@Component({
    selector: 'app-game-evaluation',
    templateUrl: 'game-evaluation.component.html',
    styleUrls: ['game-evaluation.component.scss']
})

export class GameEvaluationComponent implements OnInit {

    @Input(`game_id`) game_id;
    @Input(`game_title`) game_title;
    @Input(`game_image`) game_image;
    @Input(`game_description`) game_description;
    @Input(`placeholder`) placeholder;
    @Input(`injected_text`) injectedText;

    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;


    isMobile: boolean;


    nicknameValue = '멍멍이';

    clientIp: string;


    items;


    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })

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

    goToAbout() {
        this.router.navigateByUrl('about')
    }

    getClientIp() {
        return this.http
            .jsonp('https://api.ipify.org/?format=jsonp', 'callback')
            .toPromise()
            .then((r: any) => {
                this.clientIp = r.ip;
            })
            .catch(e => {
                console.log(e)
            })
    }


    convertTime() {
        moment()
    }


    ngOnInit() {
        this.getClientIp();
        this.getEvaluationList();
        // this.initShareKakaoLink();
    }

    initShareKakaoLink() {
        // // 카카오링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.
        setTimeout(() => {
            Kakao.Link.createDefaultButton({
                container: document.querySelector('#kakao-link-btn'),
                objectType: 'feed',
                content: {
                    title: `Shelter Dog : ${this.game_title}`,
                    description: this.game_description,
                    imageUrl: `${this.game_image}`,
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href
                    }
                },
            });
        }, 0);
    }



    convertIp(ipAddr: string) {
        if (ipAddr) {
            let result = ipAddr.split('.')
            return `${result[0]}.${result[1]}.*.*`
        }
    }


    getEvaluationList() {
        this.http
            .get(`game/evaluation/list`, { params: { game_id: this.game_id } })
            .toPromise()
            .then(r => {
                this.items = r as any;
            })
            .catch(e => {
                console.log(e)
            })
    }


    async registEvaluation(evaluationForm) {
        if (!this.nicknameValue) {
            alert('닉네임을 적으세요.')
        }

        if (!evaluationForm.value) {
            alert('내용을 적으세요.')
            return
        }

        if (!this.clientIp) {
            await this.getClientIp()
        }


        this.http
            .post('game/evaluation', {
                ip: this.clientIp,
                content: evaluationForm.value,
                game_id: this.game_id,
                nickname: this.nicknameValue
            })
            .toPromise()
            .then(r => {
                console.log(r)
                evaluationForm.value = '';
                alert('의견이 등록되었습니다.')
                this.getEvaluationList();
            })
            .catch(e => {
                if (e.status == 400) {
                    alert('도배로 판단되어 차단되었습니다. 일정 시간 이후 다시 이용 하실 수 있습니다.')
                }
                console.log(e)
            })



    }
}