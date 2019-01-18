import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave23Left1Enemy extends Enemy {
    public static key = 'wave23Left1';
    constructor(scene: DefenceStageScene) {
        let speed = 35;
        let hp = 400;
        let reward = 5
        super(scene, 'type2woman', () => {
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
// export class Wave22Right2Enemy extends Enemy {
//     public static key = Wave22Right2Enemy.name
//     constructor(scene: DefenceStageScene) {
//         let speed = 70;
//         let hp = 50;
//         let reward = 2
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

export const wave23Config =
{
    direction : 'left',
    restrictions: [],
    enemies: {
        [Wave23Left1Enemy.key]: {
            speed: 35,
            hp: 400,
            name: '빌려놓고 안 주는',
            sub: '아~ 맞다~ 좀만 이따 줄게 ㅎㅎ',
            imageKey: 'type2woman',
            //1초 간격 10마리
            appearInterval: [1100, 1100, 1100, 1100, 1100, 1100, 1100, 1100, 1100, 1100,],
            classType: Wave23Left1Enemy
        },
        // [Wave22Right2Enemy.key]: {
        //     //1초 간격 10마리
        //     appearInterval: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200,],
        //     classType: Wave22Right2Enemy
        // }
    }
}


