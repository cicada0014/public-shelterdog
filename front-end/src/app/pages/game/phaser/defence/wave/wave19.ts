import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave19LeftEnemy extends Enemy {
    public static key = 'wave19Left1';
    constructor(scene: DefenceStageScene) {
        let speed = 70;
        let hp = 85;
        let reward = 4
        super(scene, 'type3man', () => {
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
// export class Wave18Right2Enemy extends Enemy {
//     public static key = Wave18Right2Enemy.name
//     constructor(scene: DefenceStageScene) {
//         let speed = 80;
//         let hp = 16;
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

export const wave19Config =
{
    direction: 'left',
    restrictions: ['basic'],
    enemies: {
        [Wave19LeftEnemy.key]: {
            speed: 34,
            hp: 110,
            //1초 간격 10마리
            name: '잘난 척',
            sub: '헐~~ 이것도 몰라? ㅎㅎ 이거는...',
            imageKey: 'type3man',
            appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
            classType: Wave19LeftEnemy
        },
        // [Wave18Right2Enemy.key]: {
        //     //1초 간격 10마리
        //     appearInterval: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
        //     classType: Wave18Right2Enemy
        // }
    }
}


