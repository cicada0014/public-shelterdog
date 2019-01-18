import * as Phaser from 'phaser';
import { DefenceStageScene } from '../scene/defence.stage.scene';
import { Enemy } from './enemy';
import { Bullet } from './bullet';



export class Turret extends Phaser.GameObjects.Image {
    // 상속을 스프라이트로 받느냐 이미지로 받느냐에 따라 달라진다. 


    protected _level: number = 1;


    koName: string
    koDescription: string
    _hitRange = 1;
    _speedOfAttack = 1
    memoSA: number = 0;
    _price: number;
    _upgradeConifg: { 2: TurretUpgradeConifg, 3: TurretUpgradeConifg };
    private nextTic;
    public id: string
    public type: string
    scene: DefenceStageScene;
    levelImage: Phaser.GameObjects.Image
    protected _damage: number = 5;

    protected slowDebuffEfficacy
    originSpeedOfAttack: number;

    constructor(scene: DefenceStageScene, imageKey: string) {
        super(scene, 0, 0, imageKey);
        this.setScale(0.7);
        this.scene = scene;
        this.nextTic = 0;

    }




    getSlowDebuffEfficacy() {
        return this.slowDebuffEfficacy;
    }

    delLevelImage() {
        if (this.levelImage) {
            this.levelImage.setActive(false)
            this.levelImage.setVisible(false)
            this.levelImage.destroy()
            this.levelImage = null;
        }
    }

    setLevelImage() {
        this.delLevelImage();
        switch (this._level) {
            case 1:
                this.levelImage = this.scene.add.image(this.x, this.y, 'lv1');
                break;
            case 2:
                this.levelImage = this.scene.add.image(this.x, this.y, 'lv2');
                break;
            case 3:
                this.levelImage = this.scene.add.image(this.x, this.y, 'lv3');
                break;


        }
    }

    loadLevel(level) {
        this._level = level;
        if (this._level > 1) {
            this.setDamage(this._upgradeConifg[this._level].damage)
            this.setSpeedOfAttack(this._upgradeConifg[this._level].speedOfAttack)
            this.slowDebuffEfficacy = this._upgradeConifg[this._level].slowDebuffEfficacy ? this._upgradeConifg[this._level].slowDebuffEfficacy : null;
        }
    }


    upgradeLevel() {
        if (this._level < 3) {
            if (parseInt(this.scene.deposit.text) >= this._upgradeConifg[this._level + 1].fee) {
                this.setDamage(this._upgradeConifg[this._level + 1].damage)
                this.setSpeedOfAttack(this._upgradeConifg[this._level + 1].speedOfAttack)
                this.scene.deposit.setText((parseInt(this.scene.deposit.text) - this._upgradeConifg[this._level + 1].fee) + '')

                if (this.slowDebuffEfficacy) {
                    this.slowDebuffEfficacy = this._upgradeConifg[this._level + 1].slowDebuffEfficacy
                }


            } else {
                this.scene.showMessageToast(`금액이 부족합니다. ${this._upgradeConifg[this._level + 1].fee}골드가 필요합니다.`);
                return
            }
            this._level++;
            this.setLevelImage();
        }
    }

    getLevel() {
        return this._level
    }


    setHitRange(amount: number) {
        this._hitRange = amount;
    }

    getHitRange() {
        return this._hitRange;
    }
    setDamage(amount: number) {
        this._damage = amount;
    }
    getDamge() {
        return this._damage;
    }

    // setHitRange(amount: number) {
    //     this.hitRange = amount
    // }
    // getHitRage() {
    //     return this.hitRange
    // }
    accelerateSpeedOfAttack(amount: number) {
        this._speedOfAttack = this.originSpeedOfAttack * amount;
    }

    setSpeedOfAttack(amount: number) {
        this._speedOfAttack = amount
        // * this.scene.defenceGameWolrdSpeed;
        this.originSpeedOfAttack = amount;
    }

    getSpeedOfAttack() {
        return this._speedOfAttack;
    }

    setPrice(price: number) {
        this._price = price;
    }
    getPrice() {
        let result = this._price;
        if (this._level >= 2) {
            result += this._upgradeConifg[2].fee
        }
        if (this._level == 3) {
            result += this._upgradeConifg[3].fee
        }



        return result
    }

