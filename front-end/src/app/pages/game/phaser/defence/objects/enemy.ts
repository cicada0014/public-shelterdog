import * as Phaser from 'phaser';
import { DefenceStageScene } from '../scene/defence.stage.scene';
import { BombEffect } from './bullet';






export class Enemy extends Phaser.GameObjects.Image {
    // 상속을 스프라이트로 받느냐 이미지로 받느냐에 따라 달라진다. 

    follower: { t: number, vec: Phaser.Math.Vector2 }
    _hp: number = 0;
    // ENEMY_SPEED = 1 / (10000 * 4);
    path: Phaser.Curves.Path
    healthBar: HealthBar
    private _reward: number;
    ctx: DefenceStageScene;
    selfTween: Phaser.Tweens.Tween

    originXpos: number
    originYpos: number

    isBoss: boolean = false;


    playerLifeDamage: number = 1;

    debuffEndTime;

    isDebuffInit: boolean = false;


    _speed: number
    orginSpeed: number;

    deactiveCallback;
    bombEffect: BombEffect;

    movingYData: number = 1;


    debuff: { efficacy: number, duration: number };

    constructor(scene: DefenceStageScene, imageKey: string, deactiveCallback: Function) {
        super(scene, 0, 0, imageKey);
        this.setScale(0.85)
        this.deactiveCallback = deactiveCallback;
        this.ctx = scene;
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this._hp = 0;
    }



    applyDebuff(debuff: { efficacy: number, duration: number }) {


        this.isDebuffInit = true;
        this.debuff = debuff;
        this.setAlpha(0.5);
    }

    setHp(amount: number) {
        this._hp = amount;
    }

    getOriginSpeed() {
        return this._speed * 1000000
    }

    accelerateSpeed(amount) {
        this._speed = (1 / 1000000) * this.orginSpeed * amount;
    }

    setSpeed(amount: number) {
        this._speed = (1 / 1000000) * amount
        //  * this.ctx.defenceGameWolrdSpeed;
        this.orginSpeed = amount;
    }


    setReward(amount: number) {
        this._reward = amount;
    }

    getReward() {
        return this._reward;
    }

    easeInOutQuad(t, b, c, d) {
        //t is current time
        // b is start value
        // c is change in value
        // d is duration

        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };



    setPath(path: Phaser.Curves.Path) {
        this.path = path
    }

    setHealthBar() {
        this.healthBar = this.ctx.healthBars.get();
        if (this.healthBar) {
            this.healthBar.setPosition(-1000, -1000)
            this.healthBar.setOriginHp(this._hp);
            this.healthBar.setVisible(true)
            this.healthBar.setActive(true)
        }
        // this.healthBar = this.scene.add.graphics();
        // this.healthBar.fillStyle(0x0000ff, 1)
        // this.healthBar.fillRect(this.x + 25, this.y + 25, 30, 10)
    }

