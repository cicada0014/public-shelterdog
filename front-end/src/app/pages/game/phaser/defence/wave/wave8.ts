import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave8Enemy extends Enemy {

    public static key = 'wave8Right'
    constructor(scene: DefenceStageScene) {
        let speed = 80;
        let hp = 40;
        let reward = 2
        super(scene, 'type1man', () => {
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

export const wave8Config =
{
    direction: 'right',
    enemies: {
        [Wave8Enemy.key]: {
            name: '술만 먹으면 나가수',
            sub: '흥이 차오른다~~~ 워어어어!!!!!!',
            imageKey: 'type1man',
            speed: 80,
            hp: 40,
            //1초 간격 10마리
            appearInterval: [450, 450, 450, 450, 450, 450, 450, 450, 450, 450],
            classType: Wave8Enemy
        }
    }
}


