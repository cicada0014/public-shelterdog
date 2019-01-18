import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave21LeftEnemy extends Enemy {
    public static key = 'wave21Left';;
    constructor(scene: DefenceStageScene) {
        let speed = 45;
        let hp = 180;
        let reward = 4
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
// export class Wave20Right2Enemy extends Enemy {
//     public static key = Wave20Right2Enemy.name
//     constructor(scene: DefenceStageScene) {
//         let speed = 50;
//         let hp = 500;
//         let reward = 30
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

export const wave21Config =
{
    direction: 'left',
    restrictions: ['basic'],
    enemies: {
        [Wave21LeftEnemy.key]: {
            name: '투덜이',
            speed: 55,
            hp: 200,
            sub: '이것도 짜증나, 저것도 짜증나 !@#$%^',
            imageKey: 'type2man',
            //1초 간격 10마리
            appearInterval: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500,],
            classType: Wave21LeftEnemy
        },
        // [Wave20Right2Enemy.key]: {
        //     //1초 간격 10마리
        //     appearInterval: [1000],
        //     classType: Wave20Right2Enemy
        // }
    }
}


