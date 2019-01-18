

import { Container } from 'inversify';
import { AuthController } from './controller/auth/auth.controller';
import { MysqlConnection } from './db/mysql.connection';
import { AuthService } from './lib/auth/auth';
import { RefugesSchema } from './schemata/refuges.schema';
import { RefugeArticleCommentsSchema } from './schemata/refuge_article_comments.schema';
import { RefugeArticlesSchema } from './schemata/refuge_articles.schema';
import { AdministratorsSchema } from './schemata/administrators.schema';
import { CategoriesSchema } from './schemata/categories.schema';
import { UserProfilesSchema } from './schemata/user_profile.shcema';
import { UsersSchema } from './schemata/users.schema';
import { RefugesDAO } from './dao/refuges/refuges.dao';
import { RefugesController } from './controller/refuges/refuges.controller';
import { MailerService } from './lib/mailer/mailer.service';
import { UsersDAO } from './dao/user/users.dao';
import { TokenGenerator } from './lib/auth/token.generator';
import { ArticleController } from './controller/article/article.controller';
import { ArticleDAO } from './dao/article/article.dao';
import { GraphEdgesSchema } from './schemata/graph_edges.schema';

import { GraphObjectsSchema } from './schemata/graph_objects.schema';
import { GraphDAO } from './dao/graph/graph.dao';
import { RefugeRequestsSchema } from './schemata/refuge_request.schema';
import { AWSservice } from './lib/aws/aws.service';
import { UploadController } from './controller/upload/upload.controller';
import { AdminRefugesController } from './controller/admin/admin.refuges.controller';
import { AdminCategoiresController } from './controller/admin/admin.categories.controller';
import { CategoryDAO } from './dao/category/category.dao';
import { NoticesSchema } from './schemata/notices.schema';
import { NoticeDAO } from './dao/notice/notice.dao';
import { NoticeController } from './controller/notice/notice.controller';
import { AdminReportController } from './controller/admin/admin.report.controller';
import { AdminNoticeController } from './controller/admin/admin.notice.controller';
import { StaticPagesSchema } from './schemata/static-pages.schema';
import { StaticPagesDAO } from './dao/static-pages/static-pages.dao';
import { AdminStaticPagesController } from './controller/admin/admin.static-pages.controller';
import { StaticPagesController } from './controller/static-pages/static-pages.controller';
import { AdminUserController } from './controller/admin/admin.user.controller';
import { AdminStatisticsUserController } from './controller/admin/statistics/user/admin.statistics.user.controller';
import { AdminArticleController } from './controller/admin/admin.article.controller';
import { BannerAreasSchema } from './schemata/banner_areas.schema';
import { BannerItemsSchema } from './schemata/banner_items.schema';
import { SlackAlarmService } from './lib/slack/alarm.service';
import { FeedbacksSchema } from './schemata/feedbacks.schema';
import { FeedbackDAO } from './dao/feedback/feedback.dao';
import { FeedbackController } from './controller/feedback/feedback.controller';
import { PushService } from './lib/push/push.service';
import { PushController } from './controller/push/push.controller';
import { AdminStatisticsFeedbackController } from './controller/admin/statistics/feedback/admin.statistics.feedback.controller';
import { BotRefugeArticleController } from './controller/entertain-bot/refuge-article/bot-refuge-article.controller';
import { SocialAcccountsSchema } from './schemata/social_accounts.schema';
import { GameCiderController } from './controller/game/cider/game.cider.controller';
import { BotGameController } from './controller/entertain-bot/game/bot-game.controller';
import { GamesSchema } from './schemata/games.schema';
import { GameEvaluationsSchema } from './schemata/game_evaluations.schema';
import { GameDAO } from './dao/game/game.dao';
import { GameController } from './controller/game/game.controller';
import { GameRunnerController } from './controller/game/runner/game.runner.controller';
import { BannerDAO } from './dao/banner/banner.dao';
import { AdminBannerController } from './controller/admin/admin.banner.controller';
import { BannerController } from './controller/banner/banner.controller';
import { PodcastsSchema } from './schemata/podcasts.schema';
import { PodcastDAO } from './dao/podcast/podcast.dao';
import { PodcastController } from './controller/podcast/podcast.controller';
import { BotRefugesController } from './controller/entertain-bot/refuges/bot-refuges.controller';
import { BotRefugeDetailController } from './controller/entertain-bot/refuge-detail/bot-refuge-detail.controller';
import { BotAboutController } from './controller/entertain-bot/about/bot-about.controller';
import { UserGameDatasSchema } from './schemata/user_game_datas.schema';
import { GameDefenceController } from './controller/game/defence/game.defence.controller';
import { RankingDefenceGameSchema } from './schemata/ranking_defence_game.schema';
import { HaewoosoArticleCommentsSchema } from './schemata/haewooso_article_comments.schema';
import { HaewoosoArticlesSchema } from './schemata/haewooso_articles.schema';
import { HaewoosoDAO } from './dao/haewooso/haewooso.dao';
import { HaewoosoController } from './controller/haewooso/haewooso.controller';
import { HaewoosoScheduler } from './lib/schedule/haewooso.scheduler';
import { ValidUserCheckerService } from './lib/auth/valid-user.checker.service';
import { BotHaewoosoController } from './controller/entertain-bot/haewooso/bot-haewooso.controller';
import { GoogleAnalyticsAPIservice } from './lib/google/google.analytics.api.service';
import { GoogleAPIScheduler } from './lib/schedule/google-api.scheduler';
import { WidgetController } from './controller/widget/widget.controller';
import { VendingMachineItemHashTagsSchema } from './schemata/vending_machine_item_hash_tags.schema';
import { VendingMachineItemPagesSchema } from './schemata/vending_machine_item_pages.schema';
import { VendingMachineItemsSchema } from './schemata/vending_machine_items.schema';
import { HashTagsSchema } from './schemata/hash_tags.schema';
import { VendingMachineDAO } from './dao/vending_machine/vending_machine.dao';
import { VendingMachineController } from './controller/vending_machine/vending_machine.controller';
import { AdminVendingMachineController } from './controller/admin/admin.vending_machine.controller';
import { BotNoticeController } from './controller/entertain-bot/notice/bot-notice.controller';
import { VendingMachineItemCommentsSchema } from './schemata/vending_machine_item_comments.schema';
import { BotVendingMachineController } from './controller/entertain-bot/vending_machine/bot-vending_machine.controller';






