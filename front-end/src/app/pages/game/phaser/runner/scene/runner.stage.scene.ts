import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { runnerGravity } from '../game.runner.config';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class RunnerStageScene extends Phaser.Scene {


    intervalsArray = [];
    clientIp;


    player: Phaser.Physics.Arcade.Sprite;
    groundPlatform: Phaser.Physics.Arcade.StaticGroup;
    upperPlatform: Phaser.Physics.Arcade.StaticGroup;
    voidPlatform: Phaser.Physics.Arcade.StaticGroup;
    floatPlatform: Phaser.Physics.Arcade.Group;
    dummyPlatform: Phaser.Physics.Arcade.Group;
    obstacleGroup: Phaser.Physics.Arcade.Group;


    // bombs: Phaser.Physics.Arcade.Group
    isPlayingBGM: boolean = false
    isDead: boolean = false;
    isEnding: boolean = false;


    test: string
    timeCheck: boolean = false;
    playerVelocity: number;
    scoreText: Phaser.GameObjects.Text;
    score: number = 0;
    soundFX: Phaser.Sound.BaseSound;
    doubleJump: number = 0;
    cursors: CursorKeys
    cameraLeader: Phaser.Physics.Arcade.Image;
    additionalAcceleration: number = 0;



    psychos: Map<string, Phaser.Physics.Arcade.Sprite> = new Map();
    suprises: Map<string, Phaser.Physics.Arcade.Image> = new Map();

    uppers: Map<string, Phaser.Physics.Arcade.StaticBody> = new Map();

    floatGrounds: Map<string, Phaser.Physics.Arcade.Image> = new Map();

    feeders: Map<string, Phaser.Physics.Arcade.Sprite> = new Map();
    snipers: Map<string, Phaser.Physics.Arcade.Sprite> = new Map();



    toggle: number = 1;



    dummyObject1: Phaser.Physics.Arcade.Image;
    dummyObject2: Phaser.Physics.Arcade.Image;
    dummyObject3: Phaser.Physics.Arcade.Image;


    //collider


    floatCollider = new Map<string, Phaser.Physics.Arcade.Collider>();
    upperCollider = new Map<string, Phaser.Physics.Arcade.Collider>();

    //




    //

    groundYPos
    GROUND_Y_POS: number = 380


    constructor(private http: HttpClient) {
        super({
            key: 'stage'
        })
    }


    ngOnDestroy() {
        console.log('delte?')
    }

    preload() {



        this.load.image('sky', 'assets/game/imgs/sky.png');
        this.load.image('ground', 'assets/game/imgs/platform.png');
        this.load.image('float', 'assets/game/imgs/float-platform.png');
        this.load.spritesheet(
            'dude',
            'assets/game/imgs/5275man.png',
            {
                frameWidth: 50,
                frameHeight: 74
            }
        );
        this.load.spritesheet(`psycho`, 'assets/game/imgs/psycho_villain.png', {
            frameWidth: 50,
            frameHeight: 74
        })
        this.load.spritesheet(`sniper`, 'assets/game/imgs/sniper_villain.png', {
            frameWidth: 50,
            frameHeight: 74
        })
        this.load.spritesheet(`feeder`, 'assets/game/imgs/feeder_villain.png', {
            frameWidth: 50,
            frameHeight: 74
        })




        //
        this.load.image('bomb', 'assets/game/imgs/cucumber-slice.png');
        //
        //
        this.load.image('suprise', 'assets/game/imgs/cucumber-slice.png');
        //


        this.load.audio('bgm', 'assets/game/music/background-music.mp3')

    }

    create() {

        this.getClientIp();




        // this.playerVelocity = this.game.loop.actualFps * 6;
        this.playerVelocity = 320;
        this.cameraLeader = this.physics.add.image(0, 0, 'bomb');

        // 음악 관련
        this.settingMusic()
        //

        // 배경 
        this.add.image(0, 300, 'sky').setScale(100, 1.5);
        // this.scoreText =
        //     this.add.text(100, 100, 'score: 0', { fontSize: '32px', fill: '#000' });
        //
        // this.bombs = this.physics.add.group({ key: 'bomb', repeat: 11, setXY: { x: 12, y: 0, stepX: 70 } })
        //
        this.settingGroundPlatform();
        this.settingUpperPlatform();
        this.settingVoidPlatform();
        this.settingFloatPlatform();

        this.settingDummyPlatform();
        this.settingPlayer();

        this.settingVillain();
        this.settingObstacles();
        this.settingSuprises();
        this.settingInputEvent()
        this.settingCollider();
        this.settingCamera();






        //













    }
    update() {



        // 플레이어는 초당 몇픽셀씩 간다 
        // 카메라는 브라우저의 fps에 맞춰 움직여야 한다. 플레이어와 동일 속도로 가려면 초당 60번 횟수를 돈다고 가정했을때.... 

        // gameover 조건
        if (this.player.y > 550 || (this.cameras.main.scrollX - this.player.x > 15)) {
            this.gameOver();
        }
        //




        // 더블 점프 조건
        if (this.player.body.touching.down) {
            if (this.doubleJump > 0) {
                this.doubleJump = 0
            }
            this.additionalAcceleration = 0;
        } else {
            this.additionalAcceleration += 10;
        }
        //

        // 갑툭튀 장애물 조건
        if (this.player.x > this.getObjectXPosition(4) && this.player.x < this.getObjectXPosition(5)) {
            // this.dummyObject1.setAccelerationY(0);
        }
        if (this.player.x > this.getObjectXPosition(6) && this.player.x < this.getObjectXPosition(6) + 50) {
            this.suprises.get('7sec').setVelocityX(-100).setVelocityY(-600);
        }
        if (this.player.x > this.getObjectXPosition(7) && this.player.x < this.getObjectXPosition(7) + 50) {
            this.suprises.get('8sec').setVelocityX(-200).setVelocityY(-700);
        }
        if (this.player.x > this.getObjectXPosition(8) && this.player.x < this.getObjectXPosition(8) + 50) {
            this.suprises.get('9sec').setVelocityX(-300).setVelocityY(-800);
        }
        if (this.player.x > this.getObjectXPosition(13) && this.player.x < this.getObjectXPosition(13) + 10) {
            if (this.player.y < this.uppers.get('12sec').y) {
                this.floatGrounds.get('13sec').setAccelerationY(8000);
            }
        }
        if (this.player.x > this.getObjectXPosition(23) && this.player.x < this.getObjectXPosition(26)) {
            if (this.player.x < this.getObjectXPosition(25.5)) {
                this.feeders.get('24sec').setVelocityX(410);
            } else {
                this.feeders.get('24sec').setVelocityX(-100);
            }
        }
        if (this.player.x > this.getObjectXPosition(32) && this.player.x < this.getObjectXPosition(33)) {
            this.floatGrounds.get('33sec').setAccelerationY(0);
            this.floatGrounds.get('34sec').setAccelerationY(0);
        }
        if (this.player.x > this.getObjectXPosition(39) && this.player.x < this.getObjectXPosition(40.3)) {
            this.floatGrounds.get('40sec').setAccelerationY(-1500);
        }
        if (this.player.x > this.getObjectXPosition(48) && this.player.x < this.getObjectXPosition(50)) {
            this.suprises.get('49sec').setAcceleration(-200, -400).setVelocityX(-400)
            this.suprises.get('49.5sec').setAcceleration(-200, -400).setVelocityX(-400)
            this.suprises.get('50sec').setAcceleration(-200, -400).setVelocityX(-400)
        }

        if (this.player.x > this.getObjectXPosition(54) && this.player.x < this.getObjectXPosition(55)) {
            this.feeders.get('56sec').setVelocityX(-430);
        }
        if (this.player.x > this.getObjectXPosition(60) && this.player.x < this.getObjectXPosition(60) + 200) {
            this.floatGrounds.get('60sec').setAccelerationY(-1000).setAngularVelocity(-120);
        }

        if (this.player.x > this.getObjectXPosition(61)) {
            this.goEnding();
        }



        // 부딪힘 조건
        // this.upperCollider.overlapOnly



        // 죽지 않았을때 조건
        if (!this.isDead) {
            this.player.setVelocityX(this.playerVelocity);
            this.player.anims.play('right', true);
        }

        new Promise((res) => {
            this.obstacleGroup.getChildren().forEach(ob => {
                if (ob.body.y > 320) {
                    ob.destroy();
                }
            })
        })


    }





    getObjectXPosition(second: number) {
        return (this.playerVelocity * second);
    }

    settingMusic() {
        this.soundFX = this.sound.add('bgm', { loop: true });
        this.soundFX.play();
    }

    settingGroundPlatform() {
        // ground width 400 height 32
        const groundAdjustedRatio = this.playerVelocity / 400
        const groundYPos = this.GROUND_Y_POS;
        this.groundPlatform = this.physics.add.staticGroup();
        const holePositionBySec = {
            5: null,
            16: null,
            18: null,
            19: null,
            20: null,
            29: null,
            30: null,
            31: null,
            33: null,
            34: null,
            35: null,
            43: null,
            44: null,
            45: null,
            48: null,
            49: null,
            60: null,
        }
        for (let i = 0; i <= 62; i++) {
            if (i in holePositionBySec) {
                continue;
            }
            this.groundPlatform.create(this.getObjectXPosition(i), groundYPos, 'ground').setScale(groundAdjustedRatio, 3).refreshBody();
        }

    }
    settingUpperPlatform() {
        const groundAdjustedRatio = this.playerVelocity / 400
        this.upperPlatform = this.physics.add.staticGroup();


        this.uppers.set('12sec', this.upperPlatform.create(this.getObjectXPosition(12), 100, 'ground').setScale(groundAdjustedRatio * 2, 0.8).refreshBody());
        // this.forkedRoad['12sec200y'] = this.upperPlatform.create(this.getObjectXPosition(12), 200, 'ground').setScale(groundAdjustedRatio * 2, 0.8).refreshBody();


        this.uppers.set('25sec100y', this.upperPlatform.create(this.getObjectXPosition(25), 100, 'ground').setScale(groundAdjustedRatio * 3, 0.3).refreshBody());
        this.uppers.set('25sec220y', this.upperPlatform.create(this.getObjectXPosition(25), 220, 'ground').setScale(groundAdjustedRatio * 3, 0.3).refreshBody());

        this.uppers.set('34sec', this.upperPlatform.create(this.getObjectXPosition(34), 150, 'ground').setScale(groundAdjustedRatio * 1, 0.3).refreshBody());
        this.uppers.set('36sec', this.upperPlatform.create(this.getObjectXPosition(36), this.GROUND_Y_POS - 60, 'ground').setScale(0.4, 3).refreshBody());
        this.uppers.set('37sec', this.upperPlatform.create(this.getObjectXPosition(37), this.GROUND_Y_POS - 60, 'ground').setScale(0.4, 3).refreshBody());
        this.uppers.set('38sec', this.upperPlatform.create(this.getObjectXPosition(38), this.GROUND_Y_POS - 60, 'ground').setScale(0.4, 3).refreshBody());
        this.uppers.set('41sec', this.upperPlatform.create(this.getObjectXPosition(41), this.GROUND_Y_POS - 60, 'ground').setScale(0.4, 3).refreshBody());
        this.uppers.set('42sec', this.upperPlatform.create(this.getObjectXPosition(42), this.GROUND_Y_POS - 60, 'ground').setScale(0.4, 3).refreshBody());
        this.uppers.set('43sec', this.upperPlatform.create(this.getObjectXPosition(43), this.GROUND_Y_POS - 60, 'ground').setScale(0.4, 3).refreshBody());
        this.uppers.set('44sec', this.upperPlatform.create(this.getObjectXPosition(44), this.GROUND_Y_POS - 60, 'ground').setScale(0.4, 3).refreshBody());
        this.uppers.set('45sec', this.upperPlatform.create(this.getObjectXPosition(45), this.GROUND_Y_POS - 60, 'ground').setScale(0.4, 3).refreshBody());



        this.uppers.set('52sec130y', this.upperPlatform.create(this.getObjectXPosition(52), 130, 'ground').setScale(groundAdjustedRatio * 3, 0.3).refreshBody());
        this.uppers.set('52sec230y', this.upperPlatform.create(this.getObjectXPosition(52), 230, 'ground').setScale(groundAdjustedRatio * 3, 0.3).refreshBody());



        this.uppers.set('58sec148y', this.upperPlatform.create(this.getObjectXPosition(58), 148, 'ground').setScale(0.5, 1).refreshBody());
        this.uppers.set('58sec180y', this.upperPlatform.create(this.getObjectXPosition(58), 180, 'ground').setScale(0.5, 1).refreshBody());
        this.uppers.set('58sec300y', this.upperPlatform.create(this.getObjectXPosition(58), 300, 'ground').setScale(0.5, 2.5).refreshBody());


    }


    settingVoidPlatform() {

        this.voidPlatform = this.physics.add.staticGroup();
        this.voidPlatform.create(0, 500, 'ground').setScale(100, 1).refreshBody();
    }

    settingFloatPlatform() {
        const groundAdjustedRatio = this.playerVelocity / 400
        this.floatPlatform = this.physics.add.group();
        this.floatGrounds.set('13sec', this.floatPlatform.create(this.getObjectXPosition(13), 5, 'float').setScale(0.5, 0.5));
        this.floatGrounds.get('13sec').setAccelerationY(-runnerGravity)
        let toggle13point5 = 1;
        this.intervalsArray.push(
            setInterval(() => {
                toggle13point5 = toggle13point5 == 1 ? -1 : 1;
                this.floatGrounds.get('13sec').setAngularVelocity(toggle13point5 * 10);
            }, 100)
        )



        this.floatGrounds.set('16sec', this.floatPlatform.create(this.getObjectXPosition(16), this.GROUND_Y_POS, 'float').setScale(groundAdjustedRatio, 3));
        this.floatGrounds.get('16sec').setAccelerationY(-runnerGravity);
        this.floatGrounds.set('18.5sec', this.floatPlatform.create(this.getObjectXPosition(18.5), 300, 'float').setScale(groundAdjustedRatio, 1));
        this.floatGrounds.get('18.5sec').setAccelerationY(-runnerGravity);
        this.floatGrounds.set('20sec', this.floatPlatform.create(this.getObjectXPosition(20), this.GROUND_Y_POS, 'float').setScale(groundAdjustedRatio, 3));
        this.floatGrounds.get('20sec').setAccelerationY(-runnerGravity);

        this.floatGrounds.set('29.5sec', this.floatPlatform.create(this.getObjectXPosition(29.5), 200, 'float').setScale(0.5, 1));
        this.floatGrounds.get('29.5sec').setAccelerationY(-runnerGravity)
        this.floatGrounds.set('30.5sec', this.floatPlatform.create(this.getObjectXPosition(30.5), 200, 'float').setScale(0.5, 1));
        this.floatGrounds.get('30.5sec').setAccelerationY(-runnerGravity)
        this.floatGrounds.set('31.5sec', this.floatPlatform.create(this.getObjectXPosition(31.5), 200, 'float').setScale(0.5, 1));
        this.floatGrounds.get('30.5sec').setAccelerationY(-runnerGravity)


        this.floatGrounds.set('33sec', this.floatPlatform.create(this.getObjectXPosition(33), this.GROUND_Y_POS, 'float').setScale(groundAdjustedRatio, 3));
        this.floatGrounds.get('33sec').setAccelerationY(-runnerGravity);
        this.floatGrounds.set('34sec', this.floatPlatform.create(this.getObjectXPosition(33), this.GROUND_Y_POS, 'float').setScale(groundAdjustedRatio, 3));
        this.floatGrounds.get('34sec').setAccelerationY(-runnerGravity);

        this.floatGrounds.set('40sec', this.floatPlatform.create(this.getObjectXPosition(40), 230, 'float').setScale(groundAdjustedRatio * 1.5, 1));
        this.floatGrounds.get('40sec').setAccelerationY(-runnerGravity);

        this.floatGrounds.set('48sec', this.floatPlatform.create(this.getObjectXPosition(48), this.GROUND_Y_POS, 'float').setScale(groundAdjustedRatio, 3));
        this.floatGrounds.get('48sec').setAccelerationY(-runnerGravity);


        this.floatGrounds.set('58sec20y', this.floatPlatform.create(this.getObjectXPosition(58), 20, 'float').setScale(0.5, 1));
        this.floatGrounds.get('58sec20y').setAccelerationY(-runnerGravity);
        this.floatGrounds.set('58sec52y', this.floatPlatform.create(this.getObjectXPosition(58), 52, 'float').setScale(0.5, 1));
        this.floatGrounds.get('58sec52y').setAccelerationY(-runnerGravity);
        this.floatGrounds.set('58sec84y', this.floatPlatform.create(this.getObjectXPosition(58), 84, 'float').setScale(0.5, 1));
        this.floatGrounds.get('58sec84y').setAccelerationY(-runnerGravity);
        this.floatGrounds.set('58sec116y', this.floatPlatform.create(this.getObjectXPosition(58), 116, 'float').setScale(0.5, 1));
        this.floatGrounds.get('58sec116y').setAccelerationY(-runnerGravity);

        this.floatGrounds.set('60sec', this.floatPlatform.create(this.getObjectXPosition(60), this.GROUND_Y_POS, 'float').setScale(groundAdjustedRatio, 3));
        this.floatGrounds.get('60sec').setAccelerationY(-runnerGravity);
    }

    settingDummyPlatform() {
        this.dummyPlatform = this.physics.add.group();
    }


    settingVillain() {
        if (!this.anims.get('ready')) {
            this.anims.create({
                key: 'ready',
                frames: this.anims.generateFrameNames('psycho', { start: 0, end: 0 }),
                frameRate: 10,
                repeat: -1
            })
        }

        const startYPos = 280;

        for (let i = 2; i < 4; i++) {
            this.psychos.set(`${i}sec`, this.physics.add.sprite(this.getObjectXPosition(i), startYPos, 'psycho'));
        }

        this.feeders.set('12.5sec', this.physics.add.sprite(this.getObjectXPosition(12.5), startYPos, 'feeder'));
        let toggle12point5sec = 1;
        this.intervalsArray.push(
            setInterval(() => {
                toggle12point5sec = toggle12point5sec == 1 ? -1 : 1;
                this.feeders.get(`12.5sec`).setVelocityX(toggle12point5sec * this.playerVelocity);
            }, 500)
        )

        this.psychos.set(`15sec`, this.physics.add.sprite(this.getObjectXPosition(15), startYPos, 'psycho'));

        this.feeders.set('24sec', this.physics.add.sprite(this.getObjectXPosition(24), 0, 'feeder'));
        this.psychos.set(`37sec`, this.physics.add.sprite(this.getObjectXPosition(37), 0, 'psycho'));
        this.feeders.set(`39sec`, this.physics.add.sprite(this.getObjectXPosition(39), 0, 'feeder'));
        this.intervalsArray.push(
            setInterval(() => {
                if (this.feeders.get(`39sec`).body.touching.down) {
                    this.feeders.get(`39sec`).setVelocity(-5, -900);
                }
            }, 200)
        )
        this.psychos.set(`42.5sec`, this.physics.add.sprite(this.getObjectXPosition(42.5), startYPos, 'psycho'));
        this.psychos.set(`45sec`, this.physics.add.sprite(this.getObjectXPosition(42.5), 0, 'psycho'));



        this.snipers.set('22sec', this.physics.add.sprite(this.getObjectXPosition(22), startYPos, 'sniper'));
        this.snipers.set('46sec', this.physics.add.sprite(this.getObjectXPosition(46), startYPos, 'sniper'));


        this.psychos.set(`53secStarty`, this.physics.add.sprite(this.getObjectXPosition(53), startYPos, 'psycho'));
        this.psychos.set(`53sec200y`, this.physics.add.sprite(this.getObjectXPosition(53), 100, 'psycho'));


        this.feeders.set(`56sec`, this.physics.add.sprite(this.getObjectXPosition(56), 0, 'feeder'));


    }

    settingSuprises() {
        this.suprises.set('7sec', this.physics.add.image(this.getObjectXPosition(7), 400, 'suprise'));
        this.suprises.set('8sec', this.physics.add.image(this.getObjectXPosition(8), 400, 'suprise'));
        this.suprises.set('9sec', this.physics.add.image(this.getObjectXPosition(9), 400, 'suprise'));
        this.suprises.set('10sec', this.physics.add.image(this.getObjectXPosition(10), 180, 'suprise'));
        this.suprises.get('10sec').setAccelerationY(-runnerGravity).setVelocityX(-120).setAngularVelocity(80)
        this.suprises.set('11sec', this.physics.add.image(this.getObjectXPosition(11), 180, 'suprise'));
        this.suprises.get('11sec').setAccelerationY(-runnerGravity).setVelocityX(-120).setAngularVelocity(80)
        this.suprises.set('12sec', this.physics.add.image(this.getObjectXPosition(12), 180, 'suprise'));
        this.suprises.get('12sec').setAccelerationY(-runnerGravity).setVelocityX(-120).setAngularVelocity(80)


        this.suprises.set('49sec', this.physics.add.image(this.getObjectXPosition(49), 0, 'suprise'));
        this.suprises.get('49sec').setAccelerationY(-runnerGravity).setAngularVelocity(80)
        this.suprises.set('49.5sec', this.physics.add.image(this.getObjectXPosition(49.5), 0, 'suprise'));
        this.suprises.get('49.5sec').setAccelerationY(-runnerGravity).setAngularVelocity(80)
        this.suprises.set('50sec', this.physics.add.image(this.getObjectXPosition(50), 0, 'suprise'));
        this.suprises.get('50sec').setAccelerationY(-runnerGravity).setAngularVelocity(80)
    }


    settingObstacles() {
        this.obstacleGroup = this.physics.add.group();
        this.intervalsArray.push(setInterval(() => {
            const cucumber = this.physics.add.image(this.snipers.get('22sec').x, this.snipers.get('22sec').y, 'bomb')
            this.obstacleGroup.add(cucumber);
            cucumber.setVelocity(Phaser.Math.RND.integerInRange(-300, -200), -700);
        }, 1100))
        this.intervalsArray.push(setInterval(() => {
            const cucumber = this.physics.add.image(this.snipers.get('46sec').x, this.snipers.get('46sec').y, 'bomb')
            this.obstacleGroup.add(cucumber);
            cucumber.setVelocity(Phaser.Math.RND.integerInRange(-450, -200), -1200);
        }, 2000))




        this.add.text(this.getObjectXPosition(47.5), 200, '2 + 2 x 2 = ?', {
            fontSize: '25px',
            color: '#000'
        })
        this.add.text(this.getObjectXPosition(50) + 10, 100, '6', {
            fontSize: '25px',
            color: '#000'
        })
        this.add.text(this.getObjectXPosition(50) + 10, 190, '8', {
            fontSize: '25px',
            color: '#000'
        })
        this.add.text(this.getObjectXPosition(50) + 10, this.GROUND_Y_POS - 40, '두뇌 풀가동!', {
            fontSize: '25px',
            color: '#000'
        })
        this.add.text(this.getObjectXPosition(54), 150, '9와 3/4 정거장을 떠올려라 ', {
            fontSize: '30px',
            color: '#000'
        })
        this.add.text(this.getObjectXPosition(56), 150, '보이는 것이 전부가 아닐지니', {
            fontSize: '30px',
            color: '#000'
        })

    }


    settingPlayer() {
        const startYPos = 280;

        this.player = this.physics.add.sprite(0, startYPos, 'dude');
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(false);
        // 플레이어의 애니메이션 정의
        // this.anims.create({
        //     key: 'left',
        //     frames: this.anims.generateFrameNames('dude', { start: 0, end: 1 }),
        //     frameRate: 10,
        //     repeat: -1
        // });
        // this.anims.create({
        //     key: 'turn',
        //     frames: [{ key: 'dude', frame: 4 }],
        //     frameRate: 20
        // });
        if (!this.anims.get('right')) {
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }
    }


    settingInputEvent() {
        //효과
        this.cursors = this.input.keyboard.createCursorKeys()

        this.input.keyboard.on(
            'space',
            (e) => {
                if (this.player.body.y < 20 || this.player.body.touching.down) {
                    this.player.setVelocityY(-300);
                }
            },
            this)
        this.input.on('pointerdown', (event) => {

            //
            this.feeders.get('56sec').setVelocityY(-200)
            //


            if (this.doubleJump < 2) {
                if (this.doubleJump == 0) {
                    this.player.setAccelerationY(0)
                } else {
                    this.player.setAccelerationY(this.additionalAcceleration)
                }
                if (this.player.body.touching.down || this.doubleJump == 1) {
                    this.player.setVelocityY(-500)
                }
                this.doubleJump++
            }

        })

    }

    settingCollider() {
        //플레이어 충돌 정의

        this.physics.add.collider(this.player, this.groundPlatform);
        this.physics.add.collider(this.player, this.floatPlatform.getChildren());
        this.physics.add.collider(this.player, this.upperPlatform);
        this.physics.add.overlap(this.player, [
            ...Array.from(this.psychos.values()),
            ...Array.from(this.feeders.values()),
            ...Array.from(this.snipers.values()),
            ...Array.from(this.suprises.values()),
        ],
            (obj1, obj2) => {
                let _body1: Phaser.Physics.Arcade.Body = obj1.body;
                let _body2: Phaser.Physics.Arcade.Body = obj2.body;
                if (
                    (
                        (
                            (_body1.center.x + _body1.width / 4) >= (_body2.center.x - _body2.width / 2)
                            ||
                            (_body1.center.x - _body1.width / 4) >= (_body2.center.x - _body2.width / 2)
                        )
                        &&
                        (
                            (_body1.center.y + _body1.height / 4) <= (_body2.center.y + _body2.height / 2)
                            ||
                            (_body1.center.y - _body1.height / 4) <= (_body2.center.y + _body2.height / 2)
                        )
                    )
                    &&
                    (
                        (
                            (_body1.center.x + _body2.width / 4) <= (_body2.center.x + _body2.width / 2)
                            ||
                            (_body1.center.x - _body2.width / 4) <= (_body2.center.x + _body2.width / 2)
                        )
                        &&
                        (
                            (_body1.center.y - _body2.height / 4) >= (_body2.center.y - _body2.height / 2)
                            ||
                            (_body1.center.y + _body2.height / 4) >= (_body2.center.y - _body2.height / 2)
                        )
                    )
                ) {
                    this.gameOver();
                }

            });
        this.physics.add.collider(this.player, this.dummyPlatform);


        this.physics.add.collider(this.player, this.obstacleGroup, () => {
            this.gameOver()
        })

        // 플레이어 -->




        this.physics.add.collider([this.groundPlatform, this.upperPlatform], [
            ...Array.from(this.psychos.values()),
            ...Array.from(this.feeders.values()),
            ...Array.from(this.snipers.values()),
        ])
        this.physics.add.collider([this.feeders.get('24sec')], this.upperPlatform);

        this.physics.add.collider(this.voidPlatform, Array.from(this.suprises.values()));


        this.physics.add.collider(this.groundPlatform, this.dummyPlatform);



    }

    settingCamera() {
        this.cameraLeader.y = 0;
        this.cameraLeader.setVelocityX(this.playerVelocity)
        this.cameras.main.startFollow(this.cameraLeader, true, 1000, 0, -300, -200);
    }


    getClientIp() {
        let count = 0;
        if (localStorage.getItem('runner-try')) {
            count = parseInt(localStorage.getItem('runner-try'));
        } else {
            count++
            localStorage.setItem('runner-try', count + '')
        }
        this.http
            .jsonp('https://api.ipify.org/?format=jsonp', 'callback')
            .toPromise()
            .then((r: any) => {
                console.log(r)
                
                this.clientIp = r.ip;
                this.http
                    .post('game/runner/try', {
                        count,
                        ip: this.clientIp
                    })
                    .toPromise()
                    .then(r => {
                        count++
                        localStorage.setItem('runner-try', count + '')
                    })
                    .catch(e => {
                        console.log(e)
                    })
            })
            .catch(e => {
                this.http
                    .post('game/runner/try', {
                        count,
                        ip: this.clientIp
                    })
                    .toPromise()
                    .then(r => {
                        count++
                        localStorage.setItem('runner-try', count + '')
                    })
                    .catch(e => {
                        console.log(e)
                    })
                console.log(e)
            })
    }


    goEnding() {
        if (!this.isEnding) {
            this.soundFX.stop();
            this.isEnding = true
            this.cameras.main.stopFollow();
            this.cameras.main.fadeOut(1000);
            this.http
                .post('game/runner/ending', {
                    ip: this.clientIp
                })
                .toPromise()
                .catch(e => {

                })
            this.intervalsArray.forEach(i => {
                clearInterval(i);
            })
            setTimeout(() => {
                this.reset();
                this.scene.start('ending')
            }, 1000);
        }
    }

    gameOver() {
        if (this.isDead) {
            return
        }
        this.player.setVelocityX(0);
        this.soundFX.stop();
        this.isDead = true;
        this.cameras.main.stopFollow();
        this.cameras.main.fadeOut(1000);
        this.intervalsArray.forEach(i => {
            clearInterval(i);
        })
        setTimeout(() => {
            this.reset();
            this.scene.stop('stage');
            // this.game.d
            this.scene.start('gameover')
        }, 1500);
    }

    reset() {
        this.isDead = false;
    }

}




