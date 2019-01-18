


import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { responses } from './cider-opponent-response/response';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { DeviceAttribute } from 'src/app/redux/device/device.action';
import { GameTimeService } from '../lib/time.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-game-cider',
    templateUrl: 'game.cider.component.html',
    styleUrls: ['game.cider.component.scss'],
    providers: [MessageService]
})

export class GameCiderComponent implements OnInit {


    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    msgs: any[] = [];
    step = 0;
    text = '';


    game_id: number = 1;


    isReady: boolean = false;
    placeholder = '';


    todayText = `${moment().year()}년 ${moment().month() + 1}월 ${moment().date()}일`


    isMsgTimeout;

    opponent = {
        name: '',
        type: ''
    }

    isMobile
    oppCase: string;
    myCase: number = 0;

    isDone: boolean = false;

    watingBubble = "."

    annoucereMents;
    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private timeService: GameTimeService,
        private titleService: Title
    ) {
        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })
        this.annoucereMents = [
            '상대방이 말을 하고 있습니다.',
            // '상대방이 당황해서 어쩔줄 몰라 합니다. 조금 기다려주세용',
            // '상대방이 말을 하고 있습니다.',
            // '상대방이 말을 하고 있습니다.',
            // '상대방이 말을 하고 있습니다.',
            // '상대방이 말을 하고 있습니다.',
        ]


        setInterval(() => {
            if (this.watingBubble.length > 3) {
                this.watingBubble = ''
            }
            this.watingBubble += '.';
        }, 500)


    }

    startGame() {
        if (!this.opponent.type) {
            this.messageService.add({ severity: 'warn', summary: '상대방 유형', detail: '상대방 유형을 선택하세요.' });
            return
        }
        if (!this.opponent.name) {
            this.messageService.add({ severity: 'warn', summary: '상대방 이름', detail: '상대방 이름을 입력하세요.' });
            return
        }

        this.placeholder = `${this.opponent.name}에게 하고 싶었던 말을 시원하게 해보세요! ex) 너나 잘하세요 제발 진짜; 맨날 위에 깨져놓고는 나한테 괜히 스트레스 풀지 말고 알겠냐?`

        this.isReady = true;
    }




    postMsg(msg: { type, name, step, text }) {
        this.http
            .post('game/cider/msg', msg)
            .toPromise()
            .catch(e => {
                console.log(e)
            })
    }


    opponentTypingMsg() {

    }







    async executeMsg() {
        if (this.isMsgTimeout) {
            this.messageService.add({ severity: 'info', summary: '잠시만요', detail: '상대방이 글을 작성중입니다...' });
            return
        }
        let myMsg = { text: this.text, who: 'me', time: `${moment().format('a') == 'am' ? '오전' : '오후'} ${moment().format('h:mm')}`, isRead: false }
        this.postMsg({ text: this.text, type: this.opponent.type, name: this.opponent.name, step: this.step })
        this.msgs.push(myMsg);
        this.text = '';
        setTimeout(() => {
            document.querySelector('#chatroom').scrollTo(0, (document.querySelector('#chatroom').scrollHeight + 100))
        }, 0);

        myMsg.isRead = true;
        await new Promise((resolve, reject) => {
            this.isMsgTimeout = setTimeout(() => {
                resolve(this.isMsgTimeout)
            }, Math.floor(Math.random() * 2000));
        })

        await this.timeService.timeSleep(Math.floor(Math.random() * 1000) + 1000)


        let candidatedMsgs;
        let oppMsg
        switch (this.step) {
            case 0:
                this.oppCase = Math.floor(Math.random() * 2) > 0 ? 'apology' : 'counter';
                if (this.oppCase == 'counter') {
                    this.placeholder = `화가 난 ${this.opponent.name}에게 욕을 하며 약점을 가지고 더욱 괴롭혀보세요! ex) 어휴 이 정신나간새x 너 저번에 애들 실적 다 가로채고 법인카드도 니 멋대로 쓰고 다녔지?? 미친x`
                }
                candidatedMsgs = responses[this.opponent.type]['step' + this.step][this.oppCase];
                oppMsg = { text: candidatedMsgs[Math.floor(Math.random() * candidatedMsgs.length)], who: 'opp', time: `${moment().format('a') == 'am' ? '오전' : '오후'} ${moment().format('h:mm')}`, isRead: false }
                this.msgs.push(oppMsg);
                this.step++;
                setTimeout(() => {
                    document.querySelector('#chatroom').scrollTo(0, (document.querySelector('#chatroom').scrollHeight + 100))
                    this.isReady = false;
                    this.isMsgTimeout = 0;
                }, 0);
                break;
            case 1:
                candidatedMsgs = responses[this.opponent.type]['step' + this.step][this.oppCase];
                oppMsg = { text: candidatedMsgs[Math.floor(Math.random() * candidatedMsgs.length)], who: 'opp', time: `${moment().format('a') == 'am' ? '오전' : '오후'} ${moment().format('h:mm')}`, isRead: true }
                this.msgs.push(oppMsg);
                this.step++;
                setTimeout(() => {
                    document.querySelector('#chatroom').scrollTo(0, (document.querySelector('#chatroom').scrollHeight + 100))
                    this.isReady = false;
                    this.isMsgTimeout = 0;
                }, 0);
                break;
            case 2:
                candidatedMsgs = responses[this.opponent.type]['step' + this.step][this.oppCase];
                oppMsg = { text: candidatedMsgs[Math.floor(Math.random() * candidatedMsgs.length)], who: 'opp', time: `${moment().format('a') == 'am' ? '오전' : '오후'} ${moment().format('h:mm')}`, isRead: true }
                this.msgs.push(oppMsg);
                this.step++;
                setTimeout(() => {
                    document.querySelector('#chatroom').scrollTo(0, (document.querySelector('#chatroom').scrollHeight + 100))
                    // this.isReady = false;
                    this.isDone = true;
                    this.isMsgTimeout = 0;
                }, 0);
                break;
        }


        // this.http
        //     .post('game/cider/text', {
        //         step: this.step,
        //         text: this.text
        //     })
        //     .toPromise()
        //     .then((r: any) => {
        //         this.step++;
        //         this.msgs.push({ text: r.msg, who: 'opp', time: `${moment().format('a') == 'am' ? '오전' : '오후'} ${moment().format('h:mm')}` })
        //         this.text = '';
        //         setTimeout(() => {
        //             document.querySelector('#chatroom').scrollTo(0, (document.querySelector('#chatroom').scrollHeight + 100))
        //         }, 0);
        //         if (this.step == 3) {
        //             this.step = 0;
        //         }
        //     })
        //     .catch(e => {
        //         console.log(e)
        //     })
    }

    retry() {
        this.isDone = false;
        this.isReady = false;
        this.text = '';
        this.opponent.name = ''
        this.opponent.type = '';
        this.step = 0;
        this.msgs.length = 0;
    }


    preventFoucesing($event) {
        $event.preventDefault();
    }


    async choiceEvent(target: string) {
        this.text = '';
        this.oppCase = target
        if (this.oppCase == 'ignore') {
            this.isReady = true;
            await this.timeService.timeSleep(1000);
            this.isMsgTimeout = 1;
            this.msgs[this.msgs.length - 1].isRead = true;
            // Math.floor(Math.random() * 2000)
            await this.timeService.timeSleep(Math.floor(Math.random() * 1000) + 1000);
            const candidatedMsgs = responses[this.opponent.type]['step' + this.step][this.oppCase];
            for (let i = 0; i < candidatedMsgs.length; i++) {
                let msgText = candidatedMsgs[i];
                let oppMsg = { text: msgText, who: 'opp', time: `${moment().format('a') == 'am' ? '오전' : '오후'} ${moment().format('h:mm')}`, isRead: true }
                await this.timeService.timeSleep((msgText.length > 25 ? 25 : msgText.length) * 100);
                this.msgs.push(oppMsg);
                setTimeout(() => {
                    document.querySelector('#chatroom').scrollTo(0, (document.querySelector('#chatroom').scrollHeight + 100))
                }, 0);
            }
            await this.timeService.timeSleep(20 * 100);
            this.step++;
            this.isReady = false;
            this.isMsgTimeout = 0;
            this.placeholder = `아직도 정신을 못차린 ${this.opponent.name}에게 신나게 욕을 퍼부어보세요! ex) 미친x 아직도 정신 못차렸냐?? 진짜 싸이코새x였네 내 발바닥이나 핥아라 그러면 한번 생각해볼게^^`
        } else if (this.oppCase == 'response') {
            this.isReady = true;
            await this.timeService.timeSleep(1000);
            this.msgs[this.msgs.length - 1].isRead = true;
        } else if (this.oppCase == 'fuck') {
            this.isReady = true;
        } else if (this.oppCase == 'tolerance') {
            this.isReady = true;
            this.msgs.push({ text: `ᄏᄏᄏᄏ봐달라고?? 멍청한 새x 내가 앞으로 너 하는거 지켜본다^^ 잘해라 ${this.opponent.name}. 앞으로 나 보면 고개 숙이고 ~ 알겠냐~?`, who: 'me', time: `${moment().format('a') == 'am' ? '오전' : '오후'} ${moment().format('h:mm')}`, isRead: true })
            setTimeout(() => {
                document.querySelector('#chatroom').scrollTo(0, (document.querySelector('#chatroom').scrollHeight + 100))
            }, 0);
            this.placeholder = `추가적으로 더 말을 해서 더 시원한 쾌감을 얻어보세요! ex) 너는 더 욕먹어도 싸 이 새x야 너 한번만 더 까불어봐라 그때는 기대해도 좋을거야^^ 등x아`
        }

    }


    ignore() {

    }
    messageResponse() {

    }


    sendMsg($event: KeyboardEvent | MouseEvent) {
        if (!this.opponent.type) {
            this.messageService.add({ severity: 'warn', summary: '호오...', detail: '어떻게 들어왔는지는 모르겠지만...' });
            return
        }
        if (!this.opponent.name) {
            this.messageService.add({ severity: 'warn', summary: '후후', detail: '그렇게 허술하진 않습니다...후후' });
            return
        }

        if (!this.text) {
            return
        }

        if ($event instanceof MouseEvent) {
            this.executeMsg();
        } else if ($event instanceof KeyboardEvent) {

            if ($event.keyCode == 13) {
                if (!$event.ctrlKey && !$event.altKey && !$event.metaKey) {
                    this.executeMsg();
                }

            }
        }

    }

    ngOnInit() {
        this.titleService.setTitle('사이다 톡 ')
    }
}