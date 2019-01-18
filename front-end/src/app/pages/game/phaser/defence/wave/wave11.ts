import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave11Left1Enemy extends Enemy {
    public static key = 'wave11Left1'
    constructor(scene: DefenceStageScene) {
        let speed = 30;
        let hp = 230;
        let reward = 2
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
export class Wave11Left2Enemy extends Enemy {
    public static key = 'wave11Left2'
    constructor(scene: DefenceStageScene) {
        let speed = 50;
        let hp = 50;
        let reward = 2
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

export const wave11Config =
{
    direction: 'left',
    enemies: {
        [Wave11Left1Enemy.key]: {
            //1초 간격 10마리
            name: '실내 흡연충',
            sub: '나 세금 내는 애국자자너~~',
            appearInterval: [1000, 1000],
            imageKey: 'type2man',
            speed: 30,
            hp: 230,
            classType: Wave11Left1Enemy
        },
        [Wave11Left2Enemy.key]: {
            //1초 간격 10마리
            name: '길거리 흡연충',
            sub: '맡기 싫으면 너가 피하던가~~',
            imageKey: 'type2woman',
            speed: 50,
            hp: 50,
            appearInterval: [500, 500, 500, 500, 500, 500, 500, 500],
            classType: Wave11Left2Enemy
        }
    }
}


