


import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share/share.module';
import { GameEvaluationComponent } from './game-evaluation.component';
import { RefugeListModule } from '../../refuges/refuge-list/refuge-list.module';


@NgModule({
    imports: [ShareModule,RefugeListModule],
    exports: [GameEvaluationComponent],
    declarations: [GameEvaluationComponent],
    providers: [],
})
export class GameEvaluationModule { }
