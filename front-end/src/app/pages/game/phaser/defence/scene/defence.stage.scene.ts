import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { Type1ManEnemy, HealthBar, Enemy, Type4ManEnemy, Type3ManEnemy, Type2ManEnemy, Type1WomanEnemy, Type3WomanEnemy, Type4WomanEnemy, Type2WomanEnemy } from '../objects/enemy';
import { Bullet, BombEffect, EggBullet, PunchBullet, TextboxBullet, DropSpitBullet, StoneBullet } from '../objects/bullet';
import { BasicTurret, Turret, QuickTurret, SlowDebuffTurret, LongDistanceTurret } from '../objects/turret';
import { Observable, Subject } from 'rxjs';
import { waveTotal } from '../wave/wave.total';
import { HttpClient } from '@angular/common/http';
import { DefenceGameWindow, } from '../objects/window';
import { select } from '@angular-redux/store';
import { DeviceAttribute } from 'src/app/redux/device/device.action';
import { DefenceSettingScene } from './defence.setting.scene';
import { GameTimeService } from '../../../lib/time.service';
import { UsersAttribute } from 'src/app/types/schema.types';
import { wave35Config } from '../wave/wave35';


@Injectable()
export class DefenceStageScene extends Phaser.Scene {




    lockQuick: Phaser.GameObjects.Image
    lockLongDistance: Phaser.GameObjects.Image
    lockSlowDebuff: Phaser.GameObjects.Image

    lockState = {
        basic: false,
        quick: true,
        long_distance: true,
        slow_debuff: true
    }


    messageToastTimeout;
    messageToastTextTimeout;
    isLoggedIn: boolean = false;


    messageToast: Phaser.GameObjects.Image;
    messageToastText: Phaser.GameObjects.Text;
    messageToastShowTween: Phaser.Tweens.Tween
    messageToastHideTween: Phaser.Tweens.Tween
    messageToastTextShowTween: Phaser.Tweens.Tween
    messageToastTextHideTween: Phaser.Tweens.Tween

    isGameover: boolean = false;
    isInit: boolean = false;
    fromIndex: boolean = false;

    updatedScrollTop: number = 0;
    displayEnemyInfoPrevBtn: Phaser.GameObjects.Image
    displayEnemyInfoNextBtn: Phaser.GameObjects.Image

    displayEnemyImage: Phaser.GameObjects.Image


    displayEnemyInfoStep: number = 0;

    enemyInfoSlotConfig
    enemyInfoSlotHead
    enemyInfoSlotSub
    enemyInfoSlotRestriction

    btnScale = 0.65
    btnTextFontSize = '18px'


    saveBtnImage;
    saveBtnImageTween;
    saveBtnText;
    saveBtnTextTween;



    defenceGameWolrdSpeed: number = 1;


    isAdmin: boolean = false;

    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;
    @select(['user', 'currentUser']) currentUser$: Observable<UsersAttribute>;

    customAdmin: boolean = false;

    lineGraphics: Phaser.GameObjects.Graphics
    tipBtn: Phaser.GameObjects.Image;

    pointSelection: Phaser.GameObjects.Image;
    turretConfigWindow: Phaser.GameObjects.Image;
    turretConfigWindowText: Phaser.GameObjects.Text
    turretConfigWindowTurretTitleText: Phaser.GameObjects.Text
    turretConfigWindowTurretPriceText: Phaser.GameObjects.Text

    turretUpgradeWindow: Phaser.GameObjects.Image;
    turretUpgradeWindowText: Phaser.GameObjects.Text
    turretUpgradeWindowTurretTitleText: Phaser.GameObjects.Text
    turretUpgradeWindowTurretDescriptionText: Phaser.GameObjects.Text

    turretRestrictionsOfWave = {
        basic: false,
        quick: false,
        long_distance: false,
        slow_debuff: false
    }


    waveDescriptionWindow: DefenceGameWindow;


    selectedTurret$: Subject<Turret> = new Subject();
    isWaving$: Subject<boolean> = new Subject();

    timeText: Phaser.GameObjects.Text;

    nextTimer;
    nextLimitTime: number = 60;;


    health;
    waveText: Phaser.GameObjects.Text;

    deposit: Phaser.GameObjects.Text;


    playerLifeByHeart: number = 10;
    playerLifeByHeartText: Phaser.GameObjects.Text;

    directionGuideLeft: Phaser.GameObjects.Image;
    directionGuideRight: Phaser.GameObjects.Image;
    nextDirectionGuide: number = 0;
    nextDirectionStep: number = 0;

    enterKey: Phaser.Input.Keyboard.Key;
    that: any;

    leftPath: Phaser.Curves.Path
    rightPath: Phaser.Curves.Path

    indexText: Phaser.GameObjects.Text;


    bombEffects: Phaser.GameObjects.Group;
    healthBars: Phaser.GameObjects.Group
    leftType1Enemies: Phaser.Physics.Arcade.Group
    leftType2Enemies: Phaser.Physics.Arcade.Group
    leftType3Enemies: Phaser.Physics.Arcade.Group
    leftType4Enemies: Phaser.Physics.Arcade.Group
    rightType1Enemies: Phaser.Physics.Arcade.Group
    rightType2Enemies: Phaser.Physics.Arcade.Group
    rightType3Enemies: Phaser.Physics.Arcade.Group
    rightType4Enemies: Phaser.Physics.Arcade.Group




    nextLeftType1Enemy;
    nextLeftType2Enemy;
    nextLeftType3Enemy;
    nextLeftType4Enemy;

    nextRightType1Enemy;
    nextRightType2Enemy;
    nextRightType3Enemy;
    nextRightType4Enemy;

    currentTurretWindow;


    bullets: { egg, punch, textbox, dropSpit, stone };
    dropSpitBullets: Phaser.GameObjects.Group;
    punchBullets: Phaser.GameObjects.Group;
    textboxBullets: Phaser.GameObjects.Group;
    stoneBullets: Phaser.GameObjects.Group;
    eggBullets: Phaser.GameObjects.Group;



    basicTurrets: Phaser.GameObjects.Group;
    quickTurrets: Phaser.GameObjects.Group;
    loginDistanceTurrets: Phaser.GameObjects.Group;
    slowDebuffTurrets: Phaser.GameObjects.Group;

    sideLength: number = 50;



    selectWindowClick: boolean = false;
    selectWindow: Phaser.GameObjects.Image;
    selectWindowTween: Phaser.Tweens.Tween

    circleWindowText: Phaser.GameObjects.Text


    confirmWindow: Phaser.GameObjects.Image
    checkBtn: Phaser.GameObjects.Image
    cancelBtn: Phaser.GameObjects.Image


    upgradeWindow: Phaser.GameObjects.Image;
    upgradeWindowTween: Phaser.Tweens.Tween

    upgradeBtn: Phaser.GameObjects.Image;
    distructionBtn: Phaser.GameObjects.Image;

    tower1: Phaser.GameObjects.Image
    tower2: Phaser.GameObjects.Image
    tower3: Phaser.GameObjects.Image
    tower4: Phaser.GameObjects.Image


    startBtn: Phaser.GameObjects.Image
    startGrayBtn: Phaser.GameObjects.Image;

    towersMap = new Map<string, Turret>();




    // 타워 설치 가능한지에 대한 내용의 맵임. 
    map =
        [
            [-2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2,],

            [+0, +0, +0, +0, +0, +0, +0, +0, +0, -1, -1, +0, +0, +0, +0, +0, +0, +0, +0, +0,],
            [+0, +0, +0, -1, -1, -1, -1, +0, +0, -1, -1, +0, +0, -1, -1, -1, -1, +0, +0, +0,],
            [+0, +0, +0, -1, +0, +0, -1, +0, +0, -1, -1, +0, +0, -1, +0, +0, -1, +0, +0, +0,],
            [+0, +0, +0, -1, +0, -1, -1, +0, +0, -1, -1, +0, +0, -1, -1, +0, -1, +0, +0, +0,],
            [+0, +0, +0, -1, +0, -1, +0, +0, +0, -1, -1, +0, +0, +0, -1, +0, -1, +0, +0, +0,],
            [-1, -1, -1, -1, +0, -1, +0, +0, +0, -1, -1, +0, +0, +0, -1, +0, -1, -1, -1, -1,],
            [+0, +0, -1, -1, +0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, +0, -1, -1, +0, +0,],
            [+0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0,],

            [-2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2,],
            [-2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2,],

        ];


    //실제 이미지가 입혀지는 맵으로 이벤트를 걸수잇음. 타워 설치 여부는 위의 맵을 통ㅣ 확인함 
    accessoriesMap =
        [
            [+9, +9, +9, +3, +2, +1, +1, +1, +2, +6, +6, +1, +1, +1, +2, +9, +1, +3, +3, +9,],

            [+3, +3, +1, +1, +2, +1, +1, +1, +1, -7, -7, +1, +1, +1, +1, +1, +1, +1, +2, +3,],
            [+2, +4, +1, -1, -5, -5, -2, +1, +1, -6, -6, +1, +1, -1, -5, -5, -2, +1, +1, +4,],
            [+2, +1, +1, -6, +1, +1, -6, +1, +1, -7, -7, +1, +1, -6, +1, +1, -6, +1, +1, +1,],
            [+1, +1, +1, -6, +1, -1, -3, +1, +1, -6, -6, +1, +1, -4, -2, +1, -6, +1, +1, +1,],
            [+1, +1, +1, -6, +1, -6, +1, +1, +1, -7, -7, +1, +1, +1, -6, +1, -6, +1, +1, +1,],
            [-5, -5, -2, -6, +1, -7, +1, +1, +1, -6, -6, +1, +1, +1, -7, +1, -6, -1, -5, -5,],
            [+9, +1, -4, -3, +1, -4, -5, -5, -5, -3, -4, -5, -5, -5, -3, +1, -4, -3, +1, +9,],
            [+9, +9, +3, +4, +1, +1, +1, +1, +1, +1, +1, +1, +1, +2, +4, +1, +2, +3, +3, +3,],

            [+0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0,],
            [+0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0,],

        ]

    waveStep: number = 0;

    bonusCount: number = 0;
    isWaving: boolean = false;

    playWaveByConfig: any;

    playWaveLeft: {
        type1: number[],
        type2: number[],
        type3: number[],
        type4: number[]
    };
    playWaveRight: {
        type1: number[],
        type2: number[],
        type3: number[],
        type4: number[]
    };

    waveLeft: { type1: number[], type2: number[], type3: number[], type4: number[] }[] = [
        // wave1 시간값 순서대로 해당 타입의 적들이 등장한다.
        {
            type1: [],
            type2: [],
            type3: [],
            type4: [],
        },
    ];

    waveRight: { type1: number[], type2: number[], type3: number[], type4: number[] }[] = [
        // wave1 시간값 순서대로 해당 타입의 적들이 등장한다.
        {
            type1: [],
            type2: [],
            type3: [],
            type4: [],
        },
    ]






    constructor(private http: HttpClient, private timeService: GameTimeService) {
        super({
            key: 'stage'
        });


        this.currentUser$.subscribe((data) => {
            if (data) {
                this.isAdmin = data.isAdmin
            }
        })
    }

    ///////--------------------**------------------------///////////

    resetStage() {
        this.isWaving = false;
        this.isGameover = false;
        this.waveStep = 0;
        this.playerLifeByHeart = 10;
        this.nextLimitTime = 60;
        if (this.enemyInfoSlotHead) {
            this.enemyInfoSlotHead.destroy()
            this.enemyInfoSlotHead = null;
        }
        if (this.enemyInfoSlotSub) {
            this.enemyInfoSlotSub.destroy()
            this.enemyInfoSlotSub = null;
        }
        if (this.enemyInfoSlotConfig) {
            this.enemyInfoSlotConfig.destroy()
            this.enemyInfoSlotConfig = null;
        }
        if (this.enemyInfoSlotRestriction) {
            this.enemyInfoSlotRestriction.destroy()
            this.enemyInfoSlotRestriction = null;
        }

        this.map =
            [
                [-2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2,],

                [+0, +0, +0, +0, +0, +0, +0, +0, +0, -1, -1, +0, +0, +0, +0, +0, +0, +0, +0, +0,],
                [+0, +0, +0, -1, -1, -1, -1, +0, +0, -1, -1, +0, +0, -1, -1, -1, -1, +0, +0, +0,],
                [+0, +0, +0, -1, +0, +0, -1, +0, +0, -1, -1, +0, +0, -1, +0, +0, -1, +0, +0, +0,],
                [+0, +0, +0, -1, +0, -1, -1, +0, +0, -1, -1, +0, +0, -1, -1, +0, -1, +0, +0, +0,],
                [+0, +0, +0, -1, +0, -1, +0, +0, +0, -1, -1, +0, +0, +0, -1, +0, -1, +0, +0, +0,],
                [-1, -1, -1, -1, +0, -1, +0, +0, +0, -1, -1, +0, +0, +0, -1, +0, -1, -1, -1, -1,],
                [+0, +0, -1, -1, +0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, +0, -1, -1, +0, +0,],
                [+0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0, +0,],

                [-2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2,],
                [-2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2, -2,],

            ];


    }



