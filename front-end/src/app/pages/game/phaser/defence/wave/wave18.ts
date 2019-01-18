import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave18Right1Enemy extends Enemy {
    public static key = 'wave18Right1';
    constructor(scene: DefenceStageScene) {
        let speed = 65;
        let hp = 260;
        let reward = 8
        super(scene, 'type2woman', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        // this.setScale(1.25)
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.rightPath)
    }
}
export class Wave18Right2Enemy extends Enemy {
    public static key = 'wave18Right2'
    constructor(scene: DefenceStageScene) {
        let speed = 85;
        let hp = 16;
        let reward = 1
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

export const wave18Config =
{
    direction: 'right',
    restrictions: [],
    enemies: {
        [Wave18Right1Enemy.key]: {
            //1초 간격 10마리
            speed: 65,
            hp: 260,
            name: '책임 회피러',
            sub: '잘된 것은 내 덕분, 잘못된 것은 너 때문',
            imageKey: 'type2woman',
            appearInterval: [50, 50],
            classType: Wave18Right1Enemy
        },
        [Wave18Right2Enemy.key]: {
            //1초 간격 10마리
            speed: 85,
            hp: 16,
            name: '책임 회피러2',
            sub: '내가 그거 안 된다고 했잖아~ 그러게 하지 말라니깐...',
            imageKey: 'type1man',
            appearInterval: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
            classType: Wave18Right2Enemy
        }
    }
}


