import { AdsenseModule } from 'ng2-adsense';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OrderListModule } from 'primeng/orderlist';
import { DataViewModule } from 'primeng/dataview';
import { ListboxModule } from 'primeng/listbox';
import { InputMaskModule } from 'primeng/inputmask';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { BlockUIModule } from 'primeng/blockui';
import { TabMenuModule } from 'primeng/tabmenu';
import { CardModule } from 'primeng/card';
import { PickListModule } from 'primeng/picklist';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AccordionModule } from 'primeng/accordion';
import { ViewComponentModule } from '../view-component/view-component.module';
import { GoogleAdsenseResponsiveComponent } from './google-adsense/responsive/google-adsense-reponsive.component';
import { CTAFacebookLikeComponent } from '../layout/cta/facebook-like/cta.facebook-like.component';
import { VendingMachineItemTemplateComponent } from '../pages/vending_machine/item-template/vending_machine.item-template.component';


@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        PanelModule,
        HttpClientModule,
        DialogModule,
        ToastModule,
        ScrollPanelModule,
        OrderListModule,
        DataViewModule,
        ButtonModule,
        ListboxModule,
        InputMaskModule,
        RadioButtonModule,
        OverlayPanelModule,
        DropdownModule,
        InputTextareaModule,
        MessagesModule,
        CheckboxModule,
        BlockUIModule,
        TabMenuModule,
        CardModule,
        PickListModule,
        ProgressSpinnerModule,
        ConfirmDialogModule,
        InputSwitchModule,
        HttpClientJsonpModule,
        AccordionModule,
        ViewComponentModule,
        AdsenseModule

    ],
    exports: [
        CTAFacebookLikeComponent,
        GoogleAdsenseResponsiveComponent,
        FormsModule,
        CommonModule,
        PanelModule,
        HttpClientModule,
        HttpClientJsonpModule,
        DialogModule,
        ToastModule,
        ScrollPanelModule,
        OrderListModule,
        DataViewModule,
        ButtonModule,
        ListboxModule,
        InputMaskModule,
        RadioButtonModule,
        OverlayPanelModule,
        DropdownModule,
        InputTextareaModule,
        MessagesModule,
        CheckboxModule,
        BlockUIModule,
        TabMenuModule,
        CardModule,
        PickListModule,
        ProgressSpinnerModule,
        ConfirmDialogModule,
        InputSwitchModule,
        AccordionModule,
        ViewComponentModule,
        AdsenseModule,
        VendingMachineItemTemplateComponent
    ],
    declarations: [
        GoogleAdsenseResponsiveComponent,
        CTAFacebookLikeComponent,
        VendingMachineItemTemplateComponent
    ],
    providers: [],
})
export class ShareModule { }
