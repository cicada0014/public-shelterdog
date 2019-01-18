
import { NgModule } from '@angular/core';
import { DefaultRefugeComponent } from './default.refuge.component';
import { BestRefugeComponent } from './best-refuge/best-refuge.component';
import { RouterModule, Routes } from '@angular/router';
import { ShareModule } from '../../share/share.module';
import { PopularRefugeComponent } from './popular-refuge/popular-refuge.component';
import { RefugeListComponent } from './refuge-list/refuge-list.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from '../../app.interceptor';
// import { CarouselModule } from 'primeng/carousel';
import { DefaultPodCastComponent } from './podcast/podcast.component';
import { GameAreaComponent } from './game-area/game-area.component';
import { NguCarouselModule } from '@ngu/carousel';
import { RefugeListModule } from './refuge-list/refuge-list.module';




const routes: Routes = [
    {
        path: '',
        component: DefaultRefugeComponent,
    }
]



@NgModule({
    imports: [
        RouterModule.forChild(routes),
        ShareModule,
        // CarouselModule,
        NguCarouselModule,
        RefugeListModule
    ],
    exports: [
        DefaultRefugeComponent,
        BestRefugeComponent,
        PopularRefugeComponent,
        RouterModule
    ],
    declarations: [
        DefaultRefugeComponent,
        PopularRefugeComponent,
        BestRefugeComponent,
        DefaultPodCastComponent,
        GameAreaComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
    ],
})
export class RefugesModule { }
