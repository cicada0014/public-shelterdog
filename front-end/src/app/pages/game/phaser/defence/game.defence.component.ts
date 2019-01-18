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
import { Router } from '@angular/router';



@Component({
    selector: 'app-game-defence',
    templateUrl: 'game.defence.component.html',
    styleUrls: ['game.defence.component.scss']
})
export class GameDefenceComponent {



    constructor(
        private http: HttpClient,
        private ngRedux: NgRedux<AppState>,
        private timeService: GameTimeService,
        private titleService: Title,
        private router: Router
    ) {

    }

    playGame() {
        this.router.navigateByUrl('game/defence/ingame');
    }


    ngOnInit() {
        this.titleService.setTitle('비매너와의 전쟁 - 비호감 전성시대 (a.k.a 디펜스 게임)');
    }






}


