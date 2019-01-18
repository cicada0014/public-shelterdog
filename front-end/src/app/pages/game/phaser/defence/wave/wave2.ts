import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave2Enemy extends Enemy {

    public static key = 'wave2Right'
    constructor(scene: DefenceStageScene) {
        let speed = 40;
        let hp = 10;
        let reward = 2

        super(scene, 'type2man', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.setHp(hp);
        this.setSpeed(speed);
        this.setReward(reward);
        this.setPath(scene.rightPath)
    }
}

export const wave2Config =
{
    direction: 'right',
    enemies: {

        [Wave2Enemy.key]: {
            name: '세상에 나쁜 개는 없다.',
            sub: '우리 개는 똥도 이뻐서 안 치워도 괜찮아~ 물지도 않아',
            imageKey: 'type2man',
            hp: 10,
            speed: 40,
            //1초 간격 10마리
            appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
            classType: Wave2Enemy
        }
    }
}


