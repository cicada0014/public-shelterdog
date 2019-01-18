import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { HttpClient } from '@angular/common/http';
import { DefenceStageScene } from './defence.stage.scene';


@Injectable()
export class DefenceCompleteScene extends Phaser.Scene {



    enterKey: Phaser.Input.Keyboard.Key;
    that: any;




    gameoverText: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: 'complete'
        })

    }
    preload() {


        this.load.image('10_stage_complete', 'assets/game/defence/10_stage_complete.png')
        this.load.image('20_stage_complete', 'assets/game/defence/20_stage_complete.png')
        this.load.image('30_stage_complete', 'assets/game/defence/30_stage_complete.png')

        // this.load.image('go_to_first_btn', 'assets/game/defence/go_to_first_btn.png');
        // this.load.image('load_btn', 'assets/game/defence/load_btn.png');
        // this.load.image('game_start_btn', 'assets/game/defence/game_start_btn.png');
        // this.load.image('ending', 'assets/game/defence/ending.png');


    }

    create() {

        let stage: DefenceStageScene = this.scene.get('stage') as any;

        let windowKey = ''
        switch (stage.waveStep + 1) {
            case 11:
                windowKey = '10_stage_complete'
                break;
            case 21:
                windowKey = '20_stage_complete'
                break;
            case 32:
                windowKey = '30_stage_complete'
                break;
        }

        console.log(windowKey)
        this.add.image(500, 275, windowKey)



        this.input.on('pointerdown', () => {
            this.scene.run('stage')
            this.scene.stop('complete')

        })

        // this.add.image(300, 450, 'go_to_first_btn').setInteractive({
        //     useHandCursor: true,
        // }).on('pointerdown', () => {
        //     this.cameras.main.fadeOut(1500);
        //     setTimeout(() => {
        //         this.scene.start('index')
        //     }, 1500);
        // })









    }

    update() {


    }
}