/*
초별 장애물 
3sec 사이코 psycho
7sec 아래에서 깜짝 등장  suprise
8sec 아래에서 깜짝 등장 suprise
9sec 아래에서 깜짝 등장 suprise
10sec 수평으로 날아오는 깜짝 장애물suprise
11sec 수평으로 날아오는 깜짝 장애물suprise
12sec 수평으로 날아오는 깜짝 장애물suprise
12sec 그냥 갈림길 (위에는 아무것도 없지만 위가 막혀있어서 점프하기 힘듬.) upper
12.5sec 앞뒤로 돌아대기는 피더 feeder
13sec 똑 떨어지는 구조물 float
15sec 사이코 psycho
16sec 낭떠러지 float
18sec 걍 구멍 ground
18.5sec 떨어지는 발판 
20sec 낭떠러지 float
22sec 스나이퍼 sniper
24sec 단순 갈림길 upper
24sec 220y 피더 feeder
29~31sec 구멍인데  그 위에 떨어지는 발판  float ground
33sec 근처 땅이 사라짐  float
35sec 구멍 ground
36sec 장애물  upper
37sec 장애물  upper
37sec 사이코  psycho
38sec 장애물  upper
41~45sec 장애물  upper
42.5sec 사이코 psycho
43~56sec 구멍
45sec 사이코 psycho
39sec 피더 계속 제자리 점프! 

46sec 스나이퍼 sniper
46sec 스나이퍼 sniper 

48sec 낭떠러지
49sec 구멍
49~50sec 하늘에서 깜짝 공격
51sec 퀴즈  obstacle
52sec 퀴즈 답에 대한 갈림길 upper


56sec feeder (뛰어오다가 같이 뜀 거울상이기 떄문에 점프력의 차이를 이용해서 공략해야 함)

58sec 딱맞춰 안착하기 upper

60sec 마지막 낭떠러지 
*/