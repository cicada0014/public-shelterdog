import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave25Left1Enemy extends Enemy {
    public static key = 'wave25Left1';
    constructor(scene: DefenceStageScene) {
        let speed = 40;
        let hp = 600;
        let reward = 20
        super(scene, 'type1man', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.leftPath)
    }
}
export class Wave25Left2Enemy extends Enemy {
    public static key = 'wave25Left2'
    constructor(scene: DefenceStageScene) {
        let speed = 60;
        let hp = 150;
        let reward = 3
        super(scene, 'type4man', () => {
            // this.setScale(1.15)
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.leftPath)
    }
}
export class Wave25Left3Enemy extends Enemy {
    public static key = 'wave25Left3'
    constructor(scene: DefenceStageScene) {
        let speed = 100;
        let hp = 90;
        let reward = 2
        super(scene, 'type4woman', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.leftPath)
    }
}

export const wave25Config =
{
    direction: 'left',
    restrictions: [],
    enemies: {
        [Wave25Left1Enemy.key]: {
            //1초 간격 10마리
            speed: 40,
            hp: 600,
            name: '당일 파토',
            sub: '진짜 미안한데(하나도 안미안함) 어떡하지?',
            imageKey: 'type1man',
            appearInterval: [0],
            classType: Wave25Left1Enemy
        },
        [Wave25Left2Enemy.key]: {
            //1초 간격 10마리
            speed: 60,
            hp: 150,
            name: '당일 파토2',
            sub: '~~가 돌아가셔서... ㅎ',
            imageKey: 'type4man',
            appearInterval: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600,],
            classType: Wave25Left2Enemy
        },
        [Wave25Left3Enemy.key]: {
            //1초 간격 10마리
            speed: 100,
            hp: 90,
            name: '당일 파토3',
            sub: '아.. 내가 지금 아파서....',
            imageKey: 'type4woman',
            appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
            classType: Wave25Left3Enemy
        }
    }
}


