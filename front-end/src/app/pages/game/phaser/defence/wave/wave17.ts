import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave17LeftEnemy extends Enemy {
    public static key = 'wave17Left';
    constructor(scene: DefenceStageScene) {
        let speed = 50;
        let hp = 220;
        let reward = 3
        super(scene, 'type2man', () => {
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

export const wave17Config =
{
    direction: 'left',
    restrictions: [],
    enemies: {
        [Wave17LeftEnemy.key]: {
            //1초 간격 10마리
            name: '술 강요',
            sub: '야 일단 마셔마셔~! 어~ 팔떨어지겠어~',
            imageKey: 'type2man',
            speed: 50,
            hp: 220,
            appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
            classType: Wave17LeftEnemy
        },
        // [Wave13Right2Enemy.key]: {
        //     //1초 간격 10마리
        //     appearInterval: [500, 500],
        //     classType: Wave13Right2Enemy
        // }
    }
}


