import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave3Enemy extends Enemy {

    public static key = 'wave3Left'
    constructor(scene: DefenceStageScene) {
        let speed = 60;
        let hp = 20;
        let reward = 2
        super(scene, 'type4man', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.setHp(hp);
        this.setSpeed(speed);
        this.setReward(reward);
        this.setPath(scene.leftPath)
    }
}

export const wave3Config =
{
    direction: 'left',
    enemies: {

        [Wave3Enemy.key]: {
            name: '버스 민폐류',
            sub: '으따~ 역시 의자는 뒤로 확 제껴야 제맛이제~',
            imageKey: 'type4man',
            speed: 60,
            hp: 20,
            //1초 간격 10마리
            appearInterval: [800, 800, 800, 800, 800, 800, 800, 800, 800, 800],
            classType: Wave3Enemy
        }
    }
}


