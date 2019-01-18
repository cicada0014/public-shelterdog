import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave32Right1Enemy extends Enemy {
    public static key = 'wave32Right1'
    constructor(scene: DefenceStageScene) {
        let speed = 40;
        let hp = 510;
        let reward = 10
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
export class Wave32Right2Enemy extends Enemy {
    public static key = 'wave32Right2'
    constructor(scene: DefenceStageScene) {
        let speed = 50;
        let hp = 180;
        let reward = 2
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
export class Wave32Right3Enemy extends Enemy {
    public static key = 'wave32Right3'
    constructor(scene: DefenceStageScene) {
        let speed = 100;
        let hp = 90;
        let reward = 4
        super(scene, 'type3woman', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        // this.setScale(1.4)
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.rightPath)
    }
}


export const wave32Config =
{
    direction: 'right',
    restrictions: [],
    enemies: {
        [Wave32Right1Enemy.key]: {
            //1초 간격 10마리
            speed: 40,
            hp: 510,
            name: '음식 나치',
            sub: '너가 싫어하는 거 안들어갔어! 먹어봐~ ',
            imageKey: 'type1woman',
            appearInterval: [500, 500, 500, 500, 500],
            classType: Wave32Right1Enemy
        },
        [Wave32Right2Enemy.key]: {
            //1초 간격 10마리
            speed: 50,
            hp: 180,
            name: '먹을 것 가지고 장난',
            sub: '끼히힛',
            imageKey: 'type2woman',
            appearInterval: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500],
            classType: Wave32Right2Enemy
        },
        [Wave32Right3Enemy.key]: {
            //1초 간격 10마리
            speed: 100,
            hp: 90,
            name: '맛서0in',
            sub: '이 게임도 사실 일본에서 유래된거거든요?',
            imageKey: 'type3man',
            appearInterval: [2000, 2000, 2000, 2000, 2000,],
            classType: Wave32Right3Enemy
        },
        // [Wave30Left4Enemy.key]: {
        //     //1초 간격 10마리
        //     appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,],
        //     classType: Wave30Left4Enemy
        // }
    }
}


