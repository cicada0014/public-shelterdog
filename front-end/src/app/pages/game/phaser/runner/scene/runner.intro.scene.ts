import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { GameTimeService } from '../../../lib/time.service';


@Injectable()
export class RunnerIntroScene extends Phaser.Scene {


    storyText: Phaser.GameObjects.Text;


    isPlaying: boolean = false;
    doneSwitch: boolean = false;


    skipBtn;


    isDone: boolean = false;




    isTextComplete: boolean = false;

    storyStep: number = 0;
    storyReady = [
        {
            text: `20xx년 가을 어느날…. 
            대한민국의 평범한 청년 k는 친구들과 다같이 김밥을 먹고 있었다.
             `,
            image: 'vsVillain',
            rvColor: '#000',
            effect: null
        },
        { text: `평소 오이를 싫어하던 k는 김밥에서 오이를 골라내었다. 그에게 오이 향은 끔찍했다.` },
        { text: `그걸 본 한 친구가 k에게 "오이를 왜 안먹냐? 애도 아니고" 라고 하였다. ` },
        { text: `k는 늘상 겪던 질문이라 "응. 그냥 싫어서" 라고 대답을 했다.` },
        { text: `그러자 친구들은 k에게 핀잔을 주었다.  "다 커가지구 편식이나 하구 이그" ` },
        { text: `k는 불편해졌다.` },
        { text: `k가 말했다. "왜? 오이를 싫어할 수도 있잖아."` },
        { text: `다른 친구가 빈정거렸다. "빼애애액! 알았어 오이 먹지마 그럼" ` },
        { text: 'k 너무 화가 났다.', image: 'k', rvColor: '#fff' },
        { text: `'요즘에는 덕후니 뭐니 해서 좋아하는 거를 개인의 취향이라고 인정해주는데... '` },
        { text: `'싫어할 수도 있잖아. 내가 누구한테 피해주는 것도 아니고... ` },
        { text: `'내가 죄인이야?' ` },
        { text: `여기 까지 생각이 미치자  k는 스스로를 죄인이라 칭했다.` },
        { text: `싫어하는 것을 자유롭게 이야기하지 못하는 세상에서는 죄인과 다를바 없다고 생각했기 때문이다.` },
        { text: `5275라는 죄수번호를 달고 그는 달리기로 했다. 일종의 퍼포먼스였다.` },
        { text: `'죄수번호 5275... 내가 던지는 이 메세지가 사회에 받아들여지지 못한다면 나는 그저 범죄자로 남을 뿐이다.'` },
        { text: `그가 달리기 시작하자 많은 방해공작들이 k를 향해 들어왔다. 그의 의지를 끊기 위함이었다.` },
        { text: '싫어하는 것을 자유롭게 소통할 수는 없는가? 이 질문을 세상 사람들에게 전하기 위해 죄수번호 5275는 그렇게 문 밖을 향해 달려나갔다...', end: true },
    ]
    storyLine = {

    }

    nextTextBtn: Phaser.Physics.Arcade.Image


    constructor(
        private timeService: GameTimeService

    ) {
        super({
            key: 'intro'
        })

    }


    async playText(text: string) {
        try {
            this.isPlaying = true;
            let _text = '';
            for (let i = 0; i < text.length; i++) {
                if (this.doneSwitch) {
                    return
                }
                await this.timeService.timeSleep(50);
                _text += text[i];
                if (this.storyText) {
                    this.storyText.setText(_text);
                }
            }
            this.storyStep++;

            this.isTextComplete = true;
            this.nextTextBtn.setVisible(this.isTextComplete);
            this.nextTextBtn.setVelocityY(-100);

            this.isPlaying = false;
        } catch (e) {
            console.log(e)
        }



    }


    preload() {
        this.load.image('k', 'assets/game/imgs/youngman-k.png')
        this.load.image('vsVillain', 'assets/game/imgs/k-vs-villain.png')
        this.load.image('arrowDown', 'assets/game/imgs/arrow-down.png');
        this.load.image('conversationWindow', 'assets/game/imgs/conversation-window.png');



        this.storyReady.forEach((story, index) => {
            this.storyLine[index] = story
        })


    }

    create() {


        this.input.on('pointerup', (event) => {

            if (this.storyLine[this.storyStep].end) {
                if (!this.isDone) {
                    this.isDone = true;
                    this.cameras.main.fadeOut(1500);
                    setTimeout(() => {
                        this.storyStep = 0;
                        this.scene.start('stage')
                    }, 1500);
                }
                return
            }

            if (this.storyLine[this.storyStep].image) {
                this.add.image(this.game.canvas.width / 2, 133, this.storyLine[this.storyStep].image)
                this.skipBtn = this.add.text(this.game.canvas.width - 100, this.game.canvas.height - (135) - 75, 'SKIP', { fontSize: '20px', color: this.storyLine[this.storyStep].rvColor }).setInteractive({
                    useHandCursor: true,
                }).on('pointerdown', () => {
                    this.input.removeAllListeners();
                    this.scene.start('stage');
                })
            }

            this.isTextComplete = false;
            this.nextTextBtn.setVisible(this.isTextComplete);
            if (!this.isPlaying) {
                this.doneSwitch = false;
                this.storyText.setText('');
                this.playText(this.storyLine[this.storyStep].text)
            } else {
                this.doneSwitch = true;
                setTimeout(() => {
                    this.storyText.setText(this.storyLine[this.storyStep].text)

                    this.isTextComplete = true;
                    this.nextTextBtn.setVisible(this.isTextComplete);
                    this.nextTextBtn.setVelocityY(-100);

                    this.storyStep++;
                    this.isPlaying = false;
                }, 50);
            }
        })

        // var rect = new Phaser.Geom.Rectangle(0, this.game.canvas.height * 2 / 3, this.game.canvas.width, this.game.canvas.height / 3);
        // let grp = this.add.graphics({ x: null, y: null, fillStyle: { color: 0x0000ff, alpha: 1 } })
        // grp.fillRectShape(rect)
        this.add.image(400, this.game.canvas.height - (135 / 2), 'conversationWindow')
        this.storyText = this.add.text(
            50,
            this.game.canvas.height - (135 / 2) - 25,
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
        if (this.storyLine[this.storyStep].image) {
            this.add.image(this.game.canvas.width / 2, 133, this.storyLine[this.storyStep].image)
        }
        this.skipBtn = this.add.text(this.game.canvas.width - 100, this.game.canvas.height - (135) - 75, 'SKIP', { fontSize: '20px', color: '#000' }).setInteractive().on('pointerdown', () => {
            this.input.removeAllListeners();
            this.scene.start('stage');
        })







    }

    // update는 루프 문이다.
    update() {
        // if(this.nextTextBtn.)

        // if (this.enterKey.isDown) {
        //     (this as any).scene.start('stage')
        // }

        // if (this.enterKey.isDown) {
        //     this.scene.start('stage')
        //     this.enterKey.isDown = false
        // }


    }
}


