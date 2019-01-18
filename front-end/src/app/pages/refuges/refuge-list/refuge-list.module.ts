
import { NgModule } from '@angular/core';
import { RefugeListComponent } from './refuge-list.component';
import { RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share/share.module';



@NgModule({
    imports: [RouterModule, ShareModule],
    exports: [RefugeListComponent, RouterModule, ShareModule],
    declarations: [RefugeListComponent],
    providers: [],
})
export class RefugeListModule { }
