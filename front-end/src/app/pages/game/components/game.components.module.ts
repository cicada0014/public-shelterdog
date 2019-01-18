

import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share/share.module';
import { GameRankingComponent } from './rankiing/game.ranking.component';


@NgModule({
    imports: [ShareModule],
    exports: [GameRankingComponent],
    declarations: [GameRankingComponent],
    providers: [],
})
export class GameComponentsModule { }
