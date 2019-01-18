import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave10LeftEnemy extends Enemy {
    public static key = 'wave10Left'
    constructor(scene: DefenceStageScene) {
        let speed = 20;
        let hp = 800;
        let reward = 25
        super(scene, 'type3woman', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.setScale(1.4)
        this.isBoss = true;
        this.playerLifeDamage = 5
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.leftPath)
    }
}
export class Wave10RightEnemy extends Enemy {
    public static key = 'wave10Right'
    constructor(scene: DefenceStageScene) {
        let speed = 20;
        let hp = 800;
        let reward = 25
        super(scene, 'type3woman', () => {
            this.setHp(hp)
            this.setSpeed(speed)
            this.setReward(reward);
        })
        this.setScale(1.4)
        this.isBoss = true;
        this.playerLifeDamage = 5
        this.setHp(hp)
        this.setSpeed(speed)
        this.setReward(reward);
        this.setPath(scene.rightPath)
    }
}

export const wave10Config =
{
    direction: 'both',
    enemies: {
        [Wave10LeftEnemy.key]: {
            //1초 간격 10마리
            name: '인신 공격',
            sub: '다이어트 안해~? 좀 빼면 좋을텐데 ㅎㅎ ㅋ;',
            imageKey: 'type3woman',
            appearInterval: [400],
            speed: 20,
            hp: 800,
            classType: Wave10LeftEnemy
        },
        [Wave10RightEnemy.key]: {
            //1초 간격 10마리
            name: '인신 공격',
            sub: '다이어트 안해~? 좀 빼면 좋을텐데 ㅎㅎ ㅋ;',
            imageKey: 'type3woman',
            speed: 20,
            hp: 800,
            appearInterval: [400],
            classType: Wave10RightEnemy
        }
    }
}


