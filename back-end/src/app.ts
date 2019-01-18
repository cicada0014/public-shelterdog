import 'reflect-metadata';
import * as express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import morgan from 'morgan';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { AppCotainer } from './app.container';
import { AuthService } from './lib/auth/auth';
import { MailerService } from './lib/mailer/mailer.service';
import { MongoDBConnection } from './db/mongodb.connection';
import { AWSservice } from './lib/aws/aws.service';
import { HaewoosoScheduler } from './lib/schedule/haewooso.scheduler';
import { GoogleAnalyticsAPIservice } from './lib/google/google.analytics.api.service';
import { GoogleAPIScheduler } from './lib/schedule/google-api.scheduler';
const fs = require('fs')

if (process.env.NODE_ENV == 'local') {
    const dotenv = require('dotenv')
    const envConfig = dotenv.parse(fs.readFileSync('.env'))
    for (var k in envConfig) {
        process.env[k] = envConfig[k]
    }
}





export class App {

    public app: express.Application;
    private appContainer: AppCotainer
    private server: InversifyExpressServer;
    constructor() {
        this.serverInit();
    }


    serverInit() {
        this.appContainer = new AppCotainer();
        this.server = new InversifyExpressServer(this.appContainer, null);
        this.server.setConfig((app) => {
            this.onMountingMiddleWare(app);
        });
        this.server.setErrorConfig((app) => {
            process.on('uncaughtException', (err) => {
                console.error(err)
            })
            process.on('unhandledRejection', (err) => {
                console.error(err)
            })
        })
        this.app = this.server.build();
        // 서버 빌드를 하게 되면 컨트롤러 라우트 정보가 매칭되므로 이 이후 라우트를 작성하려면 이 다음 시점에서 앱에 등록되어야 한다.
        this.app.get('*', (req, res, next) => {
            if (req.header('x-entertain-bot') == '1') {
                res.send(`
                <!DOCTYPE html>
                <html>
                    <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no">
                    <title>Shelter Dog(쉘터 독)</title>
                    <meta name="keywords" content="커뮤니티">
                    <meta name="description" content="어서오세요! 싫어하는 것에 대하여 소통하는 커뮤니티입니다.">
                        <meta property="og:title" content="Shelter Dog(쉘터 독)">
                        <meta property="og:description" content="싫어하는 것에 대하여 소통하는 커뮤니티! 지금 마음속에 싫어하는 게 있다면 들어오세요!">
                        <meta property="og:image" content="${'https://s3.ap-northeast-2.amazonaws.com/article.images/0c/94/93/5d/4c/48/d9/a9/55/d9/c6/54/d0/f3/84/8f'}">
                    </head>
                    <body>
                        싫어하는 것에 대하여 소통하는 커뮤니티!
                    </body>
                
                </html>`)
                return
            }
            next()
        })

        this.app.use('*', (req, res, next) => {
            res.redirect('/404')
        })



        this.app.listen(process.env.PORT || 3000, () => {
            console.log('server start port : ' + (process.env.PORT || 3000))
        })
    }
    onMountingMiddleWare(app: express.Application) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(cookieParser(process.env.SESSION_SECRET));
        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24
            }
        }));





        app.use(helmet())

        this.appContainer.get<AuthService>(AuthService.sym).init(app);
        this.appContainer.get<MailerService>(MailerService.sym);


        this.appContainer.get<HaewoosoScheduler>(HaewoosoScheduler.sym).init();

        if (process.env.NODE_ENV == 'prod') {
            this.appContainer.get<GoogleAPIScheduler>(GoogleAPIScheduler.sym).init();
        }


        this.appContainer.get<AWSservice>(AWSservice.sym).init();


        app.use(morgan('combined'));
    }

    static bootstrap() {
        return new App();
    }
}


App.bootstrap();