    setUpgradeConfig(config: { 2: TurretUpgradeConifg, 3: TurretUpgradeConifg }) {
        this._upgradeConifg = config;
    }


    getUpgradeConfig(nextLevel: number): TurretUpgradeConifg {
        return this._upgradeConifg[nextLevel]
    }

    addBullet(x, y, angle) {
        // var bullet: Bullet = (this.scene.bullets.get()) as Bullet;
        // if (bullet) {
        //     bullet.setDamage(this._damage);
        //     bullet.fire(x, y, angle);
        // }
    }

    getEnemy(x, y, distance) {
        var enemyUnits: Enemy[] = this.scene.getCurrEnemies();
        for (var i = 0; i < enemyUnits.length; i++) {
            if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].follower.vec.x, enemyUnits[i].follower.vec.y) <= distance)
                return enemyUnits[i];
        }
        return false;
    }

    place(i, j) {
        this.y = i * this.scene.sideLength + this.scene.sideLength / 2;
        this.x = j * this.scene.sideLength + this.scene.sideLength / 2;
        this.scene.map[i][j] = 1;
    }
    fire() {
        if (this.scene.turretRestrictionsOfWave[this.type]) {
            return
        }
        var enemy: Enemy | false = this.getEnemy(this.x, this.y, this.scene.sideLength * (this._hitRange ? this._hitRange : 0));
        if (enemy) {
            var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
            this.addBullet(this.x, this.y, angle);
            let applyAngle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
            // if (applyAngle > 180) {
            //     applyAngle += 180;
            // }
            this.angle = applyAngle + 63;
        }
    }
    update(time?, delta?) {
        if (this.memoSA != this._speedOfAttack) {
            this.memoSA = this._speedOfAttack;
            this.nextTic = 0;
        }

        if (time > this.nextTic) {
            this.fire();

            if (this._speedOfAttack) {
                this.nextTic = time + (100000 / this._speedOfAttack);
            }
        }
    }
}

export class BasicTurret extends Turret {
    public static hitRange: number = 2.3;
    public static price: number = 10;
    public static speedOfAttack: number = 100;
    public static damage: number = 10;

    scene: DefenceStageScene

    public koName = '은퇴한 원펀맨'
    public koDescription = '히어로 은퇴 후 짜증나는 사람들에게 꿀밤을 먹이며 혼내주고 있다.'
    constructor(scene: DefenceStageScene) {
        super(scene, 'basic-turret')
        this.setPrice(BasicTurret.price)
        this.setDamage(BasicTurret.damage)
        this.setSpeedOfAttack(BasicTurret.speedOfAttack)
        this.setHitRange(BasicTurret.hitRange)

        this.setUpgradeConfig({
            2: {
                fee: 30,
                speedOfAttack: 130,
                damage: 20,
                hitRange: this._hitRange
            },
            3: {
                fee: 50,
                speedOfAttack: 150,
                damage: 40,
                hitRange: this._hitRange
            }
        })
    }

    addBullet(x, y, angle) {
        var bullet: Bullet = (this.scene.bullets.punch.get()) as Bullet;
        if (bullet) {
            bullet.delDebuff();
            bullet.setDamage(this._damage);
            bullet.fire(x, y, angle);
        }
    }
}


export class QuickTurret extends Turret {
    public static hitRange: number = 2.3;
    public static price: number = 20;
    public static speedOfAttack: number = 300;
    public static damage: number = 5;

    scene: DefenceStageScene


    public koName = '할미넴'
    public koDescription = '귀에 피가 나도록 속사포로 욕을 퍼부으며 비매너들을 혼내준다.'
    constructor(scene: DefenceStageScene) {
        super(scene, 'quick-turret')
        this.setPrice(QuickTurret.price)
        this.setDamage(QuickTurret.damage)
        this.setSpeedOfAttack(QuickTurret.speedOfAttack)
        this.setHitRange(QuickTurret.hitRange)

        this.setUpgradeConfig({
            2: {
                fee: 40,
                speedOfAttack: 350,
                damage: 10,
                hitRange: this._hitRange
            },
            3: {
                fee: 60,
                speedOfAttack: 400,
                damage: 20,
                hitRange: this._hitRange
            }
        })
    }

