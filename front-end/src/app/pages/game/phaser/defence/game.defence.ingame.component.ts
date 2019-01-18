import { Component, HostListener } from '@angular/core';
import * as Phaser from 'phaser';
import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'src/app/redux/root.reducer';
import { wideDisplay, fullScreen } from 'src/app/redux/event/event.action';
import { GameTimeService } from '../../lib/time.service';
import { HttpClient } from '@angular/common/http';
import { DeviceAttribute } from 'src/app/redux/device/device.action';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { DefenceMenuScene } from './scene/defence.menu.scene';
import { DefenceStageScene } from './scene/defence.stage.scene';
import { BasicTurret, Turret, QuickTurret, LongDistanceTurret, SlowDebuffTurret } from './objects/turret';
import { EmenyConfig, Type1ManEnemy, Type2ManEnemy, Type3ManEnemy, Type4ManEnemy, Type1WomanEnemy, Type2WomanEnemy, Type3WomanEnemy, Type4WomanEnemy } from './objects/enemy';
import { DefenceSettingScene } from './scene/defence.setting.scene';
import { DefenceIndexScene } from './scene/defence.index.scene';
import { DefenceGameoverScene } from './scene/defence.gameover.scene';
import { DefenceEndingScene } from './scene/defence.ending.scene';
import { UsersAttribute } from 'src/app/types/schema.types';
import { DefenceCompleteScene } from './scene/defence.complete.scene';



@Component({
    selector: 'app-game-defence-ingame',
    templateUrl: 'game.defence.ingame.component.html',
    styleUrls: ['game.defence.ingame.component.scss']
})
export class GameDefenceIngameComponent {


    isAdmin: boolean = false;


    wolrdSpeed: number = 1;

    basicHitRange: number
    basicShoot: number
    basicPrice: number;
    basicDamage: number
    quickHitRange: number
    quickShoot: number
    quickPrice: number;
    quickDamage: number
    longHitRange: number
    longShoot: number
    longPrice: number;
    longDamage: number
    slowHitRange: number
    slowShoot: number
    slowPrice: number;
    slowDamage: number
    slowDuration: number;
    slowEfficacy: number;



    type1ManEnemyHP: number;
    type1ManEnemyReward: number;
    type1ManEnemySpeed: number
    type2ManEnemyHP: number;
    type2ManEnemyReward: number;
    type2ManEnemySpeed: number
    type3ManEnemyHP: number;
    type3ManEnemyReward: number;
    type3ManEnemySpeed: number
    type4ManEnemyHP: number;
    type4ManEnemyReward: number;
    type4ManEnemySpeed: number

    type1WomanEnemyHP: number;
    type1WomanEnemyReward: number;
    type1WomanEnemySpeed: number
    type2WomanEnemyHP: number;
    type2WomanEnemyReward: number;
    type2WomanEnemySpeed: number
    type3WomanEnemyHP: number;
    type3WomanEnemyReward: number;
    type3WomanEnemySpeed: number
    type4WomanEnemyHP: number;
    type4WomanEnemyReward: number;
    type4WomanEnemySpeed: number





    selectedTurret: Turret = {} as any;


    isWaving: boolean = false;



    isVertical: boolean = false;


    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;
    @select(['user', 'currentUser']) currentUser$: Observable<UsersAttribute>;

    gameConfig: GameConfig
    isMobile: boolean = false;
    whRatio = 1000 / 550;
    padding = 0;


    indexScnee: DefenceIndexScene

    menuScene: Phaser.Scene
    stageScene: DefenceStageScene
    settingScene: DefenceSettingScene

    gameoverScene: DefenceGameoverScene
    endingScene: DefenceEndingScene

    completeScene: DefenceCompleteScene



    inGameStageScene: DefenceStageScene;

    @HostListener('window:resize', ['$event'])
    onResize(event) {

        if (window.innerWidth > 1350) {
            this.ngRedux.dispatch(wideDisplay(false))
        } else {
            this.ngRedux.dispatch(wideDisplay(true))
        }

        // if (this.isMobile) {
        //     this.ngRedux.dispatch(fullScreen(true))
        // } else {
        //     this.ngRedux.dispatch(fullScreen(false))
        // }

        if (window.innerHeight < window.innerWidth && this.isMobile) {
            this.ngRedux.dispatch(fullScreen(true))
        } else {
            this.ngRedux.dispatch(fullScreen(false))
        }
        this.resize();
    }


