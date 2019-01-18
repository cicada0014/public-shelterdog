


import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share/share.module';
import { HaewoosoComponent } from './haewooso.component';
import { Routes, RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


const routes: Routes = [
    {
        path: '',
        component: HaewoosoComponent
    }
]


@NgModule({
    imports: [
        InfiniteScrollModule,
        ShareModule,
        RouterModule.forChild(routes)
    ],
    exports: [HaewoosoComponent],
    declarations: [HaewoosoComponent],
    providers: [],
})
export class HaewoosoModule { }
