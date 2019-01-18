import { DefenceStageScene } from "../scene/defence.stage.scene";





export class DefenceGameWindow extends Phaser.GameObjects.Image {
    // 상속을 스프라이트로 받느냐 이미지로 받느냐에 따라 달라진다. 
    windowText: Phaser.GameObjects.Image;
    isStart: boolean = true;
    ctx: DefenceStageScene;
    constructor(scene: DefenceStageScene, ) {
        super(scene, -8 * scene.sideLength + scene.sideLength / 2,
            4.5 * scene.sideLength + scene.sideLength / 2, 'game_description');
        this.ctx = scene;
        // this.windowText = scene.add.image(this.x, this.y + 100, 'start');
        this.setInteractive({
            useHandCursor: true,
        }).on('pointerdown', () => {
            this.hide();
        })
        // this.show()
    }
    show() {
        this.ctx.add.tween({
            targets: this,
            // scaleX: '0.8',
            // scaleY: '0.8',
            x: 9.5 * this.ctx.sideLength + this.ctx.sideLength / 2,               // '+=100'
            // y: 300,               // '+=100'
            ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,            // -1: infinity
            yoyo: false,
            onComplete: () => {
                // this.hide();
                this.isStart = false;
            }
        })
    }
    hide() {
        if (!this.isStart) {
            this.ctx.add.tween({
                targets: this,
                // scaleX: '0.8',
                // scaleY: '0.8',
                x: 27 * this.ctx.sideLength + this.ctx.sideLength / 2,               // '+=100'
                // y: 300,               // '+=100'
                ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 1000,
                repeat: 0,            // -1: infinity
                yoyo: false,
                onComplete: () => {
                    this.setPosition(-8 * this.ctx.sideLength + this.ctx.sideLength / 2,
                        4.5 * this.ctx.sideLength + this.ctx.sideLength / 2);

                    this.isStart = true;
                }
            })
        }
    }
}