    setWolrdSpeed(amount: number) {
        // this.game.loop.step(100)
        // this.game.loop.actualFps *= amount
        // this.defenceGameWolrdSpeed = amount
        // this.getCurrEnemies().forEach((enemy) => {
        //     enemy.accelerateSpeed(this.defenceGameWolrdSpeed)
        // })
        // this.basicTurrets.getChildren().forEach((turret: Turret) => {
        //     turret.accelerateSpeedOfAttack(this.defenceGameWolrdSpeed)
        // })
        // this.quickTurrets.getChildren().forEach((turret: Turret) => {
        //     turret.accelerateSpeedOfAttack(this.defenceGameWolrdSpeed)
        // })
        // this.loginDistanceTurrets.getChildren().forEach((turret: Turret) => {
        //     turret.accelerateSpeedOfAttack(this.defenceGameWolrdSpeed)
        // })
        // this.slowDebuffTurrets.getChildren().forEach((turret: Turret) => {
        //     turret.accelerateSpeedOfAttack(this.defenceGameWolrdSpeed)
        // })
        // this.bullets.getChildren().forEach((bullet: Bullet) => {
        //     bullet.speed = bullet.originSpeed * this.defenceGameWolrdSpeed
        // })
    }






    drawGrid(graphics: Phaser.GameObjects.Graphics) {
        graphics.lineStyle(1, 0x000000, 0.8);
        for (var i = 0; i <= 400 / this.sideLength; i++) {
            graphics.moveTo(0, (i) * this.sideLength);
            graphics.lineTo(1000, (i) * this.sideLength);
        }
        for (var j = 0; j <= 1000 / this.sideLength; j++) {
            graphics.moveTo((j) * this.sideLength, 0);
            graphics.lineTo((j) * this.sideLength, 400 + this.sideLength);
        }
        graphics.strokePath();


    }




    canPlaceTurret(i, j) {
        switch (this.map[i][j]) {
            case -1:
                return 'path'
            case +0:
                return 'can'
            case +1:
                return 'existing'
            case -2:
                return 'store'
        }
    }

    decoratingAccessories(i, j) {
        let targetValue = this.accessoriesMap[i][j]
        let targetTile: Phaser.GameObjects.Image;
        let tileKey;
        switch (targetValue) {
            case -1:
                // if (this.waveStep + 1 > 31) {
                //     tileKey = 's_curve_road_1'
                // } else {
                // }
                tileKey = 'curve_road_1'
                break
            case -2:
                // if (this.waveStep + 1 > 31) {
                //     tileKey = 's_curve_road_2'
                // } else {
                // }
                tileKey = 'curve_road_2'
                break;
            case -3:
                // if (this.waveStep + 1 > 31) {
                //     tileKey = 's_curve_road_3'
                // } else {
                // }
                tileKey = 'curve_road_3'
                break;
            case -4:
                // if (this.waveStep + 1 > 31) {
                //     tileKey = 's_curve_road_4'
                // } else {
                // }
                tileKey = 'curve_road_4'
                break;
            case -5:
                if (this.waveStep + 1 > 31) {
                    tileKey = 's_h_straight_road'
                } else {
                    tileKey = 'h_straight_road'
                }
                break;
            case -6:
                // if (this.waveStep + 1 > 31) {
                //     tileKey = 's_v_straight_road'
                // } else {
                // }
                tileKey = 'v_straight_road'
                break;
            case -7:
                // if (this.waveStep + 1 > 31) {
                //     tileKey = 's_v_straight_road'
                // } else {
                // }
                tileKey = 'v_straight_road_reverse'
                break;
            case +1:
                // if (this.waveStep + 1 > 31) {
                //     tileKey = 'ground_3'
                // } else {
                // }
                tileKey = 'ground_1'
                break;
            case +2:
                tileKey = 'two_tree'
                break;
            case +3:
                tileKey = 'three_tree'
                break;
            case +4:
                this.add.image(j * this.sideLength + this.sideLength / 2, i * this.sideLength + this.sideLength / 2, 'ground_1')
                tileKey = 'two_stone'
                break;
            case +5:
                this.add.image(j * this.sideLength + this.sideLength / 2, i * this.sideLength + this.sideLength / 2, 'ground_1')
                tileKey = 'one_small_stone'
                break;
            case +6:
                this.add.image(j * this.sideLength + this.sideLength / 2, i * this.sideLength + this.sideLength / 2, 'ground_1')
                tileKey = 'empty_house'
                break;
            case +8:
                tileKey = 'water_1'
                break;
            case +9:
                tileKey = 'many_tree'
                break;
            case +0:
                // tileKey = 'none'
                break;
        }

        if (targetValue == 1) {
            targetTile = this.add.image(j * this.sideLength + this.sideLength / 2, i * this.sideLength + this.sideLength / 2, tileKey);
            targetTile.setInteractive({
                useHandCursor: true,
            }).on('pointerup', pointer => {
                this.openSelectTurretWindow(pointer)
            })
        } else if (targetValue != 1) {
            targetTile = this.add.image(j * this.sideLength + this.sideLength / 2, i * this.sideLength + this.sideLength / 2, tileKey);
            targetTile.setInteractive()
                .on('pointerup', () => {
                    if (this.selectWindow) {
                        this.closeSelectWindow();
                    }
                    if (this.confirmWindow) {
                        this.closeConfirmWindow();
                    }
                    if (this.upgradeWindow) {
                        this.closeUpgradeWindow();
                    }
                })
        }
        targetTile.setZ(-9999);
    }



    showMessageToast(text) {
        clearTimeout(this.messageToastTimeout)
        clearTimeout(this.messageToastTextTimeout)
        this.messageToastText.setText(text);
        this.messageToastShowTween.restart();
        this.messageToastTextShowTween.restart()




    }



    closeConfirmWindow() {
        this.confirmWindow.destroy();
        this.confirmWindow = null;

        this.turretConfigWindow.destroy();
        this.turretConfigWindow = null;


        if (this.cancelBtn) {
            this.cancelBtn.destroy()
            this.cancelBtn = null;
        }
        if (this.checkBtn) {
            this.checkBtn.destroy()
            this.checkBtn = null;
        }

        // this.turretConfigWindowText.destroy()
        // this.turretConfigWindowText = null;
        // this.turretConfigWindowTurretPriceText.destroy()
        // this.turretConfigWindowTurretPriceText = null;
        // this.turretConfigWindowTurretTitleText.destroy()
        // this.turretConfigWindowTurretTitleText = null;
        if (this.pointSelection) {
            this.pointSelection.destroy()
            this.pointSelection = null;
        }


    }
    closeUpgradeWindow() {
        this.upgradeWindow.destroy();
        this.upgradeWindow = null;
        if (this.upgradeBtn) {
            this.upgradeBtn.destroy()
            this.upgradeBtn = null;
        }
        if (this.distructionBtn) {
            this.distructionBtn.destroy()
            this.distructionBtn = null;
        }


        this.turretUpgradeWindow.destroy()
        this.turretUpgradeWindow = null;
        this.turretUpgradeWindowText.destroy()
        this.turretUpgradeWindowText = null;
        // this.turretUpgradeWindowTurretTitleText.destroy()
        // this.turretUpgradeWindowTurretTitleText = null;
        // this.turretUpgradeWindowTurretDescriptionText.destroy()
        // this.turretUpgradeWindowTurretDescriptionText = null;
    }

    closeSelectWindow() {
        this.pointSelection.destroy();
        this.pointSelection = null


        this.tweens.add({
            targets: this.tower1,
            y: `+=${this.sideLength}`,
            duration: 100
        })
        this.tweens.add({
            targets: this.tower2,
            x: `+=${- this.sideLength}`,
            duration: 100
        })
        this.tweens.add({
            targets: this.tower3,
            y: `+=${- this.sideLength}`,
            duration: 100
        })
        this.tweens.add({
            targets: this.tower4,
            x: `+=${this.sideLength}`,
            duration: 100
        })
        this.tweens.add({
            targets: this.selectWindow,
            scaleX: '0',
            scaleY: '0',
            // x: 400,               // '+=100'
            // y: 300,               // '+=100'
            ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 100,
            repeat: 0,            // -1: infinity
            yoyo: false,
            onComplete: () => {
                if (this.selectWindow) {
                    this.selectWindow.destroy();
                    this.selectWindow = null;
                }
                this.tower1.destroy();
                this.tower2.destroy();
                this.tower3.destroy();
                this.tower4.destroy();
                this.tower1 = null;
                this.tower2 = null;
                this.tower3 = null;
                this.tower4 = null;
                if (this.lockQuick) {
                    this.lockQuick.destroy();
                    this.lockQuick = null
                }
                if (this.lockLongDistance) {
                    this.lockLongDistance.destroy();
                    this.lockLongDistance = null
                }
                if (this.lockSlowDebuff) {
                    this.lockSlowDebuff.destroy();
                    this.lockSlowDebuff = null
                }


            },
        })
    }



    openConfirmWindow(i, j, type: string) {





        if (this.confirmWindow) {
            this.confirmWindow.destroy();
            this.checkBtn.destroy()
            this.cancelBtn.destroy()
        }

        this.pointSelection = this.add.image(j * this.sideLength + this.sideLength / 2, i * this.sideLength + this.sideLength / 2, 'slow-effect');


        this.confirmWindow = this.add.image(j * this.sideLength + this.sideLength / 2, i * this.sideLength + this.sideLength / 2, 'hit-range');
        if (this.lockState[type]) {
            this.confirmWindow.setAlpha(0.6);
        }







        let _scale;
        let turretConfig: {
            speedOfAttack,
            price,
            damage,
            name
            windowImageKey,
        };

        switch (type) {
            case 'basic':
                _scale = BasicTurret.hitRange;
                turretConfig = {
                    speedOfAttack: BasicTurret.speedOfAttack,
                    price: BasicTurret.price,
                    damage: BasicTurret.damage,
                    windowImageKey: 'confirm-tower1',
                    name: '은퇴한 원펀맨'
                }
                break;
            case 'quick':
                _scale = QuickTurret.hitRange;
                turretConfig = {
                    speedOfAttack: QuickTurret.speedOfAttack,
                    price: QuickTurret.price,
                    damage: QuickTurret.damage,
                    windowImageKey: 'confirm-tower2',
                    name: '할미넴'
                }
                break;
            case 'long_distance':
                _scale = LongDistanceTurret.hitRange;
                turretConfig = {
                    speedOfAttack: LongDistanceTurret.speedOfAttack,
                    price: LongDistanceTurret.price,
                    damage: LongDistanceTurret.damage,
                    windowImageKey: 'confirm-tower3',
                    name: '양계장 아들'
                }

                break;
            case 'slow_debuff':
                _scale = SlowDebuffTurret.hitRange
                turretConfig = {
                    speedOfAttack: SlowDebuffTurret.speedOfAttack,
                    price: SlowDebuffTurret.price,
                    damage: SlowDebuffTurret.damage,
                    windowImageKey: 'confirm-tower4',
                    name: '침 좀 뱉는 아이'
                }
                break;
            default:
                _scale = 1;
                break;
        }

        this.confirmWindow.setScale(_scale);


        let corPosX = this.sideLength / 2
        let corPosY = this.sideLength / 2;

        if (i <= 4 && j <= 9) {
            corPosX += 72.5;
            corPosY += 72.5
        }
        else if (i <= 4 && j > 9) {
            corPosX += -72.5;
            corPosY += 72.5
        }
        else if (i > 4 && j <= 9) {
            corPosX += 72.5;
            corPosY += -72.5
        }
        else if (i > 4 && j > 9) {
            corPosX += -72.5;
            corPosY += -72.5
        }

        this.turretConfigWindow = this.add.image(j * this.sideLength + corPosX, i * this.sideLength + corPosY, turretConfig.windowImageKey);
        if (this.lockState[type]) {
            this.turretConfigWindow.setAlpha(0.85);
        } else {
            this.checkBtn = this.add.image(this.turretConfigWindow.x - 30, this.turretConfigWindow.y + 52, 'check');
            // this.checkBtn.setZ(9999)
            this.cancelBtn = this.add.image(this.turretConfigWindow.x + 30, this.turretConfigWindow.y + 52, 'cross');
            // this.cancelBtn.setZ(9999)

            // this.checkBtn.
            this.checkBtn.setInteractive({
                hitArea: new Phaser.Geom.Circle(this.checkBtn.x, this.checkBtn.y, 35),
                useHandCursor: true,
                hitAreaCallback: (shape: Phaser.Geom.Circle, x, y, gameObject: Phaser.GameObjects.Image) => {
                    if (shape.contains(gameObject.x + x - 10, gameObject.y + y - 10)) {
                        return true
                    }
                    return false
                }
            })
                .on('pointerup', () => {
                    this.closeConfirmWindow();
                    this.placeTurret(i, j, type);
                })
            this.cancelBtn.setInteractive({
                hitArea: new Phaser.Geom.Circle(this.cancelBtn.x, this.cancelBtn.y, 35),
                useHandCursor: true,
                hitAreaCallback: (shape: Phaser.Geom.Circle, x, y, gameObject: Phaser.GameObjects.Image) => {
                    if (shape.contains(gameObject.x + x - 10, gameObject.y + y - 10)) {
                        return true
                    }
                    return false
                }
            }).on('pointerup', () => {
                this.closeConfirmWindow();
            })
        }










    }

