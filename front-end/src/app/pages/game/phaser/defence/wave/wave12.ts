import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave12Right1Enemy extends Enemy {
    public static key = 'wave12Right1'
    constructor(scene: DefenceStageScene) {
        let speed = 70;
        let hp = 30;
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
export class Wave12Right2Enemy extends Enemy {
    public static key = 'wave12Right2'
    constructor(scene: DefenceStageScene) {
        let speed = 40;
        let hp = 200;
        let reward = 4
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

export const wave12Config =
{
    direction: 'right',
    enemies: {
        [Wave12Right1Enemy.key]: {
            //1초 간격 10마리
            speed: 70,
            hp: 30,
            name: '지하철 불도저',
            sub: '너가 내리던 말던 나는 먼저 탈거야~',
            imageKey: 'type3woman',
            appearInterval: [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
            classType: Wave12Right1Enemy
        },
        [Wave12Right2Enemy.key]: {
            //1초 간격 10마리
            speed: 40,
            hp: 200,
            name: '7호선 단.소.살.인.마',
            sub: '콱 씨....',
            imageKey: 'type3man',
            appearInterval: [500, 500],
            classType: Wave12Right2Enemy
        }
    }
}


