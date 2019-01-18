import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave5Enemy extends Enemy {

    public static key = 'wave5Left'
    constructor(scene: DefenceStageScene) {
        let speed = 40;
        let hp = 5;
        let reward = 2
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

export const wave5Config =
{
    direction: 'left',
    restrictions: ['basic'],

    enemies: {
        [Wave5Enemy.key]: {
            name: '영화관 내 팝콘 ASMR',
            sub: '콰아악 카악 촵...촵... 쩝쩝',
            imageKey: 'type1man',
            speed: 40,
            hp: 5,
            //1초 간격 10마리
            appearInterval: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
            classType: Wave5Enemy,

        }
    }
}


