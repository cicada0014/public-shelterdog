import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave20LeftEnemy extends Enemy {
    public static key = 'wave20Left';
    constructor(scene: DefenceStageScene) {
        let speed = 55;
        let hp = 880;
        let reward = 30
        super(scene, 'type4man', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.setScale(1.4)
        this.isBoss = true;
        this.playerLifeDamage = 5
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.leftPath)
    }
}
export class Wave20Right2Enemy extends Enemy {
    public static key = 'wave20Right';
    constructor(scene: DefenceStageScene) {
        let speed = 55;
        let hp = 880;
        let reward = 30
        super(scene, 'type4man', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.setScale(1.4)
        this.playerLifeDamage = 5
        this.isBoss = true;
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.rightPath)
    }
}

export const wave20Config =
{
    direction: 'both',
    restrictions: [],
    enemies: {
        [Wave20LeftEnemy.key]: {
            //1초 간격 10마리
            name: '반말 & 막말충',
            sub: '야, 너, 임마',
            imageKey: 'type4man',
            speed: 55,
            hp: 800,
            appearInterval: [1000],
            classType: Wave20LeftEnemy
        },
        [Wave20Right2Enemy.key]: {
            //1초 간격 10마리
            name: '반말 & 막말충',
            sub: '야, 너, 임마',
            speed: 55,
            hp: 800,
            imageKey: 'type4man',
            appearInterval: [1000],
            classType: Wave20Right2Enemy
        }
    }
}


