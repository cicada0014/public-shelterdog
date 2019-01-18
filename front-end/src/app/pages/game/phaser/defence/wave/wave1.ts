import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave1Enemy extends Enemy {

    public static key = 'wave1left'
    constructor(scene: DefenceStageScene) {
        let speed = 40;
        let hp = 10;
        let reward = 2
        super(scene, 'type1woman', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
            // this.destroy();
        })
        this.setHp(hp);
        this.setSpeed(speed);
        this.setReward(reward);
        this.setPath(scene.leftPath)
    }
}

export const wave1Config =
{
    direction: 'left',
    restrictions: [],
    enemies: {
        [Wave1Enemy.key]: {
            name: '귀여운 척',
            sub: '뀨우? 나눙 원래 긔여운 걸~?',
            speed: 40,
            hp: 10,
            imageKey: 'type1woman',
            reward: 2,
            appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
            classType: Wave1Enemy,

        }
    }
}


