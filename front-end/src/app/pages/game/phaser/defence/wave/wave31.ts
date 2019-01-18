import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave31Left1Enemy extends Enemy {
    public static key = 'wave31Left1'
    constructor(scene: DefenceStageScene) {
        let speed = 40;
        let hp = 1000;
        let reward = 40
        super(scene, 'dog1', () => {
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
export class Wave31Left2Enemy extends Enemy {
    public static key = 'wave31Left2'
    constructor(scene: DefenceStageScene) {
        let speed = 50;
        let hp = 450;
        let reward = 4
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
export class Wave31Left3Enemy extends Enemy {
    public static key = 'wave31Left3'
    constructor(scene: DefenceStageScene) {
        let speed = 70;
        let hp = 180;
        let reward = 2
        super(scene, 'type3man', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        // this.setScale(1.4)
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.leftPath)
    }
}


export const wave31Config =
{
    direction: 'left',
    restrictions: ['quick'],
    enemies: {
        [Wave31Left1Enemy.key]: {
            //1초 간격 10마리
            speed: 40,
            hp: 1000,
            name: '영역 표시',
            sub: '물 안내리고 튐',
            appearInterval: [0],
            imageKey: 'dog1',
            classType: Wave31Left1Enemy
        },
        [Wave31Left2Enemy.key]: {
            //1초 간격 10마리
            speed: 50,
            hp: 450,
            name: '전 부치기의 달인',
            sub: '아무데나 토함',
            imageKey: 'type1man',
            appearInterval: [1500, 1500, 1500, 1500, 1500],
            classType: Wave31Left2Enemy
        },
        [Wave31Left3Enemy.key]: {
            //1초 간격 10마리
            speed: 70,
            hp: 180,
            name: '폐쇄 공간 방귀',
            imageKey: 'type3man',
            sub: '뿡',
            appearInterval: [2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000,],
            classType: Wave31Left3Enemy
        },
        // [Wave30Left4Enemy.key]: {
        //     //1초 간격 10마리
        //     appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,],
        //     classType: Wave30Left4Enemy
        // }
    }
}


