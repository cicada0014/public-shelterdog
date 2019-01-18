import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave13Left1Enemy extends Enemy {
    public static key = 'wave13Left1'
    constructor(scene: DefenceStageScene) {
        let speed = 40;
        let hp = 30;
        let reward = 3
        super(scene, 'type1woman', () => {
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
// export class Wave13Right2Enemy extends Enemy {
//     public static key = 'wave13Right2'
//     constructor(scene: DefenceStageScene) {
//         let speed = 40;
//         let hp = 200;
//         let reward = 4
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

export const wave13Config =
{
    direction : 'left',
    restrictions: ['basic'],
    enemies: {
        [Wave13Left1Enemy.key]: {
            //1초 간격 10마리
            speed: 40,
            hp: 30,
            name: '담배 쩐내',
            sub: '쩐내에 커피까지 마시면? 화룡정점!',
            imageKey: 'type1woman',
            appearInterval: [350, 350, 350, 350, 350, 350, 350, 350, 350, 350],
            classType: Wave13Left1Enemy
        },
        // [Wave13Right2Enemy.key]: {
        //     //1초 간격 10마리
        //     appearInterval: [500, 500],
        //     classType: Wave13Right2Enemy
        // }
    }
}


