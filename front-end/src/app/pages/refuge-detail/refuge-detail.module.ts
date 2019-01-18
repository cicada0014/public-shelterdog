


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RefugeDetailComponent } from './refuge-detail.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from '../../app.interceptor';
import { ShareModule } from '../../share/share.module';
import { ShareRefugeDetailModule } from './share-refuge-detail.module';




const routes: Routes = [
    {
        path: ':refuge_id',
        component: RefugeDetailComponent,
    },
    {
        path: ':refuge_id/:from_refuge_id',
        component: RefugeDetailComponent,
    },

    {
        path: '**',
        redirectTo: '/refuges'
    }
]



@NgModule({
    imports: [
        RouterModule.forChild(routes),
        ShareRefugeDetailModule,



    ],
    exports: [
        RouterModule,

    ],
    declarations: [],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
    ],
})
export class RefugeDetailModule { }
