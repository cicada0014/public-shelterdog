import { Component, HostListener } from '@angular/core';
import * as Phaser from 'phaser';
import { RunnerMenuScene } from './scene/runner.menu.scene';
import { RunnerStageScene } from './scene/runner.stage.scene';
import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'src/app/redux/root.reducer';
import { wideDisplay, fullScreen } from 'src/app/redux/event/event.action';
import { RunnerIntroScene } from './scene/runner.intro.scene';
import { GameTimeService } from '../../lib/time.service';
import { RunnerTestScene } from './scene/runner.test.scene';
import { runnerGravity } from './game.runner.config';
import { RunnerGameoverScene } from './scene/runner.gameover.scene';
import { RunnerEndingScene } from './scene/runner.ending.scene';
import { HttpClient } from '@angular/common/http';
import { DeviceAttribute } from 'src/app/redux/device/device.action';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';


@Component({
    selector: 'app-game-runner',
    templateUrl: 'game.runner.component.html',
    styleUrls: ['game.runner.component.scss']
})
export class GameRunnerComponent {

    @select(['device', 'currentDevice']) currentDevice$: Observable<DeviceAttribute>;

    gameConfig: GameConfig
    isMobile: boolean = false;
    whRatio = 2 / 1;
    padding = 0;



    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (window.innerWidth > 1350) {
            this.ngRedux.dispatch(wideDisplay(false))
        } else {
            this.ngRedux.dispatch(wideDisplay(true))
        }


        if (window.innerHeight < window.innerWidth && this.isMobile) {
            this.ngRedux.dispatch(fullScreen(true))
        } else {
            this.ngRedux.dispatch(fullScreen(false))
        }
        this.resize();
    }


    endingCount: number = 0;
    phaserGame: Phaser.Game
    menuScene: RunnerMenuScene
    stageScene: RunnerStageScene
    introScene: RunnerIntroScene
    runnerTestScene: RunnerTestScene
    gameoverScene: RunnerGameoverScene
    endingScene: RunnerEndingScene
    constructor(
        private http: HttpClient,
        private ngRedux: NgRedux<AppState>,
        private timeService: GameTimeService,
        private titleService: Title
    ) {

        this.currentDevice$.subscribe(data => {
            this.isMobile = data.isMobile;
            if (this.isMobile) {

            }
        })
        this.menuScene = new RunnerMenuScene();
        this.stageScene = new RunnerStageScene(this.http);
        this.introScene = new RunnerIntroScene(this.timeService);
        this.runnerTestScene = new RunnerTestScene();
        this.gameoverScene = new RunnerGameoverScene();
        this.endingScene = new RunnerEndingScene(this.timeService, this.http);


    }
    ngOnInit() {


        if (window.innerWidth > 1350) {
            this.ngRedux.dispatch(wideDisplay(false))
        } else {
            this.ngRedux.dispatch(wideDisplay(true))
        }


        this.titleService.setTitle(`죄수번호 5275`);

        this.http
            .get('game/runner/endingcount')
            .toPromise()
            .then((r: any) => {
                console.log(r)
                this.endingCount = r.count
            })
            .catch(e => {
                console.log(e)
            })

        // this.ngRedux.dispatch(fullScreen(true))


        // 
        // let canvasWidth;
        // let canvasHeight
        // let ratio = this.whRatio;
        // let wratio = window.innerWidth / window.innerHeight;
        // if (wratio < ratio) {
        //     canvasWidth = window.innerWidth;
        //     canvasHeight = (window.innerWidth / ratio);
        // } else {
        //     canvasWidth = (window.innerHeight * ratio);
        //     canvasHeight = window.innerHeight;

        // }

        this.gameConfig = {
            type: Phaser.CANVAS,
            width: 800,
            height: 400,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {
                        y: runnerGravity
                    }
                }

            },
            zoom: 0.5,

            parent: 'game-display',
            scene: [
                this.menuScene,
                this.endingScene,
                this.stageScene,
                this.gameoverScene,
                this.runnerTestScene,
                this.introScene,

            ]
        }


        this.phaserGame = new Phaser.Game(this.gameConfig)
        this.phaserGame.canvas.style.maxWidth = '1000px';
        this.phaserGame.canvas.style.maxHeight = '500px';

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

    resize() {

        var canvas = this.phaserGame.canvas, width = window.innerWidth, height = window.innerHeight;
        var wratio = width / height, ratio = this.whRatio
        if (wratio < ratio) {
            canvas.style.width = (width) - this.padding + "px";
            canvas.style.height = ((width / ratio)) - this.padding + "px";
        } else {
            canvas.style.width = ((height * ratio)) - this.padding + "px";
            canvas.style.height = (height) - this.padding + "px";
        }
    }

    ngAfterViewInit() {

    }



    ngOnDestroy() {
        this.phaserGame.destroy(true);
        this.ngRedux.dispatch(wideDisplay(false));
        this.ngRedux.dispatch(fullScreen(false))


    }



}