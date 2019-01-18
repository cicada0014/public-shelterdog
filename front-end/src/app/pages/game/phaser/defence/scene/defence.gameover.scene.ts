import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { DefenceStageScene } from './defence.stage.scene';
import { waveTotal } from '../wave/wave.total';
import { DefenceSettingScene } from './defence.setting.scene';


@Injectable()
export class DefenceGameoverScene extends Phaser.Scene {



    enterKey: Phaser.Input.Keyboard.Key;
    that: any;

    gameoverText: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: 'gameover'
        })

    }
    preload() {


        this.load.image('gameover', 'assets/game/defence/gameover.png');
        this.load.image('go_to_first_btn', 'assets/game/defence/go_to_first_btn.png');
        this.load.image('load_btn', 'assets/game/defence/load_btn.png');
        this.load.image('game_start_btn', 'assets/game/defence/game_start_btn.png');

    }

    create() {

        this.add.image(500, 275, 'gameover')



        this.add.image(300, 450, 'go_to_first_btn').setInteractive({
            useHandCursor: true,
        }).on('pointerdown', () => {
            this.cameras.main.fadeOut(1500, 0, 0, 0, () => {
                this.scene.start('index')
            });
            // setTimeout(() => {
            // }, 1500);
        })
        this.add.image(700, 450, 'load_btn').setInteractive({
            useHandCursor: true,
        }).on('pointerdown', () => {
            let target: DefenceSettingScene = (this.scene.get('setting')) as any;
            target.fromStage = false;
            this.scene.start('setting')
        })








    }

    update() {


    }
}


