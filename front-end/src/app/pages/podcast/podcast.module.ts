
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from '../../share/share.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from '../../app.interceptor';
import { PodcastListComponent } from './podcast.list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
const routes: Routes = [
    {
        path: '',
        redirectTo: 'list'
    },
    {
        path: 'list',
        component: PodcastListComponent
    }
]



@NgModule({
    imports: [
        RouterModule.forChild(routes),
        InfiniteScrollModule,
        ShareModule,
    ],
    exports: [
        RouterModule,
    ],
    declarations: [
        PodcastListComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
    ],
})
export class PodcastModule { }
