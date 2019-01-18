import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave30Left1Enemy extends Enemy {
    public static key = 'wave30Left1'
    constructor(scene: DefenceStageScene) {
        let speed = 30;
        let hp = 6800;
        let reward = 60
        super(scene, 'type2man', () => {
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
export class Wave30Right1Enemy extends Enemy {
    public static key = 'wave30Right1'
    constructor(scene: DefenceStageScene) {
        let speed = 30;
        let hp = 6800;
        let reward = 60
        super(scene, 'type2man', () => {
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
// export class Wave30Left3Enemy extends Enemy {
//     public static key = Wave30Left3Enemy.name
//     constructor(scene: DefenceStageScene) {
//         let speed = 55;
//         let hp = 330;
//         let reward = 10
//         super(scene, 'type1man', () => {
//             this.setHp(hp)
//             this.setSpeed(speed)
//             this.setReward(reward);
//         })
//         this.setHp(hp)
//         this.setSpeed(speed)
//         this.setReward(reward);
//         this.setPath(scene.leftPath)
//     }
// }
// export class Wave30Left4Enemy extends Enemy {
//     public static key = Wave30Left4Enemy.name
//     constructor(scene: DefenceStageScene) {
//         let speed = 80;
//         let hp = 60;
//         let reward = 1
//         super(scene, 'type1man', () => {
//             this.setHp(hp)
//             this.setSpeed(speed)
//             this.setReward(reward);
//         })
//         this.setHp(hp)
//         this.setSpeed(speed)
//         this.setReward(reward);
//         this.setPath(scene.rightPath)
//     }
// }

export const wave30Config =
{
    direction: 'both',
    restrictions: [],
    enemies: {
        [Wave30Left1Enemy.key]: {
            //1초 간격 10마리
            speed: 30,
            hp: 7800,
            appearInterval: [0],
            name: '분노 조절 잘해',
            sub: '으어어어!! ',
            imageKey: 'type2man',
            classType: Wave30Left1Enemy
        },
        [Wave30Right1Enemy.key]: {
            //1초 간격 10마리
            speed: 30,
            hp: 7800,
            appearInterval: [0],
            name: '분노 조절 잘해',
            imageKey: 'type2man',
            sub: '으어어어!! ',
            classType: Wave30Right1Enemy
        },
        // [Wave30Left3Enemy.key]: {
        //     //1초 간격 10마리
        //     appearInterval: [1500, 1500, 1500, 1500, 1500,],
        //     classType: Wave30Left3Enemy
        // },
        // [Wave30Left4Enemy.key]: {
        //     //1초 간격 10마리
        //     appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,],
        //     classType: Wave30Left4Enemy
        // }
    }
}


