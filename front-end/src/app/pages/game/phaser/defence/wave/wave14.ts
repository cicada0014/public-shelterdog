import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave14Right1Enemy extends Enemy {
    public static key = 'wave14Right'
    constructor(scene: DefenceStageScene) {
        let speed = 100;
        let hp = 40;
        let reward = 3
        super(scene, 'type4man', () => {
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

export const wave14Config =
{
    direction : 'right',
    restrictions: [],
    enemies: {
        [Wave14Right1Enemy.key]: {
            //1초 간격 10마리
            speed: 100,
            hp: 40,
            name: '프로 새치기러',
            sub: '누구보다 빠르게 난 남들과는 다르게',
            imageKey: 'type4man',
            appearInterval: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            classType: Wave14Right1Enemy
        },
        // [Wave13Right2Enemy.key]: {
        //     //1초 간격 10마리
        //     appearInterval: [500, 500],
        //     classType: Wave13Right2Enemy
        // }
    }
}


