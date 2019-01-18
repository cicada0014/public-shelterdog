

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameRunnerComponent } from './game.runner.component';
import { RunnerStageScene } from './scene/runner.stage.scene';
import { RunnerMenuScene } from './scene/runner.menu.scene';
import { GameTimeService } from '../../lib/time.service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GameEvaluationComponent } from '../../evaluation/game-evaluation.component';
import { GameEvaluationModule } from '../../evaluation/game-evaluation.module';
import { CustomHttpInterceptor } from 'src/app/app.interceptor';



const routes: Routes = [
    // {
    //     path: '',
    //     component: RefugeArticleComponent,
    // },
    {
        path: '**',
        component: GameRunnerComponent,
    }

]



@NgModule({
    imports: [
        RouterModule.forChild(routes),
        HttpClientModule,
        GameEvaluationModule

    ],
    exports: [
        RouterModule
    ],
    declarations: [
        GameRunnerComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
        GameTimeService

    ],
})
export class PhaserGameRunnerModule { }
