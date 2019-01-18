import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave24Right1Enemy extends Enemy {
    public static key = 'wave24Right1';
    constructor(scene: DefenceStageScene) {
        let speed = 45;
        let hp = 240;
        let reward = 5
        super(scene, 'type2woman', () => {
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
export class Wave24Right2Enemy extends Enemy {
    public static key = 'wave24Right2';
    constructor(scene: DefenceStageScene) {
        let speed = 90;
        let hp = 80;
        let reward = 3
        super(scene, 'type3woman', () => {
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

export const wave24Config =
{
    direction: 'right',
    restrictions: ['quick', 'long_distance'],
    enemies: {
        [Wave24Right1Enemy.key]: {
            //1초 간격 10마리
            speed: 45,
            hp: 240,
            name: '똥고집',
            sub: '아 몰라~~ 나만 맞아~ 응 아니야',
            imageKey: 'type2woman',
            appearInterval: [100, 100, 100],
            classType: Wave24Right1Enemy
        },
        [Wave24Right2Enemy.key]: {
            speed: 90,
            hp: 80,
            //1초 간격 10마리
            name: '똥고집2',
            sub: '아니거든?! 하... 내가 맞다고...',
            imageKey: 'type3woman',
            appearInterval: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500,],
            classType: Wave24Right2Enemy
        }
    }
}