    addBullet(x, y, angle) {
        var bullet: Bullet = (this.scene.bullets.textbox.get()) as Bullet;
        if (bullet) {
            bullet.delDebuff();
            bullet.setDamage(this._damage);
            bullet.fire(x, y, angle);
        }
    }
}
export class LongDistanceTurret extends Turret {
    public static hitRange: number = 3.7;
    public static price: number = 30;
    public static speedOfAttack: number = 50;
    public static damage: number = 20;

    scene: DefenceStageScene


    public koName = '양계장 아들'
    public koDescription = '사료 포대를 옮기며 발달된 근육으로 계란을 멀리멀리 던질 수 있다.'
    constructor(scene: DefenceStageScene) {

        super(scene, 'long-distance-turret')

        this.setPrice(LongDistanceTurret.price)
        this.setDamage(LongDistanceTurret.damage)
        this.setSpeedOfAttack(LongDistanceTurret.speedOfAttack)
        this.setHitRange(LongDistanceTurret.hitRange)


        this.setUpgradeConfig({
            2: {
                fee: 50,
                speedOfAttack: 80,
                damage: 40,
                hitRange: this._hitRange
            },
            3: {
                fee: 70,
                speedOfAttack: 100,
                damage: 80,
                hitRange: this._hitRange
            }
        })
    }
    addBullet(x, y, angle) {
        var bullet: Bullet = (this.scene.bullets.egg.get()) as Bullet;
        if (bullet) {
            bullet.delDebuff();
            bullet.speed = Phaser.Math.GetSpeed(1800, 1);
            bullet.setDamage(this._damage);
            bullet.fire(x, y, angle);
        }
    }

}
export class SlowDebuffTurret extends Turret {
    public static hitRange: number = 2.3;
    public static price: number = 30;
    public static speedOfAttack: number = 100;
    public static damage: number = 5;


    public slowDebuffEfficacy = 30 / 100;
    public slowDebuffDuration = 1500;


    public koName = '침 좀 뱉어 본 아이'
    public koDescription = '짜증나는 사람들을 보면 침을 뱉는다. 찝찝함을 주어 느려지게 한다.'

    scene: DefenceStageScene
    constructor(scene: DefenceStageScene) {
        super(scene, 'slow-debuff-turret')

        this.setPrice(SlowDebuffTurret.price)
        this.setDamage(SlowDebuffTurret.damage)
        this.setSpeedOfAttack(SlowDebuffTurret.speedOfAttack)
        this.setHitRange(SlowDebuffTurret.hitRange)

        this.setUpgradeConfig({
            2: {
                fee: 40,
                speedOfAttack: 130,
                damage: 10,
                hitRange: this._hitRange,
                slowDebuffEfficacy: 45 / 100
            },
            3: {
                fee: 50,
                speedOfAttack: 150,
                damage: 20,
                hitRange: this._hitRange,
                slowDebuffEfficacy: 60 / 100
            }
        })


    }




    addBullet(x, y, angle) {
        var bullet: Bullet = (this.scene.bullets.dropSpit.get()) as Bullet;
        if (bullet) {
            bullet.setDebuff(this.slowDebuffEfficacy, this.slowDebuffDuration)
            bullet.setDamage(this._damage);
            bullet.fire(x, y, angle);
        }
    }



}




interface TurretUpgradeConifg {

    fee: number,
    speedOfAttack: number,
    hitRange: number,
    damage: number,
    slowDebuffEfficacy?: number
}

// var Turret = new (Phaser as any).Class({

//     Extends: Phaser.GameObjects.Image,

//     initialize:

//         function Turret(scene) {
//             Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turret');
//             this.nextTic = 0;
//         },
//     place: function (i, j) {
//         this.y = i * that.sideLength + that.sideLength / 2;
//         this.x = j * that.sideLength + that.sideLength / 2;
//         that.map[i][j] = 1;
//     },
//     fire: function () {
//         var enemy = that.getEnemy(this.x, this.y, 200);
//         if (enemy) {
//             var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
//             that.addBullet(this.x, this.y, angle);
//             this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
//         }
//     },
//     update: function (time, delta) {
//         if (time > this.nextTic) {
//             this.fire();
//             this.nextTic = time + 1000;
//         }
//     }
// });
