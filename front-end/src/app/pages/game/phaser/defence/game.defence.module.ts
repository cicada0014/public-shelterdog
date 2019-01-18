

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameTimeService } from '../../lib/time.service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GameEvaluationComponent } from '../../evaluation/game-evaluation.component';
import { GameEvaluationModule } from '../../evaluation/game-evaluation.module';
import { CustomHttpInterceptor } from 'src/app/app.interceptor';
import { GameDefenceComponent } from './game.defence.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GameDefenceIngameComponent } from './game.defence.ingame.component';
import { ButtonModule } from 'primeng/button';
import { GameComponentsModule } from '../../components/game.components.module';



const routes: Routes = [
    {
        path: 'ingame',
        component: GameDefenceIngameComponent,
    },
    {
        path: '**',
        component: GameDefenceComponent,
    }

]



@NgModule({
    imports: [
        RouterModule.forChild(routes),
        HttpClientModule,
        GameEvaluationModule,
        FormsModule,
        CommonModule,
        ButtonModule,
        GameComponentsModule

    ],
    exports: [
        RouterModule
    ],
    declarations: [
        GameDefenceComponent,
        GameDefenceIngameComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
        GameTimeService

    ],
})
export class PhaserGameDefenceModule { }
