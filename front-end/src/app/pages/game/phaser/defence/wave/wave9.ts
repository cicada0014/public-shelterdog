import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave9Enemy extends Enemy {

    public static key = 'wave9Left'
    constructor(scene: DefenceStageScene) {
        let speed = 30;
        let hp = 80;
        let reward = 3
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

export const wave9Config =
{
    direction: 'left',
    enemies: {
        [Wave9Enemy.key]: {
            name: '행동이 아주 굼뜬 직원',
            sub: '저어어는 나아무우우느으을보오가아 아니이입니이다아아',
            imageKey: 'type2man',
            
            speed: 30,
            hp: 80,
            //1초 간격 10마리
            appearInterval: [400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
            classType: Wave9Enemy
        }
    }
}


