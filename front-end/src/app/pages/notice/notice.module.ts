
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from '../../share/share.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from '../../app.interceptor';
import { NoticeComponent } from './notice.component';
import { NoticeDetailComponent } from './detail/notice-detail.component';
import {MarkdownModule} from 'ngx-markdown';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'list'
    },
    {
        path: 'list',
        component: NoticeComponent
    },
    {
        path: ':id',
        component: NoticeDetailComponent
    }
]



@NgModule({
    imports: [
        RouterModule.forChild(routes),
        ShareModule,
        MarkdownModule
    ],
    exports: [
        RouterModule,
        MarkdownModule
    ],
    declarations: [
        NoticeComponent,
        NoticeDetailComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
    ],
})
export class NoticeModule { }
