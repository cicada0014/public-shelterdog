import { PaginatorModule, Paginator } from 'primeng/paginator';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from '../../share/share.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from '../../app.interceptor';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { VendingMachineIndexComponent } from './vending_machine.index.component';
import { VendingMachineCiderComponent } from './cider/vending_machine.cider.component';
import { VendingMachineCiderDetailComponent } from './cider/detail/vending_machine.cider.detail.component';
import { NguCarouselModule } from '@ngu/carousel';
import { VendingMachineItemTemplateComponent } from './item-template/vending_machine.item-template.component';
const routes: Routes = [
    {
        path: '',
        redirectTo: 'cider/list'
    },
    {
        path: 'cider/list',
        component: VendingMachineCiderComponent
    },
    {
        path: 'cider/:id',
        component: VendingMachineCiderDetailComponent
    }
]



@NgModule({
    imports: [
        RouterModule.forChild(routes),
        // InfiniteScrollModule,
        PaginatorModule,
        ShareModule,
        NguCarouselModule
    ],
    exports: [
        RouterModule,
    ],
    declarations: [
        VendingMachineIndexComponent,
        VendingMachineCiderComponent,
        VendingMachineCiderDetailComponent,


    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
    ],
})
export class VendingMachineModule { }
