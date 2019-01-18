import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave16RightEnemy extends Enemy {
    public static key = 'wave16Right';
    constructor(scene: DefenceStageScene) {
        let speed = 80;
        let hp = 20;
        let reward = 3
        super(scene, 'type4woman', () => {
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

export const wave16Config =
{
    direction : 'right',
    restrictions: ['basic', 'quick'],
    enemies: {
        [Wave16RightEnemy.key]: {
            speed: 80,
            hp: 20,
            name: '학벌충',
            sub: 'xx대학교? 일 잘 못하겠네요~',
            imageKey: 'type4woman',
            //1초 간격 10마리
            appearInterval: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500],
            classType: Wave16RightEnemy
        },
        // [Wave13Right2Enemy.key]: {
        //     //1초 간격 10마리
        //     appearInterval: [500, 500],
        //     classType: Wave13Right2Enemy
        // }
    }
}


