
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from '../../share/share.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from '../../app.interceptor';
import { MarkdownModule } from 'ngx-markdown';
import { GameCiderComponent } from './cider/game.cider.component';
import { GameIndexComponent } from './game.index.component';
import { GameDeactivateGuard } from 'src/app/service/game.deactive.guard';
import { GameEvaluationComponent } from './evaluation/game-evaluation.component';
import { AuthGuard } from 'src/app/service/auth.guard';
import { GameTimeService } from './lib/time.service';
import { GameEvaluationModule } from './evaluation/game-evaluation.module';
import { GameDifferencePuzzleComponent } from './difference-puzzle/game.difference-puzzle.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'index'
    },
    {
        path: 'index',
        component: GameIndexComponent
    },
    {
        path: 'cider',
        // canDeactivate: [GameDeactivateGuard],
        component: GameCiderComponent
    },
    {
        path: 'difference-puzzle',
        // canDeactivate: [GameDeactivateGuard],
        component: GameDifferencePuzzleComponent,
    },
    {
        path: 'runner',
        // canDeactivate: [GameDeactivateGuard],
        loadChildren: 'src/app/pages/game/phaser/runner/game.runner.module#PhaserGameRunnerModule'
    },
    {
        path: 'defence',
        // canDeactivate: [GameDeactivateGuard],
        loadChildren: 'src/app/pages/game/phaser/defence/game.defence.module#PhaserGameDefenceModule'
    },
]



@NgModule({
    imports: [
        RouterModule.forChild(routes),
        ShareModule,
        GameEvaluationModule
    ],
    exports: [
        RouterModule,
    ],
    declarations: [
        GameCiderComponent,
        GameDifferencePuzzleComponent,
        GameIndexComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
        GameDeactivateGuard,
        GameTimeService
    ],
})
export class GameModule { }
