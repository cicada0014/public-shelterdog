


import { NgModule } from '@angular/core';
import { RefugeDetailComponent } from './refuge-detail.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ShareModule } from '../../share/share.module';
import { RefugeListModule } from '../refuges/refuge-list/refuge-list.module';
import { PaginatorModule, Paginator } from 'primeng/paginator';

@NgModule({
    imports: [
        InfiniteScrollModule,
        RefugeListModule,
        ShareModule,
        PaginatorModule
    ],
    exports: [RefugeDetailComponent],
    declarations: [RefugeDetailComponent],
    providers: [],
})
export class ShareRefugeDetailModule { }