    startOnPath() {
        // this.deactiveCallback();

        this.setHealthBar();
        this.follower.t = 0;
        this.path.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(this.follower.vec.x, this.follower.vec.y);






    }
    receiveDamage(damage) {
        this._hp -= damage;
        // if hp drops below 0 we deactivate this enemy
        this.healthBar.setPercent(this._hp, damage)

        // if (!this.bombEffect) {
        //     this.bombEffect = this.ctx.bombEffects.get();
        //     this.bombEffect.setActive(true)
        //     this.bombEffect.setActive(true)
        // }

        // console.log(this._hp)
        if (this._hp <= 0) {

            this.setActive(false);
            this.setVisible(false);


            this.healthBar.setActive(false)
            this.healthBar.setVisible(false)
            this.healthBar.barPosition = 0;
            this.healthBar.setScale(1, 1);
            this.healthBar.setPosition(-1000, -1000)
            this.ctx.deposit.setText(parseFloat(this.ctx.deposit.text) + this._reward + '');
            this.deactiveCallback();
            this.destroy();

        }
    }
    update(time?, delta?) {


        //easing out 
        if (this.movingYData == -1) {
            this.movingYData = 1;
        }
        this.movingYData -= 0.1;
        let cosDelta = (Math.cos(this.movingYData) * 3) * (Math.cos(this.movingYData) * 3)


        if (this.debuff) {
            if (this.debuffEndTime && time > this.debuffEndTime) {
                this.debuff = null;
                this.setAlpha(1);
                this.debuffEndTime = null;
            } else {
                if (this.isDebuffInit) {
                    this.debuffEndTime = time + this.debuff.duration

                    this.isDebuffInit = false;
                }
                this.follower.t += this._speed * (1 - this.debuff.efficacy) * delta;

            }
        } else {
            this.follower.t += this._speed * delta;
        }

        this.path.getPoint(this.follower.t, this.follower.vec);

        this.setPosition(this.follower.vec.x, this.follower.vec.y - (cosDelta) - 10);
        this.healthBar.setPosition(this.follower.vec.x - this.healthBar.barPosition, this.follower.vec.y - (this.isBoss ? 10 : 0) - 25 - (cosDelta) - 10)




        // if (this.bombEffect) {
        //     this.bombEffect.setPosition(this.x, this.y);
        //     this.bombEffect.lifespan--;
        //     if (this.bombEffect.lifespan <= 0) {
        //         this.bombEffect.setActive(false)
        //         this.bombEffect.setVisible(false)
        //         this.bombEffect = null;
        //     }
        // }



        if (this.follower.t >= 0.983) {
            this.setActive(false);
            this.setVisible(false);

            this.healthBar.setActive(false)
            this.healthBar.setVisible(false)
            this.healthBar.barPosition = 0;
            this.healthBar.setScale(1, 1);

            this.deactiveCallback();
            this.destroy();
            this.ctx.playerLifeByHeart -= this.playerLifeDamage;
            this.ctx.playerLifeByHeartText.setText(`${this.ctx.playerLifeByHeart} / 10`);
        }


    }
}




export class EmenyConfig {

    public static type1Hp: number = 100;
    public static type1Reward: number = 50
    public static type1Speed: number = 10

    public static type2Hp: number = 100;
    public static type2Reward: number = 50
    public static type2Speed: number = 10

    public static type3Hp: number = 100;
    public static type3Reward: number = 50
    public static type3Speed: number = 10

    public static type4Hp: number = 100;
    public static type4Reward: number = 50
    public static type4Speed: number = 10





}





export class Type1ManEnemy extends Enemy {

    public static speed = EmenyConfig.type1Speed;
    public static reward = EmenyConfig.type1Reward;
    public static hp = EmenyConfig.type1Hp;

    constructor(scene: DefenceStageScene) {
        super(scene, 'type1man', () => {


            this.setHp(Type1ManEnemy.hp)

            this.setSpeed(Type1ManEnemy.speed)
            this.setReward(Type1ManEnemy.reward);


        })
        this.setSpeed(Type1ManEnemy.speed)
        this.setReward(Type1ManEnemy.reward);

        this.setHp(Type1ManEnemy.hp)
    }


}
export class Type2ManEnemy extends Enemy {

    public static speed = EmenyConfig.type2Speed;
    public static reward = EmenyConfig.type2Reward;
    public static hp = EmenyConfig.type2Hp;

    constructor(scene: DefenceStageScene) {
        super(scene, 'type2man', () => {
            this.setHp(Type2ManEnemy.hp)

            this.setSpeed(Type2ManEnemy.speed)
            this.setReward(Type2ManEnemy.reward);
        })
        this.setSpeed(Type2ManEnemy.speed)
        this.setReward(Type2ManEnemy.reward);
        this.setHp(Type2ManEnemy.hp)
    }


}
export class Type3ManEnemy extends Enemy {

    public static speed = EmenyConfig.type3Speed;
    public static reward = EmenyConfig.type3Reward;
    public static hp = EmenyConfig.type3Hp;

