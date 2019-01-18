import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave28Right1Enemy extends Enemy {
    public static key = 'wave28Right1'
    constructor(scene: DefenceStageScene) {
        let speed = 40;
        let hp = 1000;
        let reward = 10
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
export class Wave28Right2Enemy extends Enemy {
    public static key = 'wave28Right2'
    constructor(scene: DefenceStageScene) {
        let speed = 50;
        let hp = 190;
        let reward = 4
        super(scene, 'type2woman', () => {
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
export class Wave28Right3Enemy extends Enemy {
    public static key = 'wave28Right3'
    constructor(scene: DefenceStageScene) {
        let speed = 60;
        let hp = 130;
        let reward = 2
        super(scene, 'type3woman', () => {
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
export class Wave28Right4Enemy extends Enemy {
    public static key = Wave28Right4Enemy.name
    constructor(scene: DefenceStageScene) {
        let speed = 80;
        let hp = 90;
        let reward = 1
        super(scene, 'type1woman', () => {
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

export const wave28Config =
{
    direction: 'right',
    restrictions: [],
    enemies: {
        [Wave28Right1Enemy.key]: {
            //1초 간격 10마리
            speed: 40,
            hp: 1000,
            name: '프로 뒷담꾼',
            sub: '쟤가 있잖아... 속닥속닥',
            imageKey: 'type4man',
            appearInterval: [200, 200],
            classType: Wave28Right1Enemy
        },
        [Wave28Right2Enemy.key]: {
            //1초 간격 10마리
            speed: 50,
            hp: 190,
            name: '프로 뒷담꾼2',
            sub: '들었어?',
            imageKey: 'type2woman',
            appearInterval: [800, 800, 800, 800, 800],
            classType: Wave28Right2Enemy
        },
        [Wave28Right3Enemy.key]: {
            //1초 간격 10마리
            speed: 60,
            hp: 130,
            name: '프로 뒷담꾼3',
            sub: '그 사람이랑 그렇고 그런 사이래',
            imageKey: 'type3woman',
            appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,],
            classType: Wave28Right3Enemy
        },
        [Wave28Right4Enemy.key]: {
            //1초 간격 10마리
            speed: 80,
            hp: 90,
            name: '프로 뒷담꾼4',
            sub: '아니 정말 그렇다니까...? 누가 그러는데...',
            imageKey: 'type1woman',
            appearInterval: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500,],
            classType: Wave28Right4Enemy
        }
    }
}