    endingCount: number = 0;
    phaserGame: Phaser.Game
    constructor(
        private http: HttpClient,
        private ngRedux: NgRedux<AppState>,
        private timeService: GameTimeService,
        private titleService: Title
    ) {

        this.currentUser$.subscribe((data) => {
            if (data) {
                this.isAdmin = data.isAdmin
            }
        })



        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
        })
        this.indexScnee = new DefenceIndexScene();
        this.menuScene = new DefenceMenuScene();
        this.stageScene = new DefenceStageScene(http, timeService);
        this.settingScene = new DefenceSettingScene(http, ngRedux)
        this.gameoverScene = new DefenceGameoverScene();
        this.endingScene = new DefenceEndingScene(http);
        this.completeScene = new DefenceCompleteScene();
    }



    ngOnInit() {

        if (window.innerWidth > 1350) {
            this.ngRedux.dispatch(wideDisplay(false))
        } else {
            this.ngRedux.dispatch(wideDisplay(true))
        }
        this.titleService.setTitle('비매너와의 전쟁 - 비호감 전성시대 (a.k.a 디펜스 게임)');

        // this.http
        //     .get('game/runner/endingcount')
        //     .toPromise()
        //     .then((r: any) => {
        //         console.log(r)
        //         this.endingCount = r.count
        //     })
        //     .catch(e => {
        //         console.log(e)
        //     })


        this.gameConfig = {
            type: Phaser.CANVAS,
            width: 1000,
            height: 550,
            physics: {
                default: 'arcade',
            },
            // zoom: 1 / this.whRatio,

            parent: 'game-display',
            // backgroundColor: 0x084B8A,
            scene: [
                this.indexScnee,
                this.endingScene,
                this.stageScene,
                this.gameoverScene,
                this.menuScene,
                this.settingScene,
                this.completeScene
            ]
        }


        this.phaserGame = new Phaser.Game(this.gameConfig)
        this.phaserGame.canvas.style.maxWidth = `${1000}px`;
        this.phaserGame.canvas.style.maxHeight = `${550}px`;

        if (window.innerHeight < window.innerWidth && this.isMobile) {
            this.ngRedux.dispatch(fullScreen(true))
        } else {
            this.ngRedux.dispatch(fullScreen(false))
        }
        this.resize();


        // this.phaserGame.events.on('resize',()=>{
        //     this.phaserGame.
        // })


    }


    setWaveStep(waveStepNumberInput) {
        if (waveStepNumberInput.value > 0) {
            this.stageScene.waveStep = waveStepNumberInput.value - 1;
        }
    }

    getType() {

        let result;
        if (this.selectedTurret) {
            switch (this.selectedTurret.type) {
                case 'basic':
                    result = 'tower1'
                    break;
                case 'quick':
                    result = 'tower2'
                    break;
                case 'long_distance':
                    result = 'tower3'
                    break;
                case 'slow_debuff':
                    result = 'tower4'
                    break;
            }
        }

        return `../../../../../assets/game/defence/` + result + `.png`
    }

    resize() {

        // document.documentElement.requestFullscreen()

        var canvas = this.phaserGame.canvas, width = window.innerWidth, height = window.innerHeight;
        this.isVertical = width < height;
        var wratio = width / height, ratio = this.whRatio
        if (wratio < ratio) {
            canvas.style.width = (width) - this.padding + "px";
            canvas.style.height = ((width / ratio)) - this.padding + "px";
            // canvas.style.width = ((height * ratio)) - this.padding + "px";
            // canvas.style.height = (height) - this.padding + "px";

        } else {
            canvas.style.width = ((height * ratio)) - this.padding + "px";
            canvas.style.height = (height) - this.padding + "px";
        }



        // if (this.isMobile) {
        //     this.ngRedux.dispatch(fullScreen(true))
        // } else {
        //     this.ngRedux.dispatch(fullScreen(false))
        // }

        if (window.innerHeight < window.innerWidth && this.isMobile) {
            this.ngRedux.dispatch(fullScreen(true))
        } else {
            this.ngRedux.dispatch(fullScreen(false))
        }
    }


    addEnemy(target: number[], val: string) {
        if (val || val == '0') {
            target.push(parseInt(val));
        }
    }

    getInfo() {
        this.stageScene.selectedTurret$.subscribe((turret) => {
            this.selectedTurret = turret;
        });
        this.stageScene.isWaving$.subscribe(result => {
            this.isWaving = result;
        })


        this.basicHitRange = BasicTurret.hitRange;
        this.basicPrice = BasicTurret.price;
        this.basicDamage = BasicTurret.damage;
        this.basicShoot = BasicTurret.speedOfAttack

        this.quickHitRange = QuickTurret.hitRange;
        this.quickShoot = QuickTurret.speedOfAttack;
        this.quickPrice = QuickTurret.price;
        this.quickDamage = QuickTurret.damage;

        this.longHitRange = LongDistanceTurret.hitRange;
        this.longShoot = LongDistanceTurret.speedOfAttack
        this.longPrice = LongDistanceTurret.price;
        this.longDamage = LongDistanceTurret.damage

        this.slowHitRange = SlowDebuffTurret.hitRange
        this.slowShoot = SlowDebuffTurret.speedOfAttack
        this.slowPrice = SlowDebuffTurret.price;
        this.slowDamage = SlowDebuffTurret.damage



        //

        this.type1ManEnemyHP = Type1ManEnemy.hp
        this.type1ManEnemyReward = Type1ManEnemy.reward
        this.type1ManEnemySpeed = Type1ManEnemy.speed

        this.type2ManEnemyHP = Type2ManEnemy.hp
        this.type2ManEnemyReward = Type2ManEnemy.reward
        this.type2ManEnemySpeed = Type2ManEnemy.speed

        this.type3ManEnemyHP = Type3ManEnemy.hp
        this.type3ManEnemyReward = Type3ManEnemy.reward
        this.type3ManEnemySpeed = Type3ManEnemy.speed

        this.type4ManEnemyHP = Type4ManEnemy.hp
        this.type4ManEnemyReward = Type4ManEnemy.reward
        this.type4ManEnemySpeed = Type4ManEnemy.speed

        //
        this.type1WomanEnemyHP = Type1WomanEnemy.hp
        this.type1WomanEnemyReward = Type1WomanEnemy.reward
        this.type1WomanEnemySpeed = Type1WomanEnemy.speed

        this.type2WomanEnemyHP = Type2WomanEnemy.hp
        this.type2WomanEnemyReward = Type2WomanEnemy.reward
        this.type2WomanEnemySpeed = Type2WomanEnemy.speed

        this.type3WomanEnemyHP = Type3WomanEnemy.hp
        this.type3WomanEnemyReward = Type3WomanEnemy.reward
        this.type3WomanEnemySpeed = Type3WomanEnemy.speed

        this.type4WomanEnemyHP = Type4WomanEnemy.hp
        this.type4WomanEnemyReward = Type4WomanEnemy.reward
        this.type4WomanEnemySpeed = Type4WomanEnemy.speed



    }

    settingEnemy() {


        Type1ManEnemy.hp = this.type1ManEnemyHP;
        Type1WomanEnemy.hp = this.type1ManEnemyHP;

        Type1ManEnemy.reward = this.type1ManEnemyReward
        Type1WomanEnemy.reward = this.type1ManEnemyReward

        Type1ManEnemy.speed = this.type1ManEnemySpeed;
        Type1WomanEnemy.speed = this.type1ManEnemySpeed;
        //
        Type2ManEnemy.hp = this.type2ManEnemyHP;
        Type2WomanEnemy.hp = this.type2ManEnemyHP;

        Type2ManEnemy.reward = this.type2ManEnemyReward
        Type2WomanEnemy.reward = this.type2ManEnemyReward

        Type2ManEnemy.speed = this.type2ManEnemySpeed;
        Type2WomanEnemy.speed = this.type2ManEnemySpeed;
        //
        Type3ManEnemy.hp = this.type3ManEnemyHP;
        Type3WomanEnemy.hp = this.type3ManEnemyHP;

        Type3ManEnemy.reward = this.type3ManEnemyReward
        Type3WomanEnemy.reward = this.type3ManEnemyReward

        Type3ManEnemy.speed = this.type3ManEnemySpeed;
        Type3WomanEnemy.speed = this.type3ManEnemySpeed;
        //
        Type4ManEnemy.hp = this.type4ManEnemyHP;
        Type4WomanEnemy.hp = this.type4ManEnemyHP;

        Type4ManEnemy.reward = this.type4ManEnemyReward
        Type4WomanEnemy.reward = this.type4ManEnemyReward

        Type4ManEnemy.speed = this.type4ManEnemySpeed;
        Type4WomanEnemy.speed = this.type4ManEnemySpeed;
        //





    }


    setInit() {

        BasicTurret.hitRange = this.basicHitRange;
        BasicTurret.price = this.basicPrice;
        BasicTurret.damage = this.basicDamage;
        BasicTurret.speedOfAttack = this.basicShoot;


        QuickTurret.hitRange = this.quickHitRange;
        QuickTurret.speedOfAttack = this.quickShoot;
        QuickTurret.price = this.quickPrice;
        QuickTurret.damage = this.quickDamage;

        LongDistanceTurret.hitRange = this.longHitRange;
        LongDistanceTurret.speedOfAttack = this.longShoot;
        LongDistanceTurret.price = this.longPrice;
        LongDistanceTurret.damage = this.longDamage;

        SlowDebuffTurret.hitRange = this.slowHitRange;
        SlowDebuffTurret.speedOfAttack = this.slowShoot
        SlowDebuffTurret.price = this.slowPrice;
        SlowDebuffTurret.damage = this.slowDamage;


    }

    ngAfterViewInit() {
        this.getInfo();
    }



    setWorldSpeed(amount) {
        this.stageScene.setWolrdSpeed(amount)
    }


    ngOnDestroy() {
        if (this.stageScene.nextTimer) {
            clearInterval(this.stageScene.nextTimer)
        }


        this.phaserGame.destroy(true);
        this.ngRedux.dispatch(wideDisplay(false));
        this.ngRedux.dispatch(fullScreen(false))
    }

    // touchMove($event) {
    //     console.log($event)
    // }



}


