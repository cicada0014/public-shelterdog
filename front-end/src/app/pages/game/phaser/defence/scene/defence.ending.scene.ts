import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class DefenceEndingScene extends Phaser.Scene {



    enterKey: Phaser.Input.Keyboard.Key;
    that: any;

    gameoverText: Phaser.GameObjects.Text;

    constructor(private http: HttpClient) {
        super({
            key: 'ending'
        })

    }
    preload() {
        this.load.image('go_to_first_btn', 'assets/game/defence/go_to_first_btn.png');
        this.load.image('load_btn', 'assets/game/defence/load_btn.png');
        this.load.image('game_start_btn', 'assets/game/defence/game_start_btn.png');
        this.load.image('ending', 'assets/game/defence/ending.png');


    }

    create() {

        this.add.image(500, 275, 'ending')



        this.add.image(300, 450, 'go_to_first_btn').setInteractive({
            useHandCursor: true,
        }).on('pointerdown', () => {
            this.cameras.main.fadeOut(1500);
            setTimeout(() => {
                this.scene.start('index')
            }, 1500);
        })









    }

    update() {


    }
}


