import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave26Right1Enemy extends Enemy {
    public static key = 'wave26Right1'
    constructor(scene: DefenceStageScene) {
        let speed = 45;
        let hp = 1200;
        let reward = 20
        super(scene, 'type3man', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.rightPath)
    }
}
export class Wave26Right2Enemy extends Enemy {
    public static key = 'wave26Right2'
    constructor(scene: DefenceStageScene) {
        let speed = 55;
        let hp = 180;
        let reward = 3
        super(scene, 'type4man', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.rightPath)
    }
}
export class Wave26Right3Enemy extends Enemy {
    public static key = 'wave26Right3'
    constructor(scene: DefenceStageScene) {
        let speed = 70;
        let hp = 120;
        let reward = 2
        super(scene, 'type1man', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.rightPath)
    }
}

export const wave26Config =
{
    direction: 'right',
    restrictions: [],
    enemies: {
        [Wave26Right1Enemy.key]: {
            //1초 간격 10마리
            speed: 45,
            hp: 1200,
            name: '영화 설명충',
            sub: '이 영화에서는 이러쿵저러쿵',
            imageKey: 'type3man',
            appearInterval: [0],
            classType: Wave26Right1Enemy
        },
        [Wave26Right2Enemy.key]: {
            //1초 간격 10마리
            speed: 55,
            hp: 180,
            name: '아는 형님',
            sub: '아~~~ 이 영화 보셨었구나?',
            imageKey: 'type4man',
            appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,],
            classType: Wave26Right2Enemy
        },
        [Wave26Right3Enemy.key]: {
            //1초 간격 10마리
            speed: 70,
            hp: 120,
            name: '스포일러',
            sub: '아~ 그 녀석 거기서 죽음 ㅋ',
            imageKey: 'type1man',
            appearInterval: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500,],
            classType: Wave26Right3Enemy
        }
    }
}


