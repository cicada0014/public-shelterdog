
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RefugeArticleComponent } from './refuge-article.component';
import { ShareModule } from '../../share/share.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from '../../app.interceptor';
import { EditorModule } from 'primeng/editor';
import { RefugeDetailComponent } from '../refuge-detail/refuge-detail.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ShareRefugeDetailModule } from '../refuge-detail/share-refuge-detail.module';

const routes: Routes = [
    {
        path: ':id/:from',
        component: RefugeArticleComponent,
    },
    {
        path: ':id',
        component: RefugeArticleComponent,
    },
    {
        path: '**',
        redirectTo: '/refuges'
    }

]



@NgModule({
    imports: [
        RouterModule.forChild(routes),
        ShareModule,
        EditorModule,
        ShareRefugeDetailModule
    ],
    exports: [
        RouterModule,
        RefugeArticleComponent
    ],
    declarations: [
        RefugeArticleComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
    ],
})
export class RefugeArticleModule { }
