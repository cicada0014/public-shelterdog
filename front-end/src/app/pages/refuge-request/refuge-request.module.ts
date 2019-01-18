
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from '../../share/share.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from '../../app.interceptor';
import { RefugeRequestComponent } from './refuge-request.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes: Routes = [
    {
        path: '',
        component: RefugeRequestComponent
    }
]



@NgModule({
    imports: [
        RouterModule.forChild(routes),
        ShareModule,
        InfiniteScrollModule
    ],
    exports: [
        RouterModule,
    ],
    declarations: [RefugeRequestComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
    ],
})
export class RefugeRequestModule { }