    createUpgradeWindow(i, j, targetTurret: Turret) {
        if (this.selectWindow) {
            this.closeSelectWindow();
        }


        if (this.upgradeWindow) {
            this.upgradeWindow.destroy()
        }


        this.upgradeWindow = this.add.image(j * this.sideLength + this.sideLength / 2, i * this.sideLength + this.sideLength / 2, 'hit-range');
        this.upgradeWindow.setScale(targetTurret.getHitRange());








        let corPosX = this.sideLength / 2
        let corPosY = this.sideLength / 2;

        let deltaCorPos = 85;
        if (i <= 4 && j <= 9) {
            corPosX += deltaCorPos;
            corPosY += deltaCorPos
        }
        else if (i <= 4 && j > 9) {
            corPosX += -deltaCorPos;
            corPosY += deltaCorPos
        }
        else if (i > 4 && j <= 9) {
            corPosX += deltaCorPos;
            corPosY += -deltaCorPos
        }
        else if (i > 4 && j > 9) {
            corPosX += -deltaCorPos;
            corPosY += -deltaCorPos
        }

        this.turretUpgradeWindow = this.add.image(j * this.sideLength + corPosX, i * this.sideLength + corPosY, `interface150`);
        // this.turretUpgradeWindow.setScale(200 / 300, 250 / 110);
        // this.turretUpgradeWindow.setZ(9998)

        // this.turretUpgradeWindowTurretTitleText = this.add.text(this.turretUpgradeWindow.x - 75, this.turretUpgradeWindow.y - 130,
        //     `
        //     ${targetTurret.koName}
        //     `, {
        //         // width: `${this.game.canvas.width - 50}px`,
        //         // height: `${(this.game.canvas.height / 3) - 50}px`,
        //         color: '#fff',
        //         'fontSize': '13px',
        //         textAlign: 'left',
        //         fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
        //         // wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
        //     })

        // this.turretUpgradeWindowTurretDescriptionText = this.add.text(this.turretUpgradeWindow.x - 75, this.turretUpgradeWindow.y - 100,
        //     `${targetTurret.koDescription}
        //     `, {
        //         color: '#fff',
        //         'fontSize': '11px',
        //         textAlign: 'left',
        //         fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
        //         wordWrap: { width: 125, useAdvancedWrap: true }
        //     })

        if (targetTurret.getLevel() == 3) {
            this.turretUpgradeWindowText = this.add.text(this.turretUpgradeWindow.x - 102, this.turretUpgradeWindow.y - 65,
                `
                최고 레벨 입니다.
                레벨 : ${targetTurret.getLevel()} 
                공격력 : ${targetTurret.getDamge()} 
                연사력 : ${targetTurret.getSpeedOfAttack()}${
                targetTurret.getSlowDebuffEfficacy() ?
                    `
                능력 : ${targetTurret.getSlowDebuffEfficacy() * 100}% (slow)` :
                    ``}
                해고 시 반환 가격 : ${targetTurret.getPrice() / 2}
                `, {
                    // width: `${this.game.canvas.width - 50}px`,
                    // height: `${(this.game.canvas.height / 3) - 50}px`,
                    color: '#fff',
                    'fontSize': '11px',
                    textAlign: 'left',
                    fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                    // wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
                })
        } else {

            this.turretUpgradeWindowText = this.add.text(this.turretUpgradeWindow.x - 102, this.turretUpgradeWindow.y - 65,
                `
                레벨 : ${targetTurret.getLevel()} > ${targetTurret.getLevel() + 1}
                공격력 : ${targetTurret.getDamge()} > ${targetTurret.getUpgradeConfig(targetTurret.getLevel() + 1).damage}
                연사력 : ${targetTurret.getSpeedOfAttack()} > ${targetTurret.getUpgradeConfig(targetTurret.getLevel() + 1).speedOfAttack}${
                targetTurret.getSlowDebuffEfficacy() ?
                    `
                능력 : ${targetTurret.getSlowDebuffEfficacy() * 100}% > ${targetTurret.getUpgradeConfig(targetTurret.getLevel() + 1).slowDebuffEfficacy * 100}% (slow) ` :
                    ``}
                업그레이드 가격 : ${targetTurret.getUpgradeConfig(targetTurret.getLevel() + 1).fee}
                해고 시 반환 가격 : ${targetTurret.getPrice() / 2}
                `, {
                    // width: `${this.game.canvas.width - 50}px`,
                    // height: `${(this.game.canvas.height / 3) - 50}px`,
                    color: '#fff',
                    'fontSize': '11px',
                    textAlign: 'left',
                    fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                    // wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
                })



            this.upgradeBtn = this.add.image(this.turretUpgradeWindow.x - 35, this.turretUpgradeWindow.y + 50, 'upgrade');
            this.upgradeBtn.setInteractive({
                hitArea: new Phaser.Geom.Circle(this.upgradeBtn.x, this.upgradeBtn.y, 35),
                useHandCursor: true,
                hitAreaCallback: (shape: Phaser.Geom.Circle, x, y, gameObject: Phaser.GameObjects.Image) => {
                    if (shape.contains(gameObject.x + x - 10, gameObject.y + y - 10)) {
                        return true
                    }
                    return false
                }
            }).on('pointerup', () => {
                targetTurret.upgradeLevel()
                this.closeUpgradeWindow();
            });
            this.upgradeBtn.setScale(0.5)
        }

        this.distructionBtn = this.add.image(this.turretUpgradeWindow.x + 35, this.turretUpgradeWindow.y + 50, 'distruction');
        this.distructionBtn.setInteractive({
            hitArea: new Phaser.Geom.Circle(this.distructionBtn.x, this.distructionBtn.y, 35),
            useHandCursor: true,
            hitAreaCallback: (shape: Phaser.Geom.Circle, x, y, gameObject: Phaser.GameObjects.Image) => {
                if (shape.contains(gameObject.x + x - 10, gameObject.y + y - 10)) {
                    return true
                }
                return false
            }
        }).on('pointerup', () => {
            targetTurret.setActive(false);
            targetTurret.setVisible(false);
            this.closeUpgradeWindow();
            let _pos = targetTurret.id.split('-')
            this.map[_pos[0]][_pos[1]] = +0;
            this.towersMap.delete(targetTurret.id)
            this.deposit.setText((parseInt(this.deposit.text) + targetTurret.getPrice() / 2) + '');
            targetTurret.delLevelImage();
            targetTurret.destroy();
            targetTurret = null
        })
        this.distructionBtn.setScale(20 / 25, 20 / 25)
        // this.circleWindowText = this.add.text(this.upgradeWindow.x, this.upgradeWindow.y - 50, `현재 레벨 ${targetTurret.getLevel()} |  드 허쉴?`);

        this.selectedTurret$.next(targetTurret)

    }

    createSelectWindow(i, j) {
        if (this.selectWindow) {
            this.selectWindow.destroy();
            this.tower1.destroy();
            this.tower2.destroy();
            this.tower3.destroy();
            this.tower4.destroy();
        }

        if (this.upgradeWindow) {
            this.closeUpgradeWindow();
        }

        let corPosX = this.sideLength / 2
        let corPosY = this.sideLength / 2;

        if (i <= 4 && j <= 9) {
            corPosX += 75;
            corPosY += 75
        }
        else if (i <= 4 && j > 9) {
            corPosX += -75;
            corPosY += 75
        }
        else if (i > 4 && j <= 9) {
            corPosX += 75;
            corPosY += -75
        }
        else if (i > 4 && j > 9) {
            corPosX += -75;
            corPosY += -75
        }

        this.selectWindow = this.add.image(j * this.sideLength + corPosX, i * this.sideLength + corPosY, 'tower-select');
        this.selectWindow.setAlpha(0);
        this.pointSelection = this.add.image(j * this.sideLength + this.sideLength / 2, i * this.sideLength + this.sideLength / 2, 'slow-effect');

        this.selectWindow.setAngle(45);

        // this.selectWindow.setAngle(45);
        this.tower1 = this.add.image(this.selectWindow.x, this.selectWindow.y, 'tower1');
        this.tower1.setInteractive({
            useHandCursor: true,
        }).on('pointerup', () => {
            this.closeSelectWindow();
            this.openConfirmWindow(i, j, 'basic')
            // this.placeTurret(_i, _j);
            // this.closeSelectWindow();

        })

        this.tweens.add({
            targets: this.tower1,
            x: `+=${-this.sideLength + 10}`,               // '+=100'
            y: `+=${- this.sideLength + 10}`,               // '+=100'
            // ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 100,
            repeat: 0,            // -1: infinity
            yoyo: false
        })


        this.tower2 = this.add.image(this.selectWindow.x, this.selectWindow.y, 'tower2');
        if (this.lockState.quick) {
            this.tower2.setAlpha(0.6);
            // this.tower2.setInteractive({
            //     useHandCursor: true,
            // }).on('pointerup', () => {
            //     this.showMessageToast('할미넴은 스테이지 5부터 고용 가능 합니다.')
            // })
            // this.tweens.add({
            //     targets: this.tower2,
            //     x: `+=${this.sideLength - 10}`,               // '+=100'
            //     y: `+=${- this.sideLength + 10}`,               // '+=100'
            //     // ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            //     duration: 100,
            //     repeat: 0,            // -1: infinity
            //     yoyo: false,
            //     onComplete: () => {

            //         this.lockQuick = this.add.image(this.selectWindow.x + this.sideLength - 10 - 2.5, this.selectWindow.y - this.sideLength + 10, 'lock_5');
            //     }
            // })
        }
        this.tower2.setInteractive({
            useHandCursor: true,
        }).on('pointerup', () => {
            if (this.lockState.quick) {
                this.showMessageToast('할미넴은 스테이지 5부터 가능합니다.')
            } else {
            }
            this.closeSelectWindow();
            this.openConfirmWindow(i, j, 'quick')
        })
        this.tweens.add({
            targets: this.tower2,
            x: `+=${this.sideLength - 10}`,               // '+=100'
            y: `+=${- this.sideLength + 10}`,               // '+=100'
            // ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 100,
            repeat: 0,            // -1: infinity
            yoyo: false
        })

        this.tower3 = this.add.image(this.selectWindow.x, this.selectWindow.y, 'tower3');
        if (this.lockState.slow_debuff) {
            this.tower3.setAlpha(0.6);

        }

        this.tower3.setInteractive({
            useHandCursor: true,
        }).on('pointerup', () => {
            if (this.lockState.slow_debuff) {
                this.showMessageToast('침뱉는 아이는 스테이지 15부터 가능합니다.')
            } else {
            }
            this.closeSelectWindow();
            this.openConfirmWindow(i, j, 'slow_debuff')
        })
        this.tweens.add({
            targets: this.tower3,
            x: `+=${this.sideLength - 10}`,               // '+=100'
            y: `+=${this.sideLength - 10}`,               // '+=100'
            // ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 100,
            repeat: 0,            // -1: infinity
            yoyo: false
        })


        this.tower4 = this.add.image(this.selectWindow.x, this.selectWindow.y, 'tower4');
        if (this.lockState.long_distance) {
            this.tower4.setAlpha(0.6);

        }
        this.tower4.setInteractive({
            useHandCursor: true,
        }).on('pointerup', () => {
            if (this.lockState.long_distance) {
                this.showMessageToast('양계장 아들은 스테이지 10부터 가능합니다.')
            } else {
            }
            this.closeSelectWindow();
            this.openConfirmWindow(i, j, 'long_distance')
        })
        this.tweens.add({
            targets: this.tower4,
            x: `+=${- this.sideLength + 10}`,               // '+=100'
            y: `+=${this.sideLength - 10}`,               // '+=100'
            // ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 100,
            repeat: 0,            // -1: infinity
            yoyo: false
        })



        this.selectWindow.setVisible(true);
        this.selectWindow.setActive(true)
        this.selectWindowTween = this.tweens.add({
            targets: this.selectWindow,
            scaleX: '1.25',
            scaleY: '1.25',
            // x: 400,               // '+=100'
            // y: 300,               // '+=100'
            ease: 'Elastic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,            // -1: infinity
            yoyo: false
        })
        // this.selectWindow.setInteractive().on('pointerup', (pointer) => {
        //     this.openSelectTurretWindow(pointer)
        // })
        this.selectWindow.setZ(10);


    }

