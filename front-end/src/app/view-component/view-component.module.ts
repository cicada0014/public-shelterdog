

import { NgModule } from '@angular/core';
import { QuickWriterComponent } from './quick-writer/quick-writer.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from '../app.interceptor';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
    imports: [
        CommonModule,
        DropdownModule,
        HttpClientModule,
        ButtonModule,
        FileUploadModule,
        FormsModule,
        CheckboxModule
    ],
    exports: [QuickWriterComponent],
    declarations: [QuickWriterComponent],
    providers: [

        { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },

    ],
})
export class ViewComponentModule { }
