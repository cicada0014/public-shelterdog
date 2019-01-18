import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave34Right1Enemy extends Enemy {
    public static key = 'wave34Right1'
    constructor(scene: DefenceStageScene) {
        let speed = 60;
        let hp = 600;
        let reward = 3
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
export class Wave34Right2Enemy extends Enemy {
    public static key = 'wave34Right2'
    constructor(scene: DefenceStageScene) {
        let speed = 100;
        let hp = 180;
        let reward = 2
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


export const wave34Config =
{
    direction: 'right',
    restrictions: [],
    enemies: {
        [Wave34Right1Enemy.key]: {
            //1초 간격 10마리
            speed: 60,
            hp: 600,
            name: '감정의 쓰레기통',
            sub: '너는 내 모진 감정들을 다 받아줘야만 해',
            imageKey: 'type2woman',
            appearInterval: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500,],
            classType: Wave34Right1Enemy
        },
        [Wave34Right2Enemy.key]: {
            //1초 간격 10마리
            speed: 100,
            hp: 180,
            name: '프로 불편러',
            sub: '빼애애액',
            imageKey: 'type4man',
            appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,],
            classType: Wave34Right2Enemy
        },

    }
}


