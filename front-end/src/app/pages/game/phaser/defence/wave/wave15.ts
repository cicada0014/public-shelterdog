import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave15LeftEnemy extends Enemy {
    public static key = 'wave15Left';
    constructor(scene: DefenceStageScene) {
        let speed = 100;
        let hp = 35;
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

export const wave15Config =
{
    direction: 'left',
    restrictions: ['quick'],
    enemies: {
        [Wave15LeftEnemy.key]: {
            //1초 간격 10마리
            speed: 100,
            hp: 35,
            name: '내 지갑만 소중해',
            sub: '오늘 너가 사라~ , 너가 쏠래?',
            imageKey: 'type3man',
            appearInterval: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
            classType: Wave15LeftEnemy
        },
        // [Wave13Right2Enemy.key]: {
        //     //1초 간격 10마리
        //     appearInterval: [500, 500],
        //     classType: Wave13Right2Enemy
        // }
    }
}


