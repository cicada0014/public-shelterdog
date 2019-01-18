import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { runnerGravity } from '../game.runner.config';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class RunnerGameoverScene extends Phaser.Scene {



    tips: string[]



    constructor() {
        super({
            key: 'gameover'
        })
    }

    preload() {
        this.tips = [
            'TIP: 공중에서 한 번더 터치하여 점프할 수 있습니다.',
            'TIP: 색깔이 좀더 연한 땅은 아래로 떨어지는 땅입니다.',
            'TIP: 엔딩까지는 1분이 소요됩니다.'
        ]





        this.load.image('retryBtn', 'assets/game/imgs/retry-btn.png');


    }




    create() {
        this.cameras.main.fadeIn(1000);

        let text = this.add.text(
            this.game.canvas.width / 2 - 50,
            (this.game.canvas.height / 2) - 100,
            'GAME OVER',
            {
                width: 200,
                height: 50,
                align: 'center',
                color: '#fff',
                fontSize: '18px',
                fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
            });
        this.add.text(
            this.game.canvas.width / 2 - 125,
            (this.game.canvas.height / 2) + 150,
            this.tips[Math.floor(Math.random() * this.tips.length)],
            {
                width: 200,
                height: 50,
                align: 'center',
                color: '#fff',
                fontSize: '13px',
                fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
            });


        // let grp = this.add.graphics(
        //     {
        //         x: 0,
        //         y: 0,
        //         fillStyle: {
        //             color: 0x0000ff,
        //             alpha: 1
        //         },
        //         lineStyle: {
        //             width: 2,
        //             color: 0x00ff00,
        //             alpha: 1
        //         }
        //     })
        // var rect = new Phaser.Geom.Rectangle(this.game.canvas.width / 2 - 100, (this.game.canvas.height / 2) + 50, 200, 50);
        // grp.fillRectShape(rect)
        let retry = this.add.image(this.game.canvas.width / 2, (this.game.canvas.height / 2) + 75, 'retryBtn')
        // let retry = this.add.text(this.game.canvas.width / 2 - 75, (this.game.canvas.height / 2) + 25, '다시 시작 버튼 이미지')
        retry.setInteractive({ useHandCurosr: true }).on('pointerdown', () => {
            this.scene.start('stage')
        })





    }
    update() {



    }
}