    openSelectTurretWindow(pointer) {



        if (this.confirmWindow) {
            this.closeConfirmWindow();
            return
        }
        if (this.upgradeWindow) {
            this.closeUpgradeWindow();
            return
        }

        var i = Math.floor(pointer.y / this.sideLength);
        var j = Math.floor(pointer.x / this.sideLength);


        let isAble = this.canPlaceTurret(i, j);
        if (isAble == 'path') {
            if (this.selectWindow) {
                this.closeSelectWindow();
            }
            if (this.confirmWindow) {
                this.closeConfirmWindow();
            }
            if (this.upgradeWindow) {
                this.closeUpgradeWindow();
            }
            return
        }
        if (isAble != 'store') {
            // this.basicTurrets.getChildren().find((turret: BasicTurret) => turret.id == `${i}-${j}`)
            if (isAble == 'can') {


                if (!this.selectWindow) {
                    // 선택 가능한 곳을 눌럿고 아무런 선택창도 없다면 ? 윈도우를 열어라.
                    this.createSelectWindow(i, j)
                    return
                }
                // 설치 가능한 곳을 클릭했는데 만약 이미 선택창이 열려있다. 
                if (this.selectWindow.x == j * this.sideLength + this.sideLength / 2 && this.selectWindow.y == i * this.sideLength + this.sideLength / 2) {
                    // 이미 같은 곳을 눌렀다면 아무일도 일어나지 않는다.
                } else {
                    // 다른 곳을 눌렀다면 이미 켜져잇는 선택창을 종료한다.
                    this.closeSelectWindow();

                    return
                }

            }
            if (isAble == 'existing') {
                // 이미 타워가 존재하는 곳이라면 업그레이드 창일 띄우자

                this.createUpgradeWindow(i, j, this.towersMap.get(`${i}-${j}`));

                // var tween = this.tweens.add({
                //     targets: this.add.image(j * this.sideLength + this.sideLength / 2, i * this.sideLength + this.sideLength / 2, 'type1-upgrade'),
                //     scaleX: '1',
                //     scaleY: '1',
                //     // x: 400,               // '+=100'
                //     // y: 300,               // '+=100'
                //     ease: 'Elastic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                //     duration: 1000,
                //     repeat: 0,            // -1: infinity
                //     yoyo: false
                // });
            }
        }
    }

    startWave() {
        if (!this.isWaving) {
            this.startBtn.setVisible(false)
            this.startGrayBtn.setVisible(true);
            this.waveText.setText('진행 중 ...');
            //
            this.nextLimitTime = 0;
            this.timeText.setText('다음 스테이지 : ' + this.nextLimitTime + 's')
            //


            this.playWaveByConfig = {};
            let playWaveKeys = Object.keys(waveTotal[this.waveStep].enemies);

            if (waveTotal[this.waveStep].restrictions) {
                this.turretRestrictionsOfWave.basic = ((waveTotal[this.waveStep].restrictions) as Array<string>).includes('basic')
                this.turretRestrictionsOfWave.quick = ((waveTotal[this.waveStep].restrictions) as Array<string>).includes('quick')
                this.turretRestrictionsOfWave.long_distance = ((waveTotal[this.waveStep].restrictions) as Array<string>).includes('long_distance')
                this.turretRestrictionsOfWave.slow_debuff = ((waveTotal[this.waveStep].restrictions) as Array<string>).includes('slow_debuff')
            } else {
                this.turretRestrictionsOfWave.basic = false
                this.turretRestrictionsOfWave.quick = false
                this.turretRestrictionsOfWave.long_distance = false
                this.turretRestrictionsOfWave.slow_debuff = false
            }
            for (let j = 0; j < playWaveKeys.length; j++) {
                this.playWaveByConfig[playWaveKeys[j]] = waveTotal[this.waveStep].enemies[playWaveKeys[j]].appearInterval.slice(0);
            }
            this.playWaveLeft = this.waveLeft[0];
            this.playWaveRight = this.waveRight[0];
            // this.displayEnemyConfig();



            this.isWaving = true;

            this.isWaving$.next(this.isWaving);

            if (!this.isAdmin) {
                this.sendingSlack();
            }
        }
        // this.waveText.setText(`Wave - ${this.waveStep + 1} / 30`);
        // window.scrollTo(0, 1);
    }




    placeTurret(i, j, type: string) {
        if (this.canPlaceTurret(i, j) != 'store') {
            if (this.canPlaceTurret(i, j) == 'can') {

                var turret: Turret

                switch (type) {
                    case 'basic':
                        turret = this.basicTurrets.get();
                        break;
                    case 'quick':
                        turret = this.quickTurrets.get();
                        break;
                    case 'long_distance':
                        turret = this.loginDistanceTurrets.get();
                        break;
                    case 'slow_debuff':
                        turret = this.slowDebuffTurrets.get();
                        break;
                    default:
                        turret = this.basicTurrets.get();
                        break;
                }
                if (turret) {
                    if (parseInt(this.deposit.text) < turret.getPrice()) {
                        this.showMessageToast(`금액이 부족합니다. ${turret.getPrice()}골드가 필요합니다.`);

                        return
                    }

                    this.deposit.setText(parseInt(this.deposit.text) - turret.getPrice() + '');


                    this.map[i][j] = 1;
                    turret.setActive(true);
                    turret.setVisible(true);
                    turret.place(i, j);
                    turret.setLevelImage();
                    turret.id = i + '-' + j
                    turret.type = type;
                    this.towersMap.set(turret.id, turret);
                }
            }
        } else {
            window.scrollTo(0, 1);
        }
    }


