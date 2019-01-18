import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave35Left1Enemy extends Enemy {
    public static key = 'wave35Left1'
    constructor(scene: DefenceStageScene) {
        let speed = 20;
        let hp = 15000;
        let reward = 0
        super(scene, 'dog1', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.isBoss = true;
        this.setScale(1.4);
        this.playerLifeDamage = 10
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.leftPath)
    }
}
export class Wave35Right1Enemy extends Enemy {
    public static key = 'wave35Right1'
    constructor(scene: DefenceStageScene) {
        let speed = 20;
        let hp = 15000;
        let reward = 0
        super(scene, 'dog1', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.isBoss = true;
        this.playerLifeDamage = 10;
        this.setScale(1.4);
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.rightPath)
    }
}


export const wave35Config =
{
    direction: 'both',
    restrictions: [],
    enemies: {
        [Wave35Left1Enemy.key]: {
            //1초 간격 10마리
            speed: 20,
            hp: 17000,
            name: '직접 입력',
            sub: '',
            imageKey: 'dog1',
            appearInterval: [0],
            classType: Wave35Left1Enemy
        },
        [Wave35Right1Enemy.key]: {
            //1초 간격 10마리
            speed: 20,
            hp: 17000,
            name: '직접 입력',
            sub: '',
            imageKey: 'dog',
            appearInterval: [0],
            classType: Wave35Right1Enemy
        },

    }
}