// import { GraphEdgesSchema as MongoGraphEdgesSchema } from './schemata/mongodb/graph_edges.schema';
// import { GraphObjectsSchema as MongoGraphObjectsSchema } from './schemata/mongodb/graph_objects.schema';
// import { MongoDBConnection } from './db/mongodb.connection';




export class AppCotainer extends Container {


    constructor() {
        super();
        AuthController
        RefugesController
        ArticleController
        UploadController
        NoticeController
        StaticPagesController
        FeedbackController
        PushController
        BannerController
        PodcastController
        HaewoosoController
        WidgetController
        VendingMachineController



        // admin
        AdminRefugesController
        AdminCategoiresController
        AdminReportController
        AdminNoticeController
        AdminStaticPagesController
        AdminUserController
        AdminArticleController
        AdminBannerController
        AdminVendingMachineController

        //game
        GameController
        GameCiderController
        GameRunnerController
        GameDefenceController

        //statistics/
        AdminStatisticsUserController
        AdminStatisticsFeedbackController



        // 봇이 긁어 갈 수있게끔 
        BotRefugeArticleController
        BotGameController
        BotRefugeDetailController
        BotRefugesController
        BotAboutController
        BotHaewoosoController
        BotNoticeController
        BotVendingMachineController

        this.bindComponentsInSingleton([
            //db
            MysqlConnection,
            // MongoDBConnection,

            //lib 
            AuthService,
            MailerService,
            TokenGenerator,
            AWSservice,
            SlackAlarmService,
            PushService,
            ValidUserCheckerService,
            GoogleAnalyticsAPIservice,

            // lib=>schedule
            HaewoosoScheduler,
            GoogleAPIScheduler,






            // dao 
            RefugesDAO,
            UsersDAO,
            ArticleDAO,
            GraphDAO,
            CategoryDAO,
            NoticeDAO,
            StaticPagesDAO,
            FeedbackDAO,
            GameDAO,
            BannerDAO,
            PodcastDAO,
            HaewoosoDAO,
            VendingMachineDAO,


            // schemata 
            RefugesSchema,
            RefugeArticleCommentsSchema,
            RefugeArticlesSchema,
            AdministratorsSchema,
            CategoriesSchema,
            UserProfilesSchema,
            UsersSchema,
            GraphEdgesSchema,
            GraphObjectsSchema,
            RefugeRequestsSchema,
            NoticesSchema,
            StaticPagesSchema,
            BannerAreasSchema,
            BannerItemsSchema,
            FeedbacksSchema,
            SocialAcccountsSchema,
            GamesSchema,
            GameEvaluationsSchema,
            PodcastsSchema,
            UserGameDatasSchema,
            RankingDefenceGameSchema,
            HaewoosoArticleCommentsSchema,
            HaewoosoArticlesSchema,
            VendingMachineItemHashTagsSchema,
            VendingMachineItemPagesSchema,
            VendingMachineItemsSchema,
            VendingMachineItemCommentsSchema,
            HashTagsSchema


            // mongo schemata
            // MongoGraphEdgesSchema,
            // MongoGraphObjectsSchema
        ])


    }


    private bindComponentsInSingleton(components: any[]) {
        components.forEach((component) => {
            this.bind((component.sym)).to(component).inSingletonScope()
        })
    }

}