    displayEnemyConfig() {

        try {
            this.displayEnemyInfoStep = 0;
            let playWaveEnemies: any[] = Object.values(waveTotal[this.waveStep].enemies);
            if (waveTotal[this.waveStep].isBonus) {
                this.bonusCount++;
            }

            if (playWaveEnemies.length > 1) {
                if (this.displayEnemyInfoPrevBtn) {
                    this.displayEnemyInfoPrevBtn.destroy();
                }
                this.displayEnemyInfoPrevBtn = this.add.image(8 * this.sideLength + this.sideLength / 2, 8 * this.sideLength + this.sideLength / 2 + 32, 'arrow_btn')
                this.displayEnemyInfoPrevBtn.setScale(0.5)
                this.displayEnemyInfoPrevBtn.setAngle(-90)
                this.displayEnemyInfoPrevBtn.setVisible(false)
                this.displayEnemyInfoPrevBtn.setInteractive({
                    useHandCursor: true,
                }).on('pointerup', () => {
                    let _playWaveEnemies: any = Object.values(waveTotal[this.waveStep].enemies);
                    if (this.displayEnemyInfoStep > 0) {
                        this.displayEnemyInfoStep--
                        if (this.displayEnemyInfoStep > 0) {
                            this.displayEnemyInfoPrevBtn.setVisible(true)
                            this.displayEnemyInfoNextBtn.setVisible(true)
                        } else {
                            this.displayEnemyInfoPrevBtn.setVisible(false)
                            this.displayEnemyInfoNextBtn.setVisible(true)
                        }
                        if (waveTotal[this.waveStep].isBonus) {
                            this.enemyInfoSlotHead.setText(`Bonus Stage ${this.bonusCount} - ${_playWaveEnemies[this.displayEnemyInfoStep].name} ( x${_playWaveEnemies[this.displayEnemyInfoStep].appearInterval.length} ) `)
                        } else {
                            this.enemyInfoSlotHead.setText(`Stage ${this.waveStep + 1 - this.bonusCount} - ${_playWaveEnemies[this.displayEnemyInfoStep].name} ( x${_playWaveEnemies[this.displayEnemyInfoStep].appearInterval.length} )`)
                        }


                        this['enemyInfoSlotSub'].setText(_playWaveEnemies[this.displayEnemyInfoStep].sub)
                        this.displayEnemyImage.destroy();
                        this.displayEnemyImage = this.add.image(
                            5 * this.sideLength + this.sideLength / 2 + 25,
                            9 * this.sideLength + this.sideLength / 2 + 25,
                            _playWaveEnemies[this.displayEnemyInfoStep].imageKey
                        )
                        this.displayEnemyImage.setScale(1.25)
                        this.enemyInfoSlotConfig.setText(`
                            속도 : ${_playWaveEnemies[this.displayEnemyInfoStep].speed}
                            체력 : ${_playWaveEnemies[this.displayEnemyInfoStep].hp}
                            `)
                    }
                })
                if (this.displayEnemyInfoNextBtn) {
                    this.displayEnemyInfoNextBtn.destroy();
                }
                this.displayEnemyInfoNextBtn = this.add.image(8 * this.sideLength + this.sideLength / 2, 10 * this.sideLength + this.sideLength / 2 + 18, 'arrow_btn')
                this.displayEnemyInfoNextBtn.setScale(0.5)
                this.displayEnemyInfoNextBtn.setAngle(90)
                this.displayEnemyInfoNextBtn.setInteractive({
                    useHandCursor: true,
                }).on('pointerup', () => {
                    // 이벤트 등록으로 되서 그런지 참조값이 아닌 객체 복사를 해서주기에 다시 가져오게했음
                    let _playWaveEnemies: any = Object.values(waveTotal[this.waveStep].enemies);
                    if (this.displayEnemyInfoStep < playWaveEnemies.length) {
                        this.displayEnemyInfoStep++
                        if (this.displayEnemyInfoStep == playWaveEnemies.length - 1) {
                            this.displayEnemyInfoPrevBtn.setVisible(true)
                            this.displayEnemyInfoNextBtn.setVisible(false)
                        } else {
                            this.displayEnemyInfoPrevBtn.setVisible(true)
                            this.displayEnemyInfoNextBtn.setVisible(true)
                        }

                        if (waveTotal[this.waveStep].isBonus) {
                            this.enemyInfoSlotHead.setText(`Bonus Stage ${this.bonusCount} - ${_playWaveEnemies[this.displayEnemyInfoStep].name} ( x${_playWaveEnemies[this.displayEnemyInfoStep].appearInterval.length} ) `)
                        } else {
                            this.enemyInfoSlotHead.setText(`Stage ${this.waveStep + 1 - this.bonusCount} - ${_playWaveEnemies[this.displayEnemyInfoStep].name} ( x${_playWaveEnemies[this.displayEnemyInfoStep].appearInterval.length} )`)
                        }


                        this['enemyInfoSlotSub'].setText(_playWaveEnemies[this.displayEnemyInfoStep].sub)
                        this.displayEnemyImage.destroy();
                        this.displayEnemyImage = this.add.image(
                            5 * this.sideLength + this.sideLength / 2 + 25,
                            9 * this.sideLength + this.sideLength / 2 + 25,
                            _playWaveEnemies[this.displayEnemyInfoStep].imageKey
                        )
                        this.displayEnemyImage.setScale(1.25);
                        this.enemyInfoSlotConfig.setText(`
                            속도 : ${_playWaveEnemies[this.displayEnemyInfoStep].speed}
                            체력 : ${_playWaveEnemies[this.displayEnemyInfoStep].hp}
                            `)

                    }
                })
            } else {
                if (this.displayEnemyInfoPrevBtn) {
                    this.displayEnemyInfoPrevBtn.setVisible(false)
                }
                if (this.displayEnemyInfoNextBtn) {
                    this.displayEnemyInfoNextBtn.setVisible(false)
                }
            }

            for (let i = 0; i < playWaveEnemies.length; i++) {
                if (this.displayEnemyInfoStep == i) {
                    if (this.displayEnemyImage) {
                        this.displayEnemyImage.destroy();
                    }
                    this.displayEnemyImage = this.add.image(
                        5 * this.sideLength + this.sideLength / 2 + 25,
                        9 * this.sideLength + this.sideLength / 2 + 25,
                        playWaveEnemies[i].imageKey
                    )
                    this.displayEnemyImage.setScale(1.25)

                    if (!this.enemyInfoSlotHead) {
                        this.enemyInfoSlotHead =
                            this.add.text(
                                7 * this.sideLength + this.sideLength / 2 - 25,
                                9 * this.sideLength + this.sideLength / 2 - 11,
                                `Wave ${this.waveStep + 1} - ${playWaveEnemies[i].name} ( x${playWaveEnemies[i].appearInterval.length} )`,
                                {
                                    color: '#fff',
                                    'fontSize': '12px',
                                    textAlign: 'center',
                                    fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                                })
                    } else {
                        if (waveTotal[this.waveStep].isBonus) {
                            this.enemyInfoSlotHead.setText(`Bonus Stage ${this.bonusCount} ( x${playWaveEnemies[i].appearInterval.length} ) `)
                        } else {
                            this.enemyInfoSlotHead.setText(`Stage ${this.waveStep + 1 - this.bonusCount} - ${playWaveEnemies[i].name} ( x${playWaveEnemies[i].appearInterval.length} )`)
                        }
                    }
                    if (!this.enemyInfoSlotSub) {
                        this.enemyInfoSlotSub =
                            this.add.text(
                                7 * this.sideLength + this.sideLength / 2 - 25,
                                9 * this.sideLength + this.sideLength / 2 + 6,
                                playWaveEnemies[i].sub,
                                {
                                    color: '#fff',
                                    'fontSize': '11px',
                                    textAlign: 'center',
                                    fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                                    wordWrap: { width: 225, useAdvancedWrap: true }
                                })
                    } else {
                        this.enemyInfoSlotSub.setText(playWaveEnemies[i].sub)
                    }
                    if (!this.enemyInfoSlotConfig) {
                        this.enemyInfoSlotConfig =
                            this.add.text(
                                7 * this.sideLength + this.sideLength / 2 - 25,
                                9 * this.sideLength + this.sideLength / 2 + 20,
                                `
                            속도 : ${playWaveEnemies[i].speed}
                            체력 : ${playWaveEnemies[i].hp}
                            `,
                                {
                                    color: '#fff',
                                    'fontSize': '10px',
                                    textAlign: 'center',
                                    fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                                    wordWrap: { width: 225, useAdvancedWrap: true }
                                })
                    } else {
                        this.enemyInfoSlotConfig.setText(`
                    속도 : ${playWaveEnemies[i].speed}
                    체력 : ${playWaveEnemies[i].hp}
                    `)
                    }
                    if (!this.enemyInfoSlotRestriction) {

                        let _restrictionText = ''
                        if (waveTotal[this.waveStep].restrictions) {
                            _restrictionText += waveTotal[this.waveStep].restrictions.includes('basic') ? '원펀맨 x \n' : ''
                            _restrictionText += waveTotal[this.waveStep].restrictions.includes('quick') ? '할미넴 x \n' : ''
                            _restrictionText += waveTotal[this.waveStep].restrictions.includes('long_distance') ? '양계장 아들 x \n' : ''
                            _restrictionText += waveTotal[this.waveStep].restrictions.includes('slow_debuff') ? '침뱉기 x \n' : ''
                        }
                        this.enemyInfoSlotRestriction =
                            this.add.text(
                                9 * this.sideLength + this.sideLength / 2 - 25,
                                9 * this.sideLength + this.sideLength / 2 + 20,
                                `
                            ${_restrictionText}
                            `,
                                {
                                    color: '#FA5858',
                                    'fontSize': '10px',
                                    textAlign: 'center',
                                    fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                                    wordWrap: { width: 225, useAdvancedWrap: true }
                                })
                    } else {
                        let _restrictionText = ''
                        if (waveTotal[this.waveStep].restrictions) {
                            _restrictionText += waveTotal[this.waveStep].restrictions.includes('basic') ? '원펀맨 x \n' : ''
                            _restrictionText += waveTotal[this.waveStep].restrictions.includes('quick') ? '할미넴 x \n' : ''
                            _restrictionText += waveTotal[this.waveStep].restrictions.includes('long_distance') ? '양계장 아들 x \n' : ''
                            _restrictionText += waveTotal[this.waveStep].restrictions.includes('slow_debuff') ? '침뱉기 x \n' : ''
                        }

                        this.enemyInfoSlotRestriction.setText(`
                    ${_restrictionText}
                    `)
                    }

                }
            }

        } catch (e) {
            console.error(e)
        }


    }


    settingWave() {
        let _bullets = Object.values(this.bullets);
        for (let i = 0; i < waveTotal.length; i++) {
            let targetWaveConfig = waveTotal[i].enemies;
            let targetWaveConfigKeys = Object.keys(targetWaveConfig);
            for (let j = 0; j < targetWaveConfigKeys.length; j++) {
                let key = targetWaveConfigKeys[j];
                this[`${key}Enemies`] = this.physics.add.group({ classType: targetWaveConfig[key].classType, runChildUpdate: true, });
                this[`nextWave${key}Enemies`] = 0;
                this.physics.add.overlap(this[`${key}Enemies`], _bullets, this.damageEnemy);
            }
        }
    }
    getCurrEnemies() {
        let result: Enemy[] = [];
        if (this.customAdmin) {
            result = this.leftType1Enemies.getChildren()
                .concat(this.leftType2Enemies.getChildren())
                .concat(this.leftType3Enemies.getChildren())
                .concat(this.leftType4Enemies.getChildren())
                .concat(this.rightType1Enemies.getChildren())
                .concat(this.rightType2Enemies.getChildren())
                .concat(this.rightType3Enemies.getChildren())
                .concat(this.rightType4Enemies.getChildren()) as any;
            return result;
        } else {
            for (let target of waveTotal) {
                for (let key of Object.keys(target.enemies)) {
                    result = result.concat(this[`${key}Enemies`].getChildren())
                }
            }
            return result;
        }
    }





    damageEnemy = (enemy: Enemy, bullet: Bullet) => {
        // only if both enemy and bullet are alive

        let _body1: Phaser.Physics.Arcade.Body = enemy.body;
        let _body2: Phaser.Physics.Arcade.Body = bullet.body;
        if (
            (
                (
                    (_body1.center.x + _body1.width / 3) >= (_body2.center.x - _body2.width / 3)
                    ||
                    (_body1.center.x - _body1.width / 3) >= (_body2.center.x - _body2.width / 3)
                )
                &&
                (
                    (_body1.center.y + _body1.height / 3) <= (_body2.center.y + _body2.height / 3)
                    ||
                    (_body1.center.y - _body1.height / 3) <= (_body2.center.y + _body2.height / 3)
                )
            )
            &&
            (
                (
                    (_body1.center.x + _body2.width / 3) <= (_body2.center.x + _body2.width / 3)
                    ||
                    (_body1.center.x - _body2.width / 3) <= (_body2.center.x + _body2.width / 3)
                )
                &&
                (
                    (_body1.center.y - _body2.height / 3) >= (_body2.center.y - _body2.height / 3)
                    ||
                    (_body1.center.y + _body2.height / 3) >= (_body2.center.y - _body2.height / 3)
                )
            )
        ) {
            //
            if (enemy.active === true && bullet.active === true) {
                // we remove the bullet right away
                bullet.setActive(false);
                bullet.setVisible(false);
                bullet.speed = Phaser.Math.GetSpeed(800, 1);
                // decrease the enemy hp with BULLET_DAMAGE
                enemy.receiveDamage(bullet.getDamage());
                if (bullet.debuff) {
                    enemy.applyDebuff(bullet.debuff)
                }
            }
            //
        }


    }


    getPathCoordination(i: number, j: number): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(this.sideLength * i + (this.sideLength / 2), this.sideLength * j + (this.sideLength / 2))
    }

    ///////--------------------**------------------------///////////
    preload() {

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(500 - 160, 275 - 25 - 5, 320, 50);
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: '로딩 중 ... ',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(510 - 150 - 10, 285 - 15 - 10 - 5, 300 * value, 30);
            percentText.setText(Math.floor(value * 100) + '%');
        });

        // this.load.on('fileprogress', (file) => {
        //     console.log(file.src);
        // });
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();




            //  한번도 실행된적이 없다면 


            // if(!this.isInit){
            //     this.create();
            // }
        });


        // this.load.atlas('sprites', 'assets/game/defence/spritesheet.png', 'assets/game/defence/spritesheet.json');

        this.load.image('dog1', 'assets/game/defence/dog1.png');
        this.load.image('type1man', 'assets/game/defence/type1man.png');
        this.load.image('type2man', 'assets/game/defence/type2man.png');
        this.load.image('type3man', 'assets/game/defence/type3man.png');
        this.load.image('type4man', 'assets/game/defence/type4man.png');
        this.load.image('type1woman', 'assets/game/defence/type1woman.png');
        this.load.image('type2woman', 'assets/game/defence/type2woman.png');
        this.load.image('type3woman', 'assets/game/defence/type4woman.png');
        this.load.image('type4woman', 'assets/game/defence/type3woman.png');

        this.load.image('turret-config-window', 'assets/game/defence/test-window.png');
        this.load.image('game_description', 'assets/game/defence/game_description.png');




        this.load.image('lv1', 'assets/game/defence/lv1_5050.png')
        this.load.image('lv2', 'assets/game/defence/lv2_5050.png')
        this.load.image('lv3', 'assets/game/defence/lv3_5050.png')


        this.load.image('interface', 'assets/game/defence/game-interface.png')
        this.load.image('interface150', 'assets/game/defence/interface150.png')
        this.load.image('interface200100', 'assets/game/defence/interface200100.png')
        this.load.image('interface250100', 'assets/game/defence/interface250100.png')
        this.load.image('interface350100', 'assets/game/defence/interface350100.png')
        this.load.image('interface200100red', 'assets/game/defence/interface200100_red.png')
        // this.load.image('interface200100red', 'assets/game/defence/interface200100_red2.png')
        this.load.image('interface200100red3', 'assets/game/defence/interface200100_red2.png')


        this.load.image('lock_5', 'assets/game/defence/lock_5.png')
        this.load.image('lock_10', 'assets/game/defence/lock_10.png')
        this.load.image('lock_15', 'assets/game/defence/lock_15.png')




        this.load.image('description-window', 'assets/game/defence/setting_interface.png')

        this.load.image('empty_house', 'assets/game/defence/texture/empty_house.png')



        this.load.image('dropSpit-bullet', 'assets/game/defence/texture/drop1.png')
        this.load.image('punch-bullet', 'assets/game/defence/texture/punch.png')
        this.load.image('egg-bullet', 'assets/game/defence/texture/egg1.png')
        this.load.image('stone-bullet', 'assets/game/defence/texture/stone1.png')
        this.load.image('textbox-bullet', 'assets/game/defence/texture/textbox.png')

        // this.load.image('bomb-effect', 'assets/game/defence/bomb-effect25.png');
        this.load.image('slow-effect', 'assets/game/defence/slow-effect.png');
        this.load.image('check', 'assets/game/defence/check25.png');
        this.load.image('cross', 'assets/game/defence/cross25.png');
        this.load.image('upgrade', 'assets/game/defence/upgrade40.png');
        this.load.image('distruction', 'assets/game/defence/distruction25.png');

        this.load.image('gold', 'assets/game/defence/gold50.png');
        this.load.image('timer', 'assets/game/defence/timer50.png');
        this.load.image('heart', 'assets/game/defence/heart50.png');
        this.load.image('play', 'assets/game/defence/play50.png');
        this.load.image('play_gray', 'assets/game/defence/play_gray50.png');
        this.load.image('direction-guide', 'assets/game/defence/direction_guide.png');
        this.load.image('arrow_btn', 'assets/game/defence/arrow_btn.png');


        this.load.image('tip-btn', 'assets/game/defence/gold50.png');






        this.load.image('basic-turret', 'assets/game/defence/turret/basic50.png')
        this.load.image('quick-turret', 'assets/game/defence/turret/quick50.png')
        this.load.image('long-distance-turret', 'assets/game/defence/turret/long-distance50.png')
        this.load.image('slow-debuff-turret', 'assets/game/defence/turret/slow-debuff50.png')

        this.load.image('bullet', 'assets/game/defence/bullet.png');
        this.load.image('hp', 'assets/game/defence/full-hp-bar.png');
        this.load.image('tower-select', 'assets/game/defence/select-window.png');
        this.load.image('hit-range', 'assets/game/defence/hit-range.png');
        this.load.image('tower1', 'assets/game/defence/turret/tower1.png');
        this.load.image('tower2', 'assets/game/defence/turret/tower2.png');
        this.load.image('tower4', 'assets/game/defence/turret/tower4.png');
        this.load.image('tower3', 'assets/game/defence/turret/tower3.png');
        this.load.image('confirm-tower1', 'assets/game/defence/turret/confirm-tower1.png');
        this.load.image('confirm-tower2', 'assets/game/defence/turret/confirm-tower2.png');
        this.load.image('confirm-tower4', 'assets/game/defence/turret/confirm-tower4.png');
        this.load.image('confirm-tower3', 'assets/game/defence/turret/confirm-tower3.png');



        this.load.image('curve_road_1', 'assets/game/defence/texture/curve_road_1.png');
        this.load.image('curve_road_2', 'assets/game/defence/texture/curve_road_2.png');
        this.load.image('curve_road_3', 'assets/game/defence/texture/curve_road_3.png');
        this.load.image('curve_road_4', 'assets/game/defence/texture/curve_road_4.png');
        this.load.image('h_straight_road', 'assets/game/defence/texture/h_straight_road.png');
        this.load.image('v_straight_road', 'assets/game/defence/texture/v_straight_road.png');
        this.load.image('v_straight_road_reverse', 'assets/game/defence/texture/v_straight_road_reverse.png');


        // this.load.image('s_curve_road_1', 'assets/game/defence/texture/s_curve_road_1.png');
        // this.load.image('s_curve_road_2', 'assets/game/defence/texture/s_curve_road_2.png');
        // this.load.image('s_curve_road_3', 'assets/game/defence/texture/s_curve_road_3.png');
        // this.load.image('s_curve_road_4', 'assets/game/defence/texture/s_curve_road_4.png');
        // this.load.image('s_h_straight_road', 'assets/game/defence/texture/s_h_straight_road.png');
        // this.load.image('s_v_straight_road', 'assets/game/defence/texture/s_v_straight_road.png');
        // this.load.image('s_v_straight_road_reverse', 'assets/game/defence/texture/s_v_straight_road_reverse.png');

        this.load.image('many_tree', 'assets/game/defence/texture/many_tree.png');

        this.load.image('water_1', 'assets/game/defence/texture/water_1.png');
        this.load.image('water_2', 'assets/game/defence/texture/water_2.png');
        this.load.image('two_tree', 'assets/game/defence/texture/two_tree.png');
        this.load.image('three_tree', 'assets/game/defence/texture/three_tree.png');
        this.load.image('one_small_stone', 'assets/game/defence/texture/one_small_stone.png');
        this.load.image('one_big_stone', 'assets/game/defence/texture/one_big_stone.png');
        this.load.image('two_stone', 'assets/game/defence/texture/two_stone.png');

        this.load.image('ground_1', 'assets/game/defence/texture/ground_1.png');
        this.load.image('ground_2', 'assets/game/defence/texture/ground_2.png');
        this.load.image('ground_3', 'assets/game/defence/texture/ground_3.png');

        this.load.image('startBtn', 'assets/game/imgs/start-btn.png');

    }


    drawPath() {
        this.leftPath = this.add.path(-this.sideLength / 2, this.sideLength * 6 + (this.sideLength / 2));
        this.leftPath.lineTo(this.getPathCoordination(2, 6));
        this.leftPath.lineTo(this.getPathCoordination(2, 7));
        this.leftPath.lineTo(this.getPathCoordination(3, 7));
        this.leftPath.lineTo(this.getPathCoordination(3, 2));
        this.leftPath.lineTo(this.getPathCoordination(6, 2));
        this.leftPath.lineTo(this.getPathCoordination(6, 4));
        this.leftPath.lineTo(this.getPathCoordination(5, 4));
        this.leftPath.lineTo(this.getPathCoordination(5, 7));
        this.leftPath.lineTo(this.getPathCoordination(9, 7));
        this.leftPath.lineTo(this.getPathCoordination(9, 0));

        this.lineGraphics.lineStyle(1, 0xffffff, 0);
        // visualize the path
        this.leftPath.draw(this.lineGraphics)

        this.rightPath = this.add.path(1000 + this.sideLength / 2, this.sideLength * 6 + (this.sideLength / 2));
        this.rightPath.lineTo(this.getPathCoordination(19 - 2, 6));
        this.rightPath.lineTo(this.getPathCoordination(19 - 2, 7));
        this.rightPath.lineTo(this.getPathCoordination(19 - 3, 7));
        this.rightPath.lineTo(this.getPathCoordination(19 - 3, 2));
        this.rightPath.lineTo(this.getPathCoordination(19 - 6, 2));
        this.rightPath.lineTo(this.getPathCoordination(19 - 6, 4));
        this.rightPath.lineTo(this.getPathCoordination(19 - 5, 4));
        this.rightPath.lineTo(this.getPathCoordination(19 - 5, 7));
        this.rightPath.lineTo(this.getPathCoordination(19 - 9, 7));
        this.rightPath.lineTo(this.getPathCoordination(19 - 9, -0));

        this.lineGraphics.lineStyle(1, 0xffffff, 0);
        // visualize the path
        this.rightPath.draw(this.lineGraphics);
    }
    create() {
        // this graphics element is only for visualization, 
        // its not related to our path



        // 좌하단 시작및 시간 영역
        this.add.image(
            (0 * this.sideLength) + 125,
            (9 * this.sideLength) + 50,
            'interface250100'
        )
        // .setScale(5 / 6, 1)

        this.add.image(
            (5 * this.sideLength) + 350 / 2,
            (9 * this.sideLength) + 50,
            'interface350100'
        )
        this.add.image(
            (12 * this.sideLength) + 200 / 2,
            (9 * this.sideLength) + 50,
            'interface200100red'
        )

        this.add.image(
            (16 * this.sideLength) + 200 / 2,
            (9 * this.sideLength) + 50,
            'interface200100'
        )

        // this.tipBtn = this.add.image(
        //     11 * this.sideLength + this.sideLength / 2,
        //     9 * this.sideLength + this.sideLength / 2 - 12.5,
        //     'tip-btn')
        // this.tipBtn.setInteractive().on('pointerup', () => {
        //     this.waveDescriptionWindow.show();
        // })


        this.waveText = this.add.text(
            1 * this.sideLength + this.sideLength / 2 - 5,
            9 * this.sideLength + this.sideLength / 2 - 7,
            `시작`,
            {
                // width: `${this.game.canvas.width - 50}px`,
                // height: `${(this.game.canvas.height / 3) - 50}px`,
                color: '#fff',
                'fontSize': this.btnTextFontSize,
                textAlign: 'center',
                fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                // wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
            })

        this.deposit = this.add.text(
            17 * this.sideLength + this.sideLength / 2 + 15,
            9 * this.sideLength + this.sideLength / 2 - 5,
            '20',
            {
                // width: `${this.game.canvas.width - 50}px`,
                // height: `${(this.game.canvas.height / 3) - 50}px`,
                color: '#fff',
                'fontSize': this.btnTextFontSize,
                textAlign: 'center',
                fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                // wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
            })
        this.timeText = this.add.text(
            1 * this.sideLength + this.sideLength / 2 - 5,
            10 * this.sideLength + this.sideLength / 2 - 17,
            '다음 스테이지 : ' + '00s',
            {
                // width: `${this.game.canvas.width - 50}px`,
                // height: `${(this.game.canvas.height / 3) - 50}px`,
                color: '#fff',
                'fontSize': this.btnTextFontSize,
                textAlign: 'center',
                fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                // wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
            })
        this.nextTimer = setInterval(() => {

            if (this.nextLimitTime > 0) {
                this.nextLimitTime--;
                this.timeText.setText('다음 스테이지 : ' + this.nextLimitTime + 's')
            }
        }, 1000)




        let _towersMap;



        // 데이터 로드

        try {
            if (window.localStorage.getItem('defence-temp-data')) {
                let _tempData: { waveStep, deposit, map, towersMap, nextLimitTime, playerLifeByHeart } = JSON.parse(window.localStorage.getItem('defence-temp-data'));
                this.waveStep = _tempData.waveStep;
                this.playerLifeByHeart = _tempData.playerLifeByHeart;
                this.deposit.setText(_tempData.deposit);
                _towersMap = _tempData.towersMap
                this.nextLimitTime = _tempData.nextLimitTime
                window.localStorage.removeItem('defence-temp-data');
                window.localStorage.removeItem('defence-try-save-not-loggin')

                if (this.waveStep + 1 >= 5) {
                    this.lockState.quick = false;
                }
                if (this.waveStep + 1 >= 10) {
                    this.lockState.long_distance = false;
                }
                if (this.waveStep + 1 >= 15) {
                    this.lockState.slow_debuff = false;
                }

            }
        } catch (e) {
            window.localStorage.removeItem('defence-temp-data');
            window.localStorage.removeItem('defence-try-save-not-loggin')
        }



        this.map.forEach((iLine, i) => {
            iLine.forEach((jTarget, j) => {
                this.decoratingAccessories(i, j)
                // if (jTarget == 0) {
                // } else if (jTarget == -1) {
                // } else {
                // }
            })
        })


        let heart = this.add.image(16 * this.sideLength + this.sideLength / 2 + 10,
            10 * this.sideLength + this.sideLength / 2 - 5, 'heart')
        heart.setScale(this.btnScale)
        this.add.tween({
            targets: heart,
            scaleX: '0.75',
            scaleY: '0.75',
            // x: 400,               // '+=100'
            // y: 300,               // '+=100'
            ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 300,
            repeat: -1,            // -1: infinity
            yoyo: true,
        })
        this.playerLifeByHeartText = this.add.text(17 * this.sideLength + this.sideLength / 2,
            10 * this.sideLength + this.sideLength / 2 - 20, `${this.playerLifeByHeart} / 10`,
            {
                // width: `${this.game.canvas.width - 50}px`,
                // height: `${(this.game.canvas.height / 3) - 50}px`,
                color: '#fff',
                'fontSize': this.btnTextFontSize,
                textAlign: 'left',
                fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                // wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
            })



        this.directionGuideLeft = this.add.image(-100, -100, 'direction-guide');
        this.directionGuideLeft.setVisible(false)
        this.directionGuideLeft.setActive(false);
        this.add.tween({
            targets: this.directionGuideLeft,
            // x: ,               // '+=100'
            // y: 300,               // '+=100'
            alpha: 0.5,
            // ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 250,
            repeat: -1,            // -1: infinity
            yoyo: false,
        })
        this.directionGuideRight = this.add.image(-100, -100, 'direction-guide');
        this.directionGuideRight.setAngle(180);
        this.directionGuideRight.setVisible(false)
        this.directionGuideRight.setActive(false);
        this.add.tween({
            targets: this.directionGuideRight,
            // x: ,               // '+=100'
            // y: 300,               // '+=100'
            alpha: 0.5,
            // ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 250,
            repeat: -1,            // -1: infinity
            yoyo: false,
        })

        this.startBtn = this.add.image(0 * this.sideLength + this.sideLength / 2 + 15,
            9 * this.sideLength + this.sideLength / 2 + 5, 'play');
        this.startGrayBtn = this.add.image(0 * this.sideLength + this.sideLength / 2 + 15,
            9 * this.sideLength + this.sideLength / 2 + 5, 'play_gray');
        this.startGrayBtn.setVisible(false);
        this.startBtn.setScale(this.btnScale)
        this.startGrayBtn.setScale(this.btnScale)

        this.add.tween({
            targets: this.startBtn,
            scaleX: '0.8',
            scaleY: '0.8',
            // x: ,               // '+=100'
            // y: 300,               // '+=100'
            // alpha: 0.5,
            ease: 'Back',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 3000,
            repeat: -1,            // -1: infinity
            yoyo: false,
        })
        this.startBtn.setInteractive({
            useHandCursor: true,
        }).on('pointerup', (pointer) => {
            this.startWave();
        })



        this.add.image(16 * this.sideLength + this.sideLength / 2 + 10,
            9 * this.sideLength + this.sideLength / 2 + 5, 'gold').setScale(this.btnScale)


        this.add.text(12 * this.sideLength + this.sideLength / 2,
            9 * this.sideLength + this.sideLength / 2 - 12, '회원 전용', {
                color: '#fff',
                'fontSize': '14px',
                textAlign: 'left',
                fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                // wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
            })




        this.saveBtnImage = this.add.image(12 * this.sideLength + 95,
            9 * this.sideLength + this.sideLength / 2 + 22, 'interface200100red3').setScale(150 / 200, 30 / 100).setInteractive({
                useHandCursor: true,
            }).on('pointerup', () => {
                this.scene.sleep('stage')
                this.game.renderer.snapshot((image) => {
                    if (this.textures.get('current-snapshot')) {
                        this.textures.remove('current-snapshot')
                    }
                    this.textures.addBase64('current-snapshot', image.src)
                    setTimeout(() => {
                        let target: DefenceSettingScene = (this.scene.get('setting')) as any;
                        target.fromStage = true;
                        this.scene.run('setting')
                    }, 0);
                }, null, null)
            });

        // this.saveBtnImageTween = this.add.tween({
        //     targets: this.saveBtnImage,
        //     y: '-=5',               // '+=100'
        //     // y: 300,               // '+=100'
        //     ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
        //     duration: 400,
        //     repeat: -1,            // -1: infinity
        //     yoyo: false,
        // })
        this.saveBtnText = this.add.text(12 * this.sideLength + this.sideLength / 2 + 15,
            9 * this.sideLength + this.sideLength / 2 + 13, '저장하기', {
                color: '#fff',
                'fontSize': '12px',
                textAlign: 'left',
                fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                // wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
            }).setInteractive({
                useHandCursor: true,
            }).on('pointerup', () => {
                this.scene.sleep('stage')
                this.game.renderer.snapshot((image) => {
                    if (this.textures.get('current-snapshot')) {
                        this.textures.remove('current-snapshot')
                    }
                    this.textures.addBase64('current-snapshot', image.src)
                    setTimeout(() => {
                        let target: DefenceSettingScene = (this.scene.get('setting')) as any;
                        target.fromStage = true;
                        this.scene.run('setting')
                    }, 0);
                }, null, null)
                // this.scene.sendToBack('stage')

            })

        // this.saveBtnTextTween = this.add.tween({
        //     targets: this.saveBtnText,
        //     y: '-=5',               // '+=100'
        //     // y: 300,               // '+=100'
        //     ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
        //     duration: 400,
        //     repeat: -1,            // -1: infinity
        //     yoyo: false,
        // })
        this.add.image(12 * this.sideLength + 95,
            10 * this.sideLength + this.sideLength / 2 + 2.5, 'interface200100red3').setScale(150 / 200, 30 / 100);
        this.add.text(12 * this.sideLength + this.sideLength / 2 + 15,
            10 * this.sideLength + this.sideLength / 2 - 6.5, '히든 스테이지', {
                color: '#fff',
                'fontSize': '12px',
                textAlign: 'left',
                fontFamily: '"Noto Sans","Noto Sans KR","Noto Sans Medium"',
                // wordWrap: { width: this.game.canvas.width - 100, useAdvancedWrap: true }
            }).setInteractive().on('pointerup', () => {
                alert('회원은 31~ 35 스테이지를 추가로 이용할 수 있습니다.')

            })
        this.add.image(
            0 * this.sideLength + this.sideLength / 2 + 15,
            10 * this.sideLength + this.sideLength / 2 - 7, 'timer')
            .setScale(this.btnScale)
        // .setInteractive().on('pointerup', () => {
        //     this.scene.sleep('stage')
        //     this.game.renderer.snapshot((image) => {
        //         if (this.textures.get('current-snapshot')) {
        //             this.textures.remove('current-snapshot')
        //         }
        //         this.textures.addBase64('current-snapshot', image.src)
        //         setTimeout(() => {
        //             this.scene.run('menu')
        //         }, 0);
        //     }, null, null)
        //     // this.scene.sendToBack('stage')

        // })




        //
        this.lineGraphics = this.add.graphics();
        this.drawGrid(this.lineGraphics);
        this.lineGraphics.setInteractive().on('pointerup', () => {
            if (this.selectWindow) {
                this.closeSelectWindow();
            }
            if (this.confirmWindow) {
                this.closeConfirmWindow();
            }
            if (this.upgradeWindow) {
                this.closeUpgradeWindow();
            }
        })
        this.drawPath();

        // the path for our enemies
        // parameters are the start x and y of our path







        this.bombEffects = this.add.group({ classType: BombEffect });
        this.healthBars = this.add.group({ classType: HealthBar });

        let _hitArea = new Phaser.Geom.Rectangle(0, 0, 25, 25)




        // test 용
        this.leftType1Enemies = this.physics.add.group({ classType: Type1ManEnemy, runChildUpdate: true, hitArea: _hitArea });
        this.leftType2Enemies = this.physics.add.group({ classType: Type2ManEnemy, runChildUpdate: true, hitArea: _hitArea });
        this.leftType3Enemies = this.physics.add.group({ classType: Type3ManEnemy, runChildUpdate: true, hitArea: _hitArea });
        this.leftType4Enemies = this.physics.add.group({ classType: Type4ManEnemy, runChildUpdate: true, hitArea: _hitArea });
        this.rightType1Enemies = this.physics.add.group({ classType: Type1WomanEnemy, runChildUpdate: true });
        this.rightType2Enemies = this.physics.add.group({ classType: Type2WomanEnemy, runChildUpdate: true });
        this.rightType3Enemies = this.physics.add.group({ classType: Type3WomanEnemy, runChildUpdate: true });
        this.rightType4Enemies = this.physics.add.group({ classType: Type4WomanEnemy, runChildUpdate: true });
        this.nextLeftType1Enemy = 0;
        this.nextLeftType2Enemy = 0;
        this.nextLeftType3Enemy = 0;
        this.nextLeftType4Enemy = 0;
        this.nextRightType1Enemy = 0;
        this.nextRightType2Enemy = 0;
        this.nextRightType3Enemy = 0;
        this.nextRightType4Enemy = 0;
        // 테스트용

        //


        // this.bullets = this.physics.add.group({ classType: Bullet, , runChildUpdate: true });
        this.eggBullets = this.physics.add.group({ classType: EggBullet, runChildUpdate: true });
        this.punchBullets = this.physics.add.group({ classType: PunchBullet, runChildUpdate: true });
        this.textboxBullets = this.physics.add.group({ classType: TextboxBullet, runChildUpdate: true });
        this.dropSpitBullets = this.physics.add.group({ classType: DropSpitBullet, runChildUpdate: true });
        this.stoneBullets = this.physics.add.group({ classType: StoneBullet, runChildUpdate: true });


        this.bullets = {
            egg: this.eggBullets,
            punch: this.punchBullets,
            textbox: this.textboxBullets,
            dropSpit: this.dropSpitBullets,
            stone: this.stoneBullets
        }

        //
        let _bullets = Object.values(this.bullets)
        this.physics.add.overlap(this.leftType1Enemies, _bullets);
        this.physics.add.overlap(this.leftType2Enemies, _bullets, this.damageEnemy);
        this.physics.add.overlap(this.leftType3Enemies, _bullets, this.damageEnemy);
        this.physics.add.overlap(this.leftType4Enemies, _bullets, this.damageEnemy);
        this.physics.add.overlap(this.rightType1Enemies, _bullets, this.damageEnemy);
        this.physics.add.overlap(this.rightType2Enemies, _bullets, this.damageEnemy);
        this.physics.add.overlap(this.rightType3Enemies, _bullets, this.damageEnemy);
        this.physics.add.overlap(this.rightType4Enemies, _bullets, this.damageEnemy);


        //

        // 웨이브 세팅
        this.settingWave();


        this.displayEnemyConfig();

        this.basicTurrets = this.add.group({ classType: BasicTurret, runChildUpdate: true });
        this.quickTurrets = this.add.group({ classType: QuickTurret, runChildUpdate: true });
        this.loginDistanceTurrets = this.add.group({ classType: LongDistanceTurret, runChildUpdate: true });
        this.slowDebuffTurrets = this.add.group({ classType: SlowDebuffTurret, runChildUpdate: true });


        if (_towersMap) {
            Object.values(_towersMap).forEach((_turret: { id, x, y, type, level }) => {
                var turret: Turret

                switch (_turret.type) {
                    case 'basic':
                        turret = this.basicTurrets.get();
                        break;
                    case 'quick':
                        turret = this.quickTurrets.get();
                        break;
                    case 'long_distance':
                        turret = this.loginDistanceTurrets.get();
                        break;
                    case 'slow_debuff':
                        turret = this.slowDebuffTurrets.get();
                        break;
                    default:
                        turret = this.basicTurrets.get();
                        break;
                }
                if (turret) {
                    let posIndex = _turret.id.split('-')
                    turret.loadLevel(_turret.level)
                    turret.setActive(true);
                    turret.setVisible(true);
                    turret.place(posIndex[0], posIndex[1]);
                    turret.setLevelImage();
                    turret.id = _turret.id
                    turret.type = _turret.type;
                    this.towersMap.set(turret.id, turret);
                }

            });
        }




        // 전체 이벤트 조작
        this.currentDevice$.subscribe(data => {
            if (data.isMobile) {
                this.input
                    .on('pointerdown', (pointer) => {
                        this.updatedScrollTop = pointer.event.clientY;
                    })
                    .on('pointermove', (pointer, ) => {
                        if (pointer.isDown) {
                            if (this.updatedScrollTop) {
                                let delta = this.updatedScrollTop - pointer.event.clientY;
                                if (delta > 0) {
                                    delta = 5
                                } else if (delta < 0) {
                                    delta = -2
                                }

                                window.scrollTo(0, window.scrollY + delta)
                                this.updatedScrollTop = pointer.event.clientY
                            }
                        }
                    })
            }
        })
        this.currentUser$.subscribe((data) => {

            this.isLoggedIn = data ? true : false;
            // if (this.isLoggedIn) {
            //     this.isAdmin = data.isAdmin
            // } else {
            //     this.isAdmin = false;
            // }
        })



        this.messageToast = this.add.image(13 * this.sideLength + 175,
            -1 * this.sideLength - 35, 'interface350100');

        this.messageToastText = this.add.text
            (13 * this.sideLength + 25, (-1 * this.sideLength) - 35, '',

                {
                    lineHeight: 1.3,
                    wordWrap: { width: 290, useAdvancedWrap: true }

                }
            );
        // this.messageToast.setScale(1, 0.5);
        this.messageToastShowTween = this.add.tween({
            targets: this.messageToast,
            y: this.sideLength,               // '+=100'
            // y: 300,               // '+=100'
            ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 500,
            repeat: 0,            // -1: infinity
            yoyo: false,
            onComplete: async () => {
                clearTimeout(this.messageToastTimeout)
                this.messageToastTimeout = setTimeout(() => {
                    if (!this.messageToastHideTween) {

                        this.messageToastHideTween = this.add.tween({
                            targets: this.messageToast,
                            y: -(this.sideLength) - 35,               // '+=100'
                            // y: 300,               // '+=100'
                            ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                            duration: 500,
                            repeat: 0,            // -1: infinity
                            yoyo: false,
                        })
                    } else {
                        this.messageToastHideTween.restart()
                    }
                }, 4000);
            }
        })
        this.messageToastShowTween.pause();
        this.messageToastTextShowTween = this.add.tween({
            targets: this.messageToastText,
            y: this.sideLength - 20,               // '+=100'
            ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 500,
            repeat: 0,            // -1: infinity
            yoyo: false,
            onComplete: async () => {
                clearTimeout(this.messageToastTextTimeout)
                this.messageToastTextTimeout = setTimeout(() => {
                    if (!this.messageToastTextHideTween) {
                        this.messageToastTextHideTween = this.add.tween({
                            targets: this.messageToastText,
                            y: -(this.sideLength) - 35,               // '+=100'
                            ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                            duration: 500,
                            repeat: 0,            // -1: infinity
                            yoyo: false,
                        })
                    } else {
                        this.messageToastTextHideTween.restart()
                    }
                }, 4000);
            }
        })
        this.messageToastTextShowTween.pause();



        this.waveDescriptionWindow =
            this.add
                .group({ classType: DefenceGameWindow })
                .get();

        if (this.fromIndex) {
            this.waveDescriptionWindow.show();
        }


        this.isInit = true;
    }



    // update는 루프 문이다.
    update(time, delta) {

        try {
            if (this.isGameover) {
                return
            }
            if (this.playerLifeByHeart <= 0) {
                this.isWaving = false;
                this.isGameover = true
                this.cameras.main.fadeOut(500);
                setTimeout(() => {
                    clearInterval(this.nextTimer);
                    this.scene.stop('stage')
                    this.scene.start('gameover')
                }, 500);
                return
            }

            // this.sys.step(null,1000)

            if (this.isWaving) {
                if (this.directionGuideLeft.active) {
                    this.directionGuideLeft.setVisible(false);
                    this.directionGuideLeft.setActive(false);
                }
                if (this.directionGuideRight.active) {
                    this.directionGuideRight.setVisible(false);
                    this.directionGuideRight.setActive(false);
                }

                let resultLeft: boolean = true
                let resultRight: boolean = true
                let resultByConfig: boolean = true

                if (!this.customAdmin) {
                    resultByConfig = this.wavingByConfig(time);
                    if (resultByConfig) {
                        this.nextLimitTime = 30;

                        this.waveStep++;

                        if (this.waveStep + 1 == 5) {
                            this.lockState.quick = false
                            this.showMessageToast('할미넴을 고용할 수 있습니다. 이번 판은 원펀맨이 동작하지 않습니다.')
                        }
                        if (this.waveStep + 1 == 10) {
                            this.lockState.long_distance = false
                            this.showMessageToast('양계장 아들을 고용할 수 있습니다. 보스가 나옵니다. 저장하시길 추천드립니다.')
                        }
                        if (this.waveStep + 1 == 15) {
                            this.lockState.slow_debuff = false
                            this.showMessageToast('침뱉는 아이를 고용할 수 있습니다.')
                        }


                        if (this.waveStep + 1 == 36) {
                            let promptTargetName = window.prompt('지금 당장 떠오르는 비매너는?');
                            this.showMessageToast(`${promptTargetName} 등장!!!`)
                            this.http
                                .post('game/defence/survey', { data: promptTargetName })
                                .toPromise()
                                .catch(e => {

                                })
                            Object.values(wave35Config.enemies).forEach(enemy => {
                                enemy.name = promptTargetName;
                            })
                        }
                        if (this.waveStep + 1 >= 32) {
                            if (this.isLoggedIn) {
                                if (this.waveStep + 1 >= 37) {
                                    this.isWaving = false;
                                    this.isGameover = true
                                    this.saveRankingData();
                                    this.cameras.main.fadeOut(2000);
                                    setTimeout(() => {
                                        clearInterval(this.nextTimer);
                                        this.scene.stop('stage')
                                        this.scene.start('ending')
                                    }, 2000);
                                    return
                                }
                            } else {
                                alert('이 다음부터는 로그인 후에 이용 가능합니다.')
                                this.isWaving = false;
                                this.isGameover = true
                                this.cameras.main.fadeOut(2000);
                                setTimeout(() => {
                                    clearInterval(this.nextTimer);
                                    this.scene.stop('stage')
                                    this.scene.start('ending')
                                }, 2000);
                                return
                            }
                        }

                        if (this.waveStep + 1 == 2 || this.waveStep + 1 == 3) {
                            this.showMessageToast('팁 : 초반에는 업글보단 고용을')
                        }

                        if (this.waveStep + 1 == 6) {
                            this.showMessageToast('다음 스테이지 정보를 꼭 확인하세요!')
                        }
                        if (this.waveStep + 1 == 11) {
                            clearInterval(this.nextTimer);
                            this.scene.sleep('stage')
                            setTimeout(() => {
                                this.scene.run('complete')
                            }, 0);
                        }
                        // if (this.waveStep + 1 == 10) {
                        //     this.showMessageToast('보스가 나옵니다. 저장하시길 추천드립니다.')
                        // }
                        if (this.waveStep + 1 == 21) {
                            clearInterval(this.nextTimer);
                            this.scene.sleep('stage')

                            setTimeout(() => {
                                this.scene.run('complete')
                            }, 0);
                        }
                        if (this.waveStep + 1 == 32) {
                            // this.map.forEach((iLine, i) => {
                            //     iLine.forEach((jTarget, j) => {
                            //         this.decoratingAccessories(i, j)
                            //     })
                            // })
                            clearInterval(this.nextTimer);
                            this.scene.sleep('stage')
                            setTimeout(() => {
                                this.scene.run('complete')
                            }, 0);
                        }
                        if (this.waveStep + 1 == 31) {
                            this.showMessageToast('보스가 나옵니다. 저장하시길 추천드립니다.')
                        }
                        this.displayEnemyConfig();

                        this.isWaving = false;

                        this.startBtn.setVisible(true)
                        this.startGrayBtn.setVisible(false);
                        this.waveText.setText('시작')
                        this.isWaving$.next(this.isWaving);
                    }
                }
                if (this.customAdmin) {
                    if (this.playWaveLeft) {
                        resultLeft = this.wavingLeft(time);
                    }
                    if (this.playWaveRight) {
                        resultRight = this.wavingRight(time);
                    }
                    if (resultLeft && resultRight) {
                        this.isWaving = false;
                        this.isWaving$.next(this.isWaving);
                    }
                }


            } else {


                if (this.nextLimitTime <= 0 && !this.customAdmin) {
                    this.startWave();
                }

                if (!this.directionGuideLeft.active) {
                    if (waveTotal[this.waveStep] && waveTotal[this.waveStep].direction != 'right') {
                        this.directionGuideLeft.setVisible(true);
                        this.directionGuideLeft.setActive(true);
                    }
                }
                if (!this.directionGuideRight.active) {
                    if (waveTotal[this.waveStep] && waveTotal[this.waveStep].direction != 'left') {
                        this.directionGuideRight.setVisible(true);
                        this.directionGuideRight.setActive(true);
                    }
                }
                if (time > this.nextDirectionGuide) {
                    this.directionGuideLeft.setPosition(
                        this.nextDirectionStep * this.sideLength + this.sideLength / 2,
                        6 * this.sideLength + this.sideLength / 2)
                    this.directionGuideRight.setPosition(
                        (19 - this.nextDirectionStep) * this.sideLength + this.sideLength / 2,
                        6 * this.sideLength + this.sideLength / 2)
                    this.nextDirectionGuide = time + 500
                    this.nextDirectionStep = this.nextDirectionStep > 1 ? 0 : this.nextDirectionStep + 1;

                }

            }

        } catch (e) {
            console.error(e)
        }




    }



    wavingByConfig(time) {
        let result = 0;
        if (!waveTotal[this.waveStep]) {
            return
        }
        let waveConfigKeys = Object.keys(waveTotal[this.waveStep].enemies);
        for (let key of waveConfigKeys) {
            if (this.playWaveByConfig[key] && this.playWaveByConfig[key].length > 0) {
                if (time > this[`nextWave${key}Enemies`]) {
                    let _enemy: Enemy = this[`${key}Enemies`].get();
                    _enemy.setZ(-9999)
                    if (_enemy) {
                        _enemy.setActive(true);
                        _enemy.setVisible(true);
                        _enemy.startOnPath();
                        this[`nextWave${key}Enemies`] = time + this.playWaveByConfig[key].pop();
                    }
                }

            }
            else {
                // console.log(this[`${key}Enemies`].children.entries);
                if (this[`${key}Enemies`].children.entries.length == 0) {
                    result++;
                }
            }
        }

        return result == waveConfigKeys.length;

    }

    wavingLeft(time) {

        let result: number = 0;
        for (let type of ['Type1', 'Type2', 'Type3', 'Type4']) {
            if (this.playWaveLeft[type.toLocaleLowerCase()].length > 0) {
                if (time > this[`nextLeft${type}Enemy`]) {
                    let _enemy: Enemy = this[`left${type}Enemies`].get();
                    _enemy.setZ(-9999)
                    if (_enemy) {
                        _enemy.setPath(this.leftPath)
                        _enemy.setActive(true);
                        _enemy.setVisible(true);
                        _enemy.startOnPath();

                        this[`nextLeft${type}Enemy`] = time + this.playWaveLeft[type.toLocaleLowerCase()].pop();;
                        // console.log(this[`nextLeft${type}Enemy`])
                    }
                }
            }
            else {
                result++;
            }

        }
        // 모든 타입이 비어있다는 것을 확인
        return result == 4



        // else {
        //     this.waveStep++;
        //     this.isWaving = false;
        // }


    }
    wavingRight(time) {

        let result: number = 0;
        for (let type of ['Type1', 'Type2', 'Type3', 'Type4']) {
            if (this.playWaveRight[type.toLocaleLowerCase()].length > 0) {
                if (time > this[`nextRight${type}Enemy`]) {
                    let _enemy: Enemy = this[`right${type}Enemies`].get();
                    _enemy.setZ(-9999)
                    if (_enemy) {
                        _enemy.setPath(this.rightPath)
                        _enemy.setActive(true);
                        _enemy.setVisible(true);
                        _enemy.startOnPath();
                        this[`nextRight${type}Enemy`] = time + this.playWaveRight[type.toLocaleLowerCase()].pop();;
                    }
                }
            }
            else {
                result++;
            }

        }

        return result == 4

    }


    saveRankingData() {


        this.http
            .post('game/defence/ranking', {
                life: this.playerLifeByHeart,
                deposit: parseInt(this.deposit.text)
            })
            .toPromise()
            .then((r: any) => {

                if (r.message) {
                    if (r.message == 'tai') {
                        alert('이전 기록과 동일합니다. 조금 더 분발하세요.')
                    }
                    else if (r.message == 'life more') {
                        alert('이전 기록 보다 인내심이 많이 깎였네요.')
                    }
                    else if (r.message == 'deposit more') {
                        alert('이전 기록 보다 금액이 더 적네요!')
                    }
                    else if (r.message == 'ok') {
                        alert(`축하 드립니다! 랭킹 데이터가 반영 되었습니다. 인내심 : ${this.playerLifeByHeart} | 금액 : ${parseInt(this.deposit.text)} `)
                    }


                }
            })
            .catch(e => {
                console.log(e);
            })

    }


    sendingSlack() {
        let count = 1;
        if (localStorage.getItem('defence-try')) {
            count = parseInt(localStorage.getItem('defence-try'));
        }

        let mapData: any = {};
        mapData['step'] = this.waveStep + 1;
        this.towersMap.forEach((value, key) => {
            mapData[key] = { type: value.type, level: value.getLevel() }
        })
        this.http
            .jsonp('https://api.ipify.org/?format=jsonp', 'callback')
            .toPromise()
            .then((r: any) => {



                this.http
                    .post('game/defence/try', {
                        count,
                        waveStep: this.waveStep + 1,
                        ip: r.ip,
                        data: {
                            deposit: this.deposit.text,
                            map: mapData,
                            life: this.playerLifeByHeart
                        }
                    })
                    .toPromise()
                    .then(r => {
                        if (this.waveStep + 1 == 1) {
                            count++
                        }
                        localStorage.setItem('defence-try', count + '')
                    })
                    .catch(e => {
                        console.log(e)
                    })
            })
            .catch(e => {
                this.http
                    .post('game/defence/try', {
                        count,
                        waveStep: this.waveStep + 1,
                        ip: undefined,
                        data: {
                            deposit: this.deposit.text,
                            map: mapData,
                            life: this.playerLifeByHeart
                        }
                    })
                    .toPromise()
                    .then(r => {
                        count++
                        localStorage.setItem('defence-try', count + '')
                    })
                    .catch(e => {
                        console.log(e)
                    })
                console.log(e)
            })

    }




}






