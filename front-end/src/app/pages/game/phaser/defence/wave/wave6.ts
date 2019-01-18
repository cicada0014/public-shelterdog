import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave6Enemy extends Enemy {

    public static key = 'wave6Right'
    constructor(scene: DefenceStageScene) {
        let speed = 80;
        let hp = 4;
        let reward = 2
        super(scene, 'type1woman', () => {
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

export const wave6Config =
{
    direction: 'right',
    restrictions: ['basic'],
    enemies: {
        [Wave6Enemy.key]: {
            name: 'TMI',
            sub: '하고 싶은 말이 너무 많아~!! 블라블라 어쩌구 저쩌구',
            imageKey: 'type1woman',
            speed: 80,
            hp: 4,
            //1초 간격 10마리
            appearInterval: [140, 140, 140, 140, 140, 140, 140, 140, 140, 140],
            classType: Wave6Enemy,

        }
    }
}


