import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { runnerGravity } from '../game.runner.config';



@Injectable()
export class RunnerTestScene extends Phaser.Scene {

    player: Phaser.Physics.Arcade.Sprite;


    gamePlatform: Phaser.Physics.Arcade.StaticGroup;
    voidPlatform: Phaser.Physics.Arcade.StaticGroup;




    bombs: Phaser.Physics.Arcade.Group

    isPlayingBGM: boolean = false

    test: string


    timeCheck: boolean = false;



    playerVelocity: number;


    scoreText: Phaser.GameObjects.Text;
    score: number = 0;


    soundFX: Phaser.Sound.BaseSound;

    doubleJump: number = 0;



    isDead: boolean = false;

    cursors: CursorKeys
    cameraLeader: Phaser.Physics.Arcade.Image;

    additionalAcceleration: number = 0;


    locketTrigger: Phaser.GameObjects.Image


    psycho1: Phaser.Physics.Arcade.Sprite
    psycho2: Phaser.Physics.Arcade.Sprite
    psycho3: Phaser.Physics.Arcade.Sprite
    psycho4: Phaser.Physics.Arcade.Sprite


    dropGround;
    dropCollider: Phaser.Physics.Arcade.Collider



    constructor() {
        super({
            key: 'test'
        })
    }

    preload() {



        this.load.image('sky', 'assets/game/imgs/sky.png');
        this.load.image('ground', 'assets/game/imgs/platform.png');
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
        this.load.image('bomb', 'assets/game/imgs/bomb.png');
        //


        this.load.audio('bgm', 'assets/game/music/background-music.mp3')

    }

    getObjectXPosition(second: number) {
        return (this.playerVelocity * second);
    }


