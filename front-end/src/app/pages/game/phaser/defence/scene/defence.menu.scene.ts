import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { DefenceStageScene } from './defence.stage.scene';
import { waveTotal } from '../wave/wave.total';


@Injectable()
export class DefenceMenuScene extends Phaser.Scene {



    enterKey: Phaser.Input.Keyboard.Key;
    that: any;

    indexText: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: 'menu'
        })

    }
    preload() {


        // this.load.image('startBtn', 'assets/game/imgs/start-btn.png');

    }

    create() {

        this.add.image(500, 275, 'current-snapshot').setAlpha(0.35)

        // this.input.on('pointerdown', (event) => {
        //     this.scene.start('intro')
        // })

        this.input.on('pointerdown', () => {
            // this.scene.setVisible(false, 'menu')
            // this.scene.bringToTop('stage')
            this.scene.stop('menu')
            this.scene.run('stage')
        })

        // var rect = new Phaser.Geom.Rectangle(0, this.game.canvas.height * 2 / 3, this.game.canvas.width, this.game.canvas.height / 3);
        let stage: DefenceStageScene = this.scene.get('stage') as any;
        this.indexText = this.add.text(
            50,
            (100),
            `다음 웨이브
            \n 
             level :   ${stage.waveStep + 1}
            \n
            방향 : ${waveTotal[stage.waveStep].direction}
            \n 
            적의 특성 
            \n 
            제한 사항 : 일부 타워가 블라블라합니다.
            `,
            {
                width: `${this.game.canvas.width - 50}px`,
                height: `${(this.game.canvas.height / 3) - 50}px`,
                color: '#fff',
                fontSize: '32px',
                border: '1px solid #fff',
                textAlign: 'center',
                fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
            });


        // this.add.text(
        //     50,
        //     (this.game.canvas.height * 1 / 2),
        //     '화면을 터치하여 점프합니다. 공중에서 한 번 더 점프 가능합니다.',
        //     {
        //         width: `${this.game.canvas.width - 50}px`,
        //         height: `${(this.game.canvas.height / 3) - 50}px`,
        //         color: '#fff',
        //         'fontSize': '13px',
        //         textAlign: 'center',
        //         fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
        //         wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
        //     });
        // this.add.text(
        //     50,
        //     (this.game.canvas.height * 1 / 2) + 25,
        //     '주인공이 화면 밖으로 벗어나거나 장애물에 부딪히면 게임오버입니다.',
        //     {
        //         width: `${this.game.canvas.width - 50}px`,
        //         height: `${(this.game.canvas.height / 3) - 50}px`,
        //         color: '#fff',
        //         'fontSize': '13px',
        //         textAlign: 'center',
        //         fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
        //         wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
        //     });


        // this.add.image(this.game.canvas.width / 2, (this.game.canvas.height * 3 / 4), 'startBtn').setInteractive().on('pointerdown', () => {
        //     this.cameras.main.fadeOut(1500);
        //     setTimeout(() => {
        //         this.scene.start('intro')
        //     }, 1500);
        // })





    }

    // update는 루프 문이다.
    update() {


    }
}


