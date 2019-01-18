import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class WaveBonus1Left1Enemy extends Enemy {
    public static key = 'waveBonus1Left1'
    constructor(scene: DefenceStageScene) {
        let speed = 70;
        let hp = 10;
        let reward = 2
        super(scene, 'dog1', () => {
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
export class WaveBonus1Right1Enemy extends Enemy {
    public static key = 'waveBonus1Right1'
    constructor(scene: DefenceStageScene) {
        let speed = 70;
        let hp = 10;
        let reward = 2
        super(scene, 'dog1', () => {
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

export const waveBonus1Config =
{
    direction: 'both',
    restrictions: [],
    isBonus: true,
    enemies: {
        [WaveBonus1Left1Enemy.key]: {
            //1초 간격 10마리
            name: '짜증날 땐 쉘터독',
            sub: '같은 생각을 하고 있는 사람들과 소통해보세요!',
            imageKey: 'dog1',
            speed: 70,
            hp: 10,
            appearInterval: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            classType: WaveBonus1Left1Enemy
        },
        [WaveBonus1Right1Enemy.key]: {
            //1초 간격 10마리
            name: '짜증날 땐 쉘터독',
            sub: '같은 생각을 하고 있는 사람들과 소통해보세요!',
            imageKey: 'dog1',
            speed: 70,
            hp: 10,
            appearInterval: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            classType: WaveBonus1Right1Enemy
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


