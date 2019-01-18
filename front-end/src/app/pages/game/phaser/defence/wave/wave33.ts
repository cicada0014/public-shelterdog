import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave33Left1Enemy extends Enemy {
    public static key = 'wave33Left1'
    constructor(scene: DefenceStageScene) {
        let speed = 45;
        let hp = 1000;
        let reward = 10
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
export class Wave33Left2Enemy extends Enemy {
    public static key = 'wave33Left2'
    constructor(scene: DefenceStageScene) {
        let speed = 60;
        let hp = 300;
        let reward = 4
        super(scene, 'type2man', () => {
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
export class Wave33Left3Enemy extends Enemy {
    public static key = 'wave33Left3'
    constructor(scene: DefenceStageScene) {
        let speed = 90;
        let hp = 150;
        let reward = 2
        super(scene, 'type3man', () => {
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


export const wave33Config =
{
    direction: 'left',
    restrictions: [],
    enemies: {
        [Wave33Left1Enemy.key]: {
            //1초 간격 10마리
            speed: 45,
            hp: 1000,
            name: '할 일 떠 넘기기',
            sub: '바빠? 바빠도 내것 까지 해줘. 고마워~',
            imageKey: 'type1man',
            appearInterval: [500, 500],
            classType: Wave33Left1Enemy
        },
        [Wave33Left2Enemy.key]: {
            //1초 간격 10마리
            speed: 60,
            hp: 300,
            name: '잠수',
            sub: '할머니 제사 때문에....',
            imageKey: 'type2man',
            appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,],
            classType: Wave33Left2Enemy
        },
        [Wave33Left3Enemy.key]: {
            //1초 간격 10마리
            speed: 90,
            hp: 150,
            name: '개무시하는 사람',
            sub: '...',
            imageKey: 'type3man',
            appearInterval: [2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000,],
            classType: Wave33Left3Enemy
        },
        // [Wave30Left4Enemy.key]: {
        //     //1초 간격 10마리
        //     appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,],
        //     classType: Wave30Left4Enemy
        // }
    }
}


