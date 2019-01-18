
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from '../../share/share.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from '../../app.interceptor';
import { AskComponent } from './ask.component';


const routes: Routes = [
    {
        path: '',
        component: AskComponent
    }
]



@NgModule({
    imports: [
        RouterModule.forChild(routes),
        ShareModule
    ],
    exports: [
        RouterModule,
    ],
    declarations: [AskComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
    ],
})
export class AskModule { }
