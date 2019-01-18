import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave7Enemy extends Enemy {

    public static key = 'wave7Left'
    constructor(scene: DefenceStageScene) {
        let speed = 65;
        let hp = 40;
        let reward = 2
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

export const wave7Config =
{
    direction: 'left',
    enemies: {
        [Wave7Enemy.key]: {
            name: '핸드폰 좀비',
            sub: '(지이이잉) 다 듣고 있어. 계속 얘기해!!',
            imageKey: 'type4woman',
            speed: 65,
            hp: 40,
            //1초 간격 10마리
            appearInterval: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500],
            classType: Wave7Enemy
        }
    }
}


