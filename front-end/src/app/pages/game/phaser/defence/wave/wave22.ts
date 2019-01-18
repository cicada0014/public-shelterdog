import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave22Right1Enemy extends Enemy {
    public static key = 'wave22Right1';;
    constructor(scene: DefenceStageScene) {
        let speed = 55;
        let hp = 190;
        let reward = 4
        super(scene, 'type1man', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.setHp(hp)
        // this.setScale(1.25)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.rightPath)
    }
}
export class Wave22Right2Enemy extends Enemy {
    public static key = 'wave22Right2';
    constructor(scene: DefenceStageScene) {
        let speed = 70;
        let hp = 50;
        let reward = 2
        super(scene, 'type4woman', () => {
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

export const wave22Config =
{
    direction: 'right',
    restrictions: ['long_distance'],
    enemies: {
        [Wave22Right1Enemy.key]: {
            //1초 간격 10마리
            speed: 55,
            hp: 190,
            name: '장난충',
            sub: '장난인데 왜 그래~? 화났어? 미안미안 ㅎㅎ',
            imageKey: 'type1man',
            appearInterval: [700, 700, 700, 700, 700],
            classType: Wave22Right1Enemy
        },
        [Wave22Right2Enemy.key]: {
            //1초 간격 10마리
            speed: 70,
            hp: 50,
            name: '장난충2',
            sub: '야! 장난이야 장난! 왜 혼자 다큐찍냐',
            imageKey: 'type4woman',
            appearInterval: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200,],
            classType: Wave22Right2Enemy
        }
    }
}