    create() {
        // this.playerVelocity = this.game.loop.actualFps * 6;
        this.playerVelocity = 320;
        this.cameraLeader = this.physics.add.image(0, 0, 'bomb');

        this.soundFX = this.sound.add('bgm', { loop: true });
        this.soundFX.play();
        // this.cameraLeader = this.physics.add.
        this.add.image(0, 300, 'sky').setScale(100, 1.5);
        this.scoreText =
            this.add.text(100, 100, 'score: 0', { fontSize: '32px', fill: '#000' });
        // 물리적 그룹 설정


        this.gamePlatform = this.physics.add.staticGroup();
        this.voidPlatform = this.physics.add.staticGroup();

        // this.bombs = this.physics.add.group({ key: 'bomb', repeat: 11, setXY: { x: 12, y: 0, stepX: 70 } })

        this.gamePlatform.create(0, 380, 'ground').setScale(1, 4).refreshBody();
        this.gamePlatform.create(500, 380, 'ground').setScale(1, 4).refreshBody();
        this.gamePlatform.create(1000, 380, 'ground').setScale(1, 4).refreshBody();
        this.gamePlatform.create(1500, 380, 'ground').setScale(1, 4).refreshBody();
        this.gamePlatform.create(2000, 380, 'ground').setScale(1, 4).refreshBody();
        // this.gamePlatform.create(600, 300, 'ground')
        this.gamePlatform.create(this.getObjectXPosition(3), 100, 'ground')
        this.gamePlatform.create(this.getObjectXPosition(7), 100, 'ground')

        this.voidPlatform.create(0, 600, 'ground').setScale(100, 1).refreshBody();

        this.dropGround = this.physics.add.image(500, 200, 'ground');
        this.dropGround.setAccelerationY(-runnerGravity);


        this.player = this.physics.add.sprite(0, 280, 'dude');
        this.psycho1 = this.physics.add.sprite(this.getObjectXPosition(4), 300, 'psycho');
        this.locketTrigger = this.physics.add.staticImage(this.getObjectXPosition(7), 300, 'bomb');

        this.psycho2 = this.physics.add.sprite(this.getObjectXPosition(8), 350, 'psycho');
        // this.psycho2 = this.physics.add.sprite(this.getObjectXPosition(7), 420, 'psycho');





        //효과
        this.player.setBounce(0.15);
        this.player.setCollideWorldBounds(false);
        this.cursors = this.input.keyboard.createCursorKeys()
        // 플레이어의 애니메이션 정의
        this.anims.create({
            key: 'ready',
            frames: this.anims.generateFrameNames('psycho', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        })

        this.dropCollider = this.physics.add.collider(this.player, this.dropGround, () => {

        })


        // let a = this.physics.add.collider(this.player, this.locketTrigger, (one, two) => {
        //     this.psycho2.setVelocityY(-500)
        // }, null, this)
        // a.active = false;

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
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.input.keyboard.on(
            'space',
            (e) => {
                if (this.player.body.y < 20 || this.player.body.touching.down) {
                    this.player.setVelocityY(-300);
                }
            },
            this)
        this.input.on('pointerdown', (event) => {
            // this.psycho2.setVelocityY(-500);
            if (this.doubleJump < 2) {
                this.player.setVelocityY(-500)
                if (this.doubleJump == 0) {
                } else {
                    this.player.setAccelerationY(this.additionalAcceleration)
                }
                this.doubleJump++
            }

        })



        this.psycho1.anims.play('ready');


        // this.player.once()

        // this.physics.add.collider(villainGroup, this.gamePlatform, () => {

        // });
        // this.physics.add.overlap(this.player, this.locketTrigger, (player, test) => {
        //     console.log(this.psycho2)
        //     this.player.setVelocityY(-500)
        //     this.psycho2.setVelocityY(-500);
        // })

        this.physics.add.collider(this.bombs, this.gamePlatform, (sprite, platform) => {
            // console.log(sprite)
            // console.log(platform)
        }, () => {

        });

        this.physics.add.collider(this.gamePlatform, [this.player, this.psycho1]);
        // this.bombs = this.physics.add.group({ key: 'bomb', repeat: 11, setXY: { x: 12, y: 0, stepX: 70 } })
        // this.physics.add.overlap(
        //     this.player,
        //     this.bombs,
        //     (player, bomb) => {
        //     })

        this.physics.add.collider(this.voidPlatform, [this.psycho2]);


        this.physics.add.overlap(this.player, this.bombs, (player, bomb) => {
            (bomb as any).disableBody(true, true)
            this.cameras.main.shake(500, 0.01)
            // this.player.setTint(0xff0000);
            this.player.setVelocityX(0)
            // this.player.anims.play('turn');
            this.score += 10;

            this.scoreText.setText(`Score: ${this.score}`);
        })
        //빛

        // this.lights.enable().setAmbientColor(0x111111);
        // this.lights.addLight(0, 0, 100, 0xffff, 100);
        // (this.lights as any).addLight(400, 300, 300).setIntensity(0.5);


        // console.log(this.input.keyboard)
        // this.input.keyboard.on('keydown_LEFT', (e) => {
        //     console.log(this.input.keyboard)
        //     this.player.setVelocityX(-160)
        // }, this)

        // this.input.keyboard.on('keydown_RIGHT', () => {
        //     this.player.setVelocityX(160)
        // }, this)
        // this.input.keyboard.on('keyup_RIGHT', () => {
        //     console.log('up')
        //     this.player.setVelocityX(0)
        // }, this)
        // this.cameras.remove(this.cameras.getCamera(''))
        // this.cameras.add(0, 0, 800, 400, true, 'main-camera')
        // console.log(this.cameras.currentCameraId)
        // console.log(this.cameras.main)
        // this.cameras.main = this.cameras.getCamera('main-camera')
        // console.log(this.cameras.main)

        // this.cameras.add(100, 100, 300, 300, false, 'test-camera')
        // this.cameras.main.startFollow(this.player)

        // this.cameras.main.setBounds(100, 100, 100, 100)

        // this.cameras.main.followOffset.x = 100
        // this.cameras.main.startFollow(this.player, true, 1000, 0, -window.innerWidth / 2 + 100, 200);
        this.cameras.main.startFollow(this.cameraLeader, true, 1000, 0, -300, -240);
        // this.cameras.main.flash
        // timer = this.time.create(false);





    }
    update() {
        this.cameraLeader.y = 0;
        this.cameraLeader.setVelocityX(this.playerVelocity)

        if (this.player.y > 400) {
            console.log('dead')
            this.scene.stop('stage');
            this.cameras.main.stopFollow();
        }
        if (this.player.body.touching.right) {
            this.player.setVelocityX(0);
            this.isDead = true;
            console.log('touching dead')
            this.cameras.main.stopFollow();
        }

        // 플레이어는 초당 몇픽셀씩 간다 
        // 카메라는 브라우저의 fps에 맞춰 움직여야 한다. 플레이어와 동일 속도로 가려면 초당 60번 횟수를 돈다고 가정했을때.... 

        // this.cameras.main.scrollX += 6;

        if (this.player.x > this.getObjectXPosition(7) && this.player.x < this.getObjectXPosition(8)) {
            this.psycho2.setVelocityY(-500);
        }

        if (this.player.body.touching.down) {
            if (this.doubleJump > 0) {
                this.doubleJump = 0
            }
            this.additionalAcceleration = 0;
        } else {
            this.additionalAcceleration += 10;
        }

        this.dropCollider.active = this.player.y < this.dropGround.y;



        if (!this.isDead) {
            if (this.player.body.x >= 1600) {
                // this.player.setVelocityX(0)
                // this.cameras.main.scrollX++;
                // this.player.anims.play('turn', true);
            } else if (this.player.body.x <= 1600) {
                this.player.setVelocityX(this.playerVelocity);
                this.player.anims.play('right', true);
            }

        }

        // this.cameras.main.x++
        if (this.cursors.right.isDown) {
            // this.cameras.main.setPosition()
            // this.player.setVelocityX(160)
            // this.player.anims.play('right', true)
        }
        // else if (this.cursors.left.isDown) {
        //     this.player.setVelocityX(-160)
        //     // this.player.anims.play('left', true)
        // }
        // else {
        //     this.player.setVelocityX(0);
        //     // this.player.anims.play('turn', true);
        // }


    }
}

