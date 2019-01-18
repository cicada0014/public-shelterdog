import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave4Enemy extends Enemy {

    public static key = 'wave4Right'
    constructor(scene: DefenceStageScene) {
        let speed = 30;
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
        this.setPath(scene.rightPath)
    }
}

export const wave4Config =
{
    direction: 'right',

    enemies: {
        [Wave4Enemy.key]: {
            //1초 간격 10마리
            name: '공공장소 민폐 커플',
            sub: '쪽쪽... 쪼오옥... 헉헉',
            imageKey: 'type2woman',
            speed: 30,
            hp: 50,
            appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
            classType: Wave4Enemy
        }
    }
}


