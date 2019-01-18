import * as Phaser from 'phaser';
import { DefenceStageScene } from '../scene/defence.stage.scene';



export class Bullet extends Phaser.GameObjects.Image {
    // 상속을 스프라이트로 받느냐 이미지로 받느냐에 따라 달라진다. 

    dx;
    dy;
    lifespan
    speed;
    originSpeed;


    debuff: { efficacy: number, duration: number };


    private damage: number = 5;

    totalDx = 0;
    totalDy = 0;

    constructor(scene: DefenceStageScene, imageKey: string, ) {
        super(scene, 0, 0, imageKey);
        this.dx = 0;
        this.dy = 0;
        this.lifespan = 0;
        this.speed = Phaser.Math.GetSpeed(800, 1)
        // * scene.defenceGameWolrdSpeed;
        this.originSpeed = Phaser.Math.GetSpeed(800, 1);
    }



    delDebuff() {
        this.debuff = null;
    }

    setDebuff(efficacy, duration) {
        this.debuff = {
            efficacy,
            duration
        }
    }

    setDamage(amount: number) {
        this.damage = amount;
    }
    getDamage() {
        return this.damage
    }


    fire(x, y, angle) {
        this.setActive(true);
        this.setVisible(true);

        //  Bullets fire from the middle of the screen to the given x/y
        this.setPosition(x, y);

        //  we don't need to rotate the bullets as they are round
        //  this.setRotation(angle);

        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);

        this.lifespan = 10000;
    }
    update(time?, delta?) {
        this.lifespan -= delta;

        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);
        // this.totalDx += this.dx * (this.speed * delta);
        // this.totalDy += this.dy * (this.speed * delta);
        // console.log(Math.sqrt(Math.pow(this.totalDx, 2) + Math.pow(this.totalDy, 2)))
        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.speed = Phaser.Math.GetSpeed(800, 1);
            // this.totalDx = 0;
            // this.totalDy = 0;
        }
    }
}



export class BombEffect extends Phaser.GameObjects.Image {
    lifespan: number = 15;
    constructor(scene: Phaser.Scene, ) {
        super(scene, 0, 0, 'bomb-effect');
    }
}




export class DropSpitBullet extends Bullet {

    constructor(scene: DefenceStageScene) {
        super(scene, 'dropSpit-bullet')
        // this.setScale(0.45)
    }


}
export class PunchBullet extends Bullet {

    constructor(scene: DefenceStageScene) {
        super(scene, 'punch-bullet')
        // this.setScale(0.45)
    }

}
export class EggBullet extends Bullet {

    constructor(scene: DefenceStageScene) {
        super(scene, 'egg-bullet')
        // this.setScale(0.45)

    }

}
export class StoneBullet extends Bullet {

    constructor(scene: DefenceStageScene) {
        super(scene, 'stone-bullet')
        // this.setScale(0.45)
    }

}
export class TextboxBullet extends Bullet {

    constructor(scene: DefenceStageScene) {
        super(scene, 'textbox-bullet')
        // this.setScale(0.45)
    }

}
// var Bullet = new (Phaser as any).Class({

//     Extends: Phaser.GameObjects.Image,

//     initialize:

//         function Bullet(scene) {
//             Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

//             this.dx = 0;
//             this.dy = 0;
//             this.lifespan = 0;

//             this.speed = Phaser.Math.GetSpeed(600, 1);
//         },

//     fire: function (x, y, angle) {
//         this.setActive(true);
//         this.setVisible(true);

//         //  Bullets fire from the middle of the screen to the given x/y
//         this.setPosition(x, y);

//         //  we don't need to rotate the bullets as they are round
//         //  this.setRotation(angle);

//         this.dx = Math.cos(angle);
//         this.dy = Math.sin(angle);

//         this.lifespan = 300;
//     },

//     update: function (time, delta) {
//         this.lifespan -= delta;

//         this.x += this.dx * (this.speed * delta);
//         this.y += this.dy * (this.speed * delta);

//         if (this.lifespan <= 0) {
//             this.setActive(false);
//             this.setVisible(false);
//         }
//     }

// });
