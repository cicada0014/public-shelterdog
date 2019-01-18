import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { GameTimeService } from '../../../lib/time.service';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class RunnerEndingScene extends Phaser.Scene {



    runnerName: string = ''
    otherThing: string = ''

    storyText: Phaser.GameObjects.Text;


    isPlaying: boolean = false;
    isPrompt: boolean = false;
    isDone: boolean = false;


    doneSwitch: boolean = false;

    isTextComplete: boolean = false;

    storyStep: number;


    storyLine

    nextTextBtn: Phaser.Physics.Arcade.Image


    constructor(
        private timeService: GameTimeService,
        private http: HttpClient

    ) {
        super({
            key: 'ending'
        })

    }


    async playText(text: string) {
        this.isPlaying = true;
        let _text = '';
        for (let i = 0; i < text.length; i++) {
            if (this.doneSwitch) {
                return
            }
            await this.timeService.timeSleep(50);
            _text += text[i];
            this.storyText.setText(_text);
        }
        this.storyStep++;


        this.isTextComplete = true;
        this.nextTextBtn.setVisible(this.isTextComplete);
        this.nextTextBtn.setVelocityY(-100);
        this.isPlaying = false;

    }


    reset() {
        this.storyStep = 0
        this.runnerName = '';
    }

    preload() {
        this.load.image('arrowDown', 'assets/game/imgs/arrow-down.png');
        this.load.image('conversationWindow', 'assets/game/imgs/conversation-window.png');

        this.storyLine = [
            {
                text: `k는 여러 방해공작을 뚫고 목적지에 다다렀다.`,
                effect: null
            },
            { text: `그의 메세지는 세상 사람들의 마음을 움직였다.` },
            { text: `많은 사람들이 죄수번호 5275의 이야기를 듣고 일상 속에서 토론을 하기 시작했다.` },
            { text: `퍼포먼스가 끝난 뒤 이 절차를 모두 지켜보던 한 시민이 물었다.` },
            { text: `"오이 말고 또 싫어하는 것이 있나요?"` },
            { text: `죄수번호 5275라 불리던 그는 담담하게 이야기했다. ` },
            { text: `"물론이죠. 이제는 당당히 말 할 수 있습니다."` },
            { text: ``, prompt: true },
            { text: `이 모든 것이 세상의 편견에 맞서고자 한 당신의 용기 덕분이었다.` },
            { text: ``, end: true },
        ]
        this.storyStep = 0;
    }

    create() {
        this.cameras.main.fadeIn(1000);
        this.input.on('pointerup', (event) => {
            if (this.storyLine[this.storyStep].end) {
                if (!this.isDone) {
                    if (!localStorage.getItem('g-runner-survey')) {
                        localStorage.setItem('g-runner-survey', 'ok')
                        this.http.post('game/runner/survey', {
                            data: this.otherThing
                        })
                            .toPromise()
                            .then(r => {

                            })
                            .catch(e => {
                                console.log(e)
                            })
                    }

                    this.isDone = true
                    setTimeout(() => {
                        this.reset();
                        this.scene.start('menu')
                    }, 3000);
                    this.cameras.main.fadeOut(3000);
                }
                return
            }

            if (this.storyLine[this.storyStep].prompt) {
                if (!this.isPrompt) {
                    this.isPrompt = true
                    this.otherThing = window.prompt('싫다고 당당히 이야기 해보세요! 당신이 싫어하는 것은 무엇인가요?')
                    if (this.otherThing) {
                        this.storyLine[this.storyStep].text = this.storyLine[this.storyStep].text + ` ${this.otherThing}... 가까운 미래에, 사람들은 ${this.otherThing}에 대하여 싫다고 당당하게 이야기하고 자유롭게 이야기하는 것이 자연스러워졌다.`
                    } else {
                        this.storyLine[this.storyStep].text = `입을 열러고 했던 그는 이내 입을 꾹 다물고 말았다.
                         그럼에도 그가 말하고자 했던 바를 주위에 있던 모두가 알아차릴 수 있었다.
                         사람들은 그 후로 싫은 것에 대하여 자유로이 소통 할 수 있었다. `
                    }
                } else {
                    return
                }
            }

            this.isTextComplete = false;
            this.nextTextBtn.setVisible(this.isTextComplete);
            if (!this.isPlaying) {
                this.doneSwitch = false;
                this.storyText.setText('');
                this.playText(this.storyLine[this.storyStep].text);
            } else {
                this.doneSwitch = true;
                setTimeout(() => {
                    this.storyText.setText(this.storyLine[this.storyStep].text)
                    this.isTextComplete = true;
                    this.nextTextBtn.setVisible(this.isTextComplete);
                    this.storyStep++;
                    this.isPlaying = false;
                }, 50);
            }
        })

        var rect = new Phaser.Geom.Rectangle(0, this.game.canvas.height * 2 / 3, this.game.canvas.width, this.game.canvas.height / 3);
        let grp = this.add.graphics({ x: null, y: null, fillStyle: { color: 0x0000ff, alpha: 1 } })
        grp.fillRectShape(rect)

        this.add.image(400, this.game.canvas.height - (135 / 2), 'conversationWindow')





        this.storyText = this.add.text(
            50,
            (this.game.canvas.height - (135 / 2)) - 25,
            '',
            {
                width: `${this.game.canvas.width - 50}px`,
                height: `${(this.game.canvas.height / 3) - 50}px`,
                color: '#000', 'font-size': '15px  ',
                fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
            });

        this.nextTextBtn = this.physics.add.image(this.game.canvas.width / 2 - 20, this.game.canvas.height - 20, 'arrowDown')
        this.nextTextBtn.setCollideWorldBounds(true);
        this.nextTextBtn.setBounce(0.5);
        this.nextTextBtn.setVisible(this.isTextComplete);

        this.playText(this.storyLine[this.storyStep].text);






    }

    // update는 루프 문이다.
    update() {


    }
}


