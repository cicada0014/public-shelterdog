import { controller, httpGet, httpPatch, httpPost, request, response, next, httpDelete } from "inversify-express-utils";
import passport from 'passport';
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest, GRAPH_OBJECT_TYPE_ARTICLE, GRAPH_OBJECT_TYPE_HAEWOOSO_ARTICLE } from "../../types/types";
import { SlackAlarmService } from "../../lib/slack/alarm.service";
import { GameDAO } from "../../dao/game/game.dao";
import { HaewoosoDAO } from "../../dao/haewooso/haewooso.dao";
import { UsersDAO } from "../../dao/user/users.dao";
import { ValidUserCheckerService } from "../../lib/auth/valid-user.checker.service";
import { GraphDAO } from "../../dao/graph/graph.dao";
import { TokenGenerator } from "../../lib/auth/token.generator";


@controller('/api/haewooso')
export class HaewoosoController {
    constructor(
        @inject(SlackAlarmService.sym) private slackAlarmService: SlackAlarmService,
        @inject(ValidUserCheckerService.sym) private validUserCheckerService: ValidUserCheckerService,
        @inject(HaewoosoDAO.sym) private haewoosoDAO: HaewoosoDAO,
        @inject(UsersDAO.sym) private userDAO: UsersDAO,
        @inject(TokenGenerator.sym) private tokenGenerator: TokenGenerator,
        @inject(GraphDAO.sym) private graphDAO: GraphDAO
    ) {
    }
    @httpPost('/article', passport.authenticate('jwt', { session: false }))
    public async  postArticle(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        req.body.user_id = req.userData.id;
        let isValid = await this.validUserCheckerService.validUserCheck(req.body.user_id, res);
        if (!isValid) {
            return
        }

        // if (!req.userData.Administrator) {
        //     const latest = await this.articleDAO.getLatestArticleByUserId(req.userData.id);
        //     if (latest) {
        //         const nowTime = moment().utc(false).format('x')
        //         const latestTime = moment(latest.created_at).utc(false).format('x')
        //         if (parseInt(nowTime) - parseInt(latestTime) < 1000 * 60) {
        //             return res.status(400).send({ message: 'Available in 1 minute' })
        //         }
        //     }
        // }

        return this.haewoosoDAO
            .insertArticle(req.body)
            .then((result) => {
                // this.graphDAO.createGraphObject(result.id, GRAPH_OBJECT_TYPE_ARTICLE);
                if (!req.userData.Administrator) {
                    this.slackAlarmService.sendHaewoosoAritlceAlarm(req.userData.id, result.id);
                }
                res.send(result)
            })
            .catch((error) => {
                console.error(error)
                res.status(400).send(error)
            })


    }
    @httpGet('/article/list')
    public async getArtcleList(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {

        let token = null;
        let user_id = null
        if (req && req.cookies) token = req.cookies['token'];
        if (token) {
            try {
                let decoded: any = await this.tokenGenerator.loginTokenVerify(token);
                user_id = decoded.id;
            } catch (e) {

            }
        }


        return this.haewoosoDAO
            .getArticles(req.query.rows, req.query.first, user_id)
            .then(r => {
                // r.forEach(article=>{
                //     article.isMe = article.user_id == user_id;
                // })
                res.send(r)
            })
            .catch(e => {
                console.log(e)
                res.status(500).send(e);
            })
    }




    @httpPost('/comment', passport.authenticate('jwt', { session: false }))
    public async insertArticleComment(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        req.body.user_id = req.userData.id;

        let isValid = await this.validUserCheckerService.validUserCheck(req.body.user_id, res);
        if (!isValid) {
            return
        }

        // if (!req.userData.Administrator) {
        //     const latest = await this.articleDAO.getLastestArticleCommentByUserId(req.userData.id);
        //     if (latest) {
        //         const nowTime = moment().utc(false).format('x')
        //         const latestTime = moment(latest.created_at).utc(false).format('x')
        //         if (parseInt(nowTime) - parseInt(latestTime) < 1000 * 120) {
        //             return res.status(400).send({ message: 'Available in 2 minute' })
        //         }
        //     }
        // }
        // if (req.header('x-comment-empathy') == 'true' ? true : false) {
        //     try {

        //         await this.graphDAO.createEmpathyGraph(req.userData.id, req.body.refuge_article_id);
        //     } catch (e) {
        //         console.error(e)
        //     }
        // }
        return this.haewoosoDAO
            .insertArticleComment(req.body)
            .then((result) => {
                // this.graphDAO.createGraphObject(result.id, GRAPH_OBJECT_TYPE_COMMENT);
                if (!req.userData.Administrator) {
                    this.slackAlarmService.sendHaewoosoPostCommentAlarm(req.userData.id, result.haewooso_article_id);
                }
                res.send(result)
            })
            .catch((error) => {
                console.error(error)
                res.status(400).send(error)
            })
    }



    // haewooso

    @httpPost('/:article_id/empathy', passport.authenticate('jwt', { session: false }))
    public async updateArticleEmpathy(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        const articleId = req.params.article_id;
        return this.graphDAO
            .createEmpathyGraph(req.userData.id, articleId, GRAPH_OBJECT_TYPE_HAEWOOSO_ARTICLE)
            .then((r) => {
                res.send(r)
            })
            .catch(e => {
                console.log(e.message)
                console.log(e.name)
                res.status(400).send(e)
            })
    }







    @httpDelete('/empathy/:empathy_edge_id', passport.authenticate('jwt', { session: false }))
    public async deleteArticleEmpathy(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        const empathyEdgeId = req.params.empathy_edge_id;
        let result = await this.validUserCheckerService.mineCheck(empathyEdgeId, 'empathy', req, res);
        if (!result) {
            return
        }
        return this.graphDAO
            .deleteEmpathyGraph(empathyEdgeId)
            .then((r) => {
                res.send(true)
            })
            .catch(e => {
                console.log(e.message)
                console.log(e.name)
                res.status(400).send(e)
            })
    }
    @httpDelete('/article/:article_id', passport.authenticate('jwt', { session: false }))
    public async deleteArticle(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {


        let result = await this.validUserCheckerService.mineCheck(req.params.article_id, 'haewooso', req, res);
        if (!result) {
            return
        }

        return this.haewoosoDAO
            .deleteArticle(req.params.article_id)
            .then((r) => {
                res.send(true)
            })
            .catch(e => {
                console.log(e.message)
                console.log(e.name)
                res.status(400).send(e)
            })
    }


    @httpDelete('/comment/:comment_id', passport.authenticate('jwt', { session: false }))
    public async deleteComment(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {



        return this.haewoosoDAO
            .deleteComment(req.params.comment_id)
            .then((r) => {
                res.send(true)
            })
            .catch(e => {
                console.log(e.message)
                console.log(e.name)
                res.status(400).send(e)
            })
    }




}