


import { NgModule } from '@angular/core';
import { IndexPageComponent } from './index.page.component';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '../layout/layout.module';
import { AuthGuard } from '../service/auth.guard';
import { MessageService } from 'primeng/api';
import { AboutComponent } from './about/about.component';
import { AdminGuard } from '../service/admin.guard';
import { WelcomePageComponent } from './welcome/welcome.component';
import { ResetTempComponent } from './other/reset-temp/reset-temp.component';
import { UpdateService } from '../service/update.service';

const routes: Routes = [
    {
        path: '',
        component: IndexPageComponent,
        children: [
            {
                path: '',
                redirectTo: 'refuges',
                pathMatch: 'full'
            },
            {
                path: 'refuges',
                loadChildren: 'src/app/pages/refuges/refuges.module#RefugesModule'
            },
            {
                path: 'refuge-detail',
                loadChildren: 'src/app/pages/refuge-detail/refuge-detail.module#RefugeDetailModule'
            },
            {
                path: 'refuge-article',
                loadChildren: 'src/app/pages/refuge-article/refuge-article.module#RefugeArticleModule'
            },
            {
                path: 'article-editor',
                canActivate: [AuthGuard],
                loadChildren: 'src/app/pages/article-editor/article-editor.module#ArticleEditorModule'
            },
            {
                path: 'ask',
                // canActivate: [AuthGuard],
                loadChildren: 'src/app/pages/ask/ask.module#AskModule'
            },
            {
                path: 'refuge-request',
                // canActivate: [AuthGuard],
                loadChildren: 'src/app/pages/refuge-request/refuge-request.module#RefugeRequestModule'
            },
            {
                path: 'my',
                canActivate: [AuthGuard],
                loadChildren: 'src/app/pages/my/my.module#MyModule'
            },
            {
                path: 'admin',
                canActivate: [AdminGuard],
                loadChildren: 'src/app/pages/admin/admin.module#AdminModule'
            },
            {
                path: 'notice',
                // canActivate: [AdminGuard],
                loadChildren: 'src/app/pages/notice/notice.module#NoticeModule'
            },
            {
                path: 'podcast',
                // canActivate: [AdminGuard],
                loadChildren: 'src/app/pages/podcast/podcast.module#PodcastModule'
            },
            {
                path: 'game',
                // canActivate: [AuthGuard],
                loadChildren: 'src/app/pages/game/game.module#GameModule'
            },
            {
                path: 'haewooso',
                // canActivate: [AuthGuard],
                loadChildren: 'src/app/pages/haewooso/haewooso.module#HaewoosoModule'
            },
            {
                path: 'vending_machine',
                // canActivate: [AuthGuard],
                loadChildren: 'src/app/pages/vending_machine/vending_machine.module#VendingMachineModule'
            },
            {
                path: 'sign',
                // canActivate: [AdminGuard],
                loadChildren: 'src/app/pages/sign/sign.module#SignModule'
            },
            {
                path: 'about',
                component: AboutComponent
            },
            {
                path: 'welcome',
                component: WelcomePageComponent
            },
            {
                path: 'reset-temp',
                component: ResetTempComponent
            }
        ]
    }


]



@NgModule({
    imports: [
        RouterModule.forChild(routes),
        LayoutModule,
    ],
    exports: [
        RouterModule,
        LayoutModule,
        IndexPageComponent,
        AboutComponent,
        WelcomePageComponent
    ],
    declarations: [
        IndexPageComponent,
        AboutComponent,
        WelcomePageComponent,
        ResetTempComponent
    ],
    providers: [
        AdminGuard,
        AuthGuard,
        MessageService,
        UpdateService
    ],
})
export class PagesModule { }
