import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave27Left1Enemy extends Enemy {
    public static key = 'wave27Left1'
    constructor(scene: DefenceStageScene) {
        let speed = 40;
        let hp = 450;
        let reward = 20
        super(scene, 'type2woman', () => {
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
export class Wave27Left2Enemy extends Enemy {
    public static key = 'wave27Left2'
    constructor(scene: DefenceStageScene) {
        let speed = 55;
        let hp = 160;
        let reward = 3
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
export class Wave27Left3Enemy extends Enemy {
    public static key = 'wave27Left3'
    constructor(scene: DefenceStageScene) {
        let speed = 80;
        let hp = 70;
        let reward = 2
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

export const wave27Config =
{
    direction: 'left',
    restrictions: ['long_distance'],
    enemies: {
        [Wave27Left1Enemy.key]: {
            //1초 간격 10마리
            speed: 45,
            hp: 500,
            name: '층간소음 부모',
            sub: '애가 뛸 수도 있지!',
            appearInterval: [300, 300],
            imageKey: 'type2woman',
            classType: Wave27Left1Enemy
        },
        [Wave27Left2Enemy.key]: {
            //1초 간격 10마리
            speed: 60,
            hp: 200,
            name: '층간 소음 아이',
            sub: '쿵쿵 쾅쾅 드드드득 텅텅텅텅',
            imageKey: 'type4woman',
            appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,],
            classType: Wave27Left2Enemy
        },
        [Wave27Left3Enemy.key]: {
            //1초 간격 10마리
            speed: 90,
            hp: 90,
            name: '층간 소음 개새끼',
            imageKey: 'dog1',
            sub: '월! 월월월!!!! 워워워월!!!!',
            appearInterval: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500,],
            classType: Wave27Left3Enemy
        }
    }
}