    constructor(scene: DefenceStageScene) {
        super(scene, 'type3man', () => {
            this.setHp(Type3ManEnemy.hp)

            this.setSpeed(Type3ManEnemy.speed)
            this.setReward(Type3ManEnemy.reward);
        })
        this.setSpeed(Type3ManEnemy.speed)
        this.setReward(Type3ManEnemy.reward);
        this.setHp(Type3ManEnemy.hp)
    }


}
export class Type4ManEnemy extends Enemy {

    public static speed = EmenyConfig.type4Speed;
    public static reward = EmenyConfig.type4Reward;
    public static hp = EmenyConfig.type4Hp;

    constructor(scene: DefenceStageScene) {
        super(scene, 'type4man', () => {
            this.setHp(Type4ManEnemy.hp)

            this.setSpeed(Type4ManEnemy.speed)
            this.setReward(Type4ManEnemy.reward);
        })
        this.setSpeed(Type4ManEnemy.speed)
        this.setReward(Type4ManEnemy.reward);
        this.setHp(Type4ManEnemy.hp)
    }


}
export class Type1WomanEnemy extends Enemy {

    public static speed = EmenyConfig.type1Speed;
    public static reward = EmenyConfig.type1Reward;
    public static hp = EmenyConfig.type1Hp;

    constructor(scene: DefenceStageScene) {
        super(scene, 'type1woman', () => {
            this.setHp(Type1WomanEnemy.hp)

            this.setSpeed(Type1WomanEnemy.speed)
            this.setReward(Type1WomanEnemy.reward);
        })
        this.setSpeed(Type1WomanEnemy.speed)
        this.setReward(Type1WomanEnemy.reward);
        this.setHp(Type1WomanEnemy.hp)
    }


}
export class Type2WomanEnemy extends Enemy {

    public static speed = EmenyConfig.type2Speed;
    public static reward = EmenyConfig.type2Reward;
    public static hp = EmenyConfig.type2Hp;

    constructor(scene: DefenceStageScene) {
        super(scene, 'type2woman', () => {
            this.setHp(Type2WomanEnemy.hp)
            this.setSpeed(Type2WomanEnemy.speed)
            this.setReward(Type2WomanEnemy.reward);
        })
        this.setSpeed(Type2WomanEnemy.speed)
        this.setReward(Type2WomanEnemy.reward);
        this.setHp(Type2WomanEnemy.hp)
    }


}
export class Type3WomanEnemy extends Enemy {

    public static speed = EmenyConfig.type3Speed;
    public static reward = EmenyConfig.type3Reward;
    public static hp = EmenyConfig.type3Hp;

    constructor(scene: DefenceStageScene) {
        super(scene, 'type3woman', () => {
            this.setHp(Type3WomanEnemy.hp)

            this.setSpeed(Type3WomanEnemy.speed)
            this.setReward(Type3WomanEnemy.reward);
        })
        this.setSpeed(Type3WomanEnemy.speed)
        this.setReward(Type3WomanEnemy.reward);
        this.setHp(Type3WomanEnemy.hp)
    }


}
export class Type4WomanEnemy extends Enemy {

    public static speed = EmenyConfig.type4Speed;
    public static reward = EmenyConfig.type4Reward;
    public static hp = EmenyConfig.type4Hp;

    constructor(scene: DefenceStageScene) {
        super(scene, 'type4woman', () => {
            this.setHp(Type4WomanEnemy.hp)
            this.setSpeed(Type4WomanEnemy.speed)
            this.setReward(Type4WomanEnemy.reward);
        })
        this.setSpeed(Type4WomanEnemy.speed)
        this.setReward(Type4WomanEnemy.reward);
        this.setHp(Type4WomanEnemy.hp)
    }


}


export class HealthBar extends Phaser.GameObjects.Image {


    originHP: number = 0;


    constructor(scene: Phaser.Scene) {

        super(scene, -100, -100, 'hp');
        this.setVisible(false);
    }

    barPosition: number = 0

    setOriginHp(amount: number) {
        this.originHP = amount;
    }


    setPercent(hp, demage) {
        this.setScale((hp / this.originHP), 1)
        // this.width = 40 (hp / 100)
        this.barPosition += 40 * (demage / this.originHP) / 2;
    }

}