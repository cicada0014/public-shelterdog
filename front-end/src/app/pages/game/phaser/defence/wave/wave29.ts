import { Enemy } from "../objects/enemy";
import { DefenceStageScene } from "../scene/defence.stage.scene";

export class Wave29Left1Enemy extends Enemy {
    public static key = 'wave29Left1'
    constructor(scene: DefenceStageScene) {
        let speed = 40;
        let hp = 900;
        let reward = 20
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
export class Wave29Left2Enemy extends Enemy {
    public static key = 'wave29Left2'
    constructor(scene: DefenceStageScene) {
        let speed = 50;
        let hp = 350;
        let reward = 6
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
export class Wave29Left3Enemy extends Enemy {
    public static key = 'wave29Left3'
    constructor(scene: DefenceStageScene) {
        let speed = 70;
        let hp = 150;
        let reward = 3
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
// export class Wave29Left4Enemy extends Enemy {
//     public static key = Wave29Left4Enemy.name
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

export const wave29Config =
{
    direction: 'left',
    restrictions: [],
    enemies: {
        [Wave29Left1Enemy.key]: {
            //1초 간격 10마리
            speed: 40,
            hp: 900,
            name: '내로남불',
            sub: '내가 하면 로맨스. 너가 하면 불륜!',
            imageKey: 'type2woman',
            appearInterval: [1200, 1200],
            classType: Wave29Left1Enemy
        },
        [Wave29Left2Enemy.key]: {
            //1초 간격 10마리
            speed: 50,
            hp: 350,
            name: '이중 잣대',
            sub: '(이 사람에겐)다음부턴 그러지마세요.(저 사람에겐)용서 할 수가 없네',
            imageKey: 'type2man',
            appearInterval: [1000, 1000, 1000, 1000, 1000],
            classType: Wave29Left2Enemy
        },
        [Wave29Left3Enemy.key]: {
            //1초 간격 10마리
            speed: 70,
            hp: 150,
            name: '말 바꾸기',
            sub: '(하루 전)이렇게 하면 안 되지! (당일)이렇게 하면 될거 아냐! 아오 답답해! ',
            imageKey: 'type3man',
            appearInterval: [1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500, 1500,],
            classType: Wave29Left3Enemy
        },
        // [Wave29Left4Enemy.key]: {
        //     //1초 간격 10마리
        //     appearInterval: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,],
        //     classType: Wave29Left4Enemy
        // }
    }
}


