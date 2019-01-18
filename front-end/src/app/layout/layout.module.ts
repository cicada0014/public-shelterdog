import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ShareModule } from '../share/share.module';
import { MegaMenuModule } from 'primeng/megamenu';
import { LeftSideComponent } from './left-side/left-side.component';
import { RightSideComponent } from './right-side/right-side.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';

import { ScrollTopComponent } from './fixed-tools/scroll-top.component';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule } from '@angular/router';
import { LightboxModule } from 'primeng/lightbox';
import { SignInDialogComponent } from './dialogs/sign-in/sign-in.dialog.component';
import { ResetPasswordDialogComponent } from './dialogs/reset-password/reset-password.dialog.component';
// import { TabMenuModule } from 'primeng/tabmenu';
// import { MatTabsModule } from '@angular/material/tabs';
import { MobileGNBTabsComponent } from './mobile-gnb-tabs/mobile-gnb-tabs.component';
import { CTAFacebookLikeComponent } from './cta/facebook-like/cta.facebook-like.component';

@NgModule({
    imports: [
        ContextMenuModule,
        MegaMenuModule,
        ShareModule,
        SidebarModule,
        PanelMenuModule,
        MarkdownModule,
        RouterModule,
        // TabMenuModule,
        // LightboxModule
        // MatTabsModule ,

    ],
    declarations: [
        HeaderComponent,
        FooterComponent,
        LeftSideComponent,
        RightSideComponent,
        ScrollTopComponent,
        SignInDialogComponent,
        ResetPasswordDialogComponent,
        MobileGNBTabsComponent,


    ],
    exports: [
        MobileGNBTabsComponent,
        ResetPasswordDialogComponent,
        SignInDialogComponent,
        ContextMenuModule,
        HeaderComponent,
        FooterComponent,
        LeftSideComponent,
        RightSideComponent,
        MegaMenuModule,
        SidebarModule,
        PanelMenuModule,
        ShareModule,
        ScrollTopComponent,
        MarkdownModule,
        RouterModule
    ],
    providers: [

    ],
})
export class LayoutModule { }
