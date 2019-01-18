import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { DefenceStageScene } from './defence.stage.scene';
import { waveTotal } from '../wave/wave.total';
import { DefenceSettingScene } from './defence.setting.scene';


@Injectable()
export class DefenceIndexScene extends Phaser.Scene {



    enterKey: Phaser.Input.Keyboard.Key;
    that: any;

    indexText: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: 'index'
        })

    }
    preload() {

        this.load.image('index_image', 'assets/game/defence/index-image.png')

        this.load.image('go_to_first_btn', 'assets/game/defence/go_to_first_btn.png');
        this.load.image('load_btn', 'assets/game/defence/load_btn.png');
        this.load.image('game_start_btn', 'assets/game/defence/game_start_btn.png');

    }

    create() {

        if(window.localStorage.getItem('defence-try-save-not-loggin')){
            this.scene.start('stage')
        }


        this.add.image(500, 275, 'index_image')

        // this.input.on('pointerdown', (event) => {
        //     this.scene.start('intro')
        // })

        // this.input.on('pointerdown', () => {
        //     // this.scene.setVisible(false, 'menu')
        //     // this.scene.bringToTop('stage')
        //     this.scene.stop('index')
        //     this.scene.start('stage')
        // })

        // var rect = new Phaser.Geom.Rectangle(0, this.game.canvas.height * 2 / 3, this.game.canvas.width, this.game.canvas.height / 3);
        let stage: DefenceStageScene = this.scene.get('stage') as any;
        // this.indexText = this.add.text(
        //     200,
        //     (100),
        //     `비매너와의 전쟁 : 비호감들 전성시대
        //     \n 
        //     `,
        //     {
        //         width: `${this.game.canvas.width - 50}px`,
        //         height: `${(this.game.canvas.height / 3) - 50}px`,
        //         color: '#fff',
        //         fontSize: '32px',
        //         border: '1px solid #fff',
        //         textAlign: 'center',
        //         fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
        //         wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
        //     });

        // this.add.text(
        //     200,
        //     200,
        //     `
        //     매너가 사람을 만든다.
        //     하지만 세상에는 짜증나는 인간들이 너무 많다.
        //     이런 비매너, 비호감의 사람들을 혼내주자!
        //     `,
        //     {
        //         width: `${this.game.canvas.width - 50}px`,
        //         height: `${(this.game.canvas.height / 3) - 50}px`,
        //         color: '#fff',
        //         'fontSize': '13px',
        //         textAlign: 'center',
        //         fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
        //         wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
        //     });

        this.add.image(300, 450, 'game_start_btn').setInteractive({
            useHandCursor: true,
        }).on('pointerdown', () => {
            this.cameras.main.fadeOut(1500);
            setTimeout(() => {
                (this.scene.get('stage') as DefenceStageScene).fromIndex = true;
                (this.scene.get('stage') as DefenceStageScene).resetStage()
                // console.log(this.scene.get('stage'))
                this.scene.start('stage')
            }, 1500);
        })
        this.add.image(700, 450, 'load_btn').setInteractive({
            useHandCursor: true,
        }).on('pointerdown', () => {



            let target: DefenceSettingScene = (this.scene.get('setting')) as any;
            target.fromStage = false;
            this.scene.start('setting')
        })





    }

    // update는 루프 문이다.
    update() {


    }
}


