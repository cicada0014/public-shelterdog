import { controller, httpGet, httpPatch, httpPost, request, response, next, httpDelete } from "inversify-express-utils";
import { Response, NextFunction } from 'express'
import { inject } from "inversify";
import { ArticleDAO } from "../../dao/article/article.dao";
import { BaseRequest, GRAPH_OBJECT_TYPE_COMMENT, GRAPH_OBJECT_TYPE_ARTICLE } from "../../types/types";
import passport from 'passport';
import { GraphDAO } from "../../dao/graph/graph.dao";
import { TokenGenerator } from "../../lib/auth/token.generator";
import { SlackAlarmService } from "../../lib/slack/alarm.service";
import { UsersDAO } from "../../dao/user/users.dao";
import moment from 'moment';
import { ValidUserCheckerService } from "../../lib/auth/valid-user.checker.service";

@controller('/api/article')
export class ArticleController {
    constructor(
        @inject(ArticleDAO.sym) private articleDAO: ArticleDAO,
        @inject(GraphDAO.sym) private graphDAO: GraphDAO,
        @inject(TokenGenerator.sym) private tokenGenerator: TokenGenerator,
        @inject(SlackAlarmService.sym) private slackAlarmService: SlackAlarmService,
        @inject(UsersDAO.sym) private userDAO: UsersDAO,
        @inject(ValidUserCheckerService.sym) private validUserCheckerService: ValidUserCheckerService,


    ) {



    }


    @httpGet('/bests')
    public async getBestArticles(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        if (!req.query.first || !req.query.rows) {
            res.status(400).send({ message: 'bad request' })
            return
        }

        return this.articleDAO
            .getBestArticlesInGlobal(req.query.first, req.query.rows)
            .then(r => {
                console.log()
                let _result = r.result[0].map(article => {
                    if (article.anonymous) {
                        delete article.user_id;
                        delete article.nickname;
                    }
                    return article
                })
                res.send({
                    result: _result,
                    totalRecords: r.totalCount[0][0].value
                })
            }).catch(e => {
                console.error(e)
                res.status(400).send(e)
            })
    }

    @httpGet('/my', passport.authenticate('jwt', { session: false }))
    public async getMyArticles(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        let totalRecords = await this.articleDAO.getMyArticlesCount(req.userData.id)
        return this.articleDAO
            .getMyArticles(req.userData.id, req.query.rows, req.query.first)
            .then(r => {
                res.send({
                    totalRecords,
                    items: r
                })
            }).catch(e => {
                console.error(e)
                res.status(400).send(e)
            })
    }




    @httpGet('/:id')
    public async getArticle(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        let token = null;
        if (req && req.cookies) token = req.cookies['token'];
        if (token) {
            try {
                let decoded: any = await this.tokenGenerator.loginTokenVerify(token);
                const isUserEmpathy = await this.graphDAO.checkUserEmpathizeArticle(decoded.id, req.params.id)
                return this.getArticlePrevious(req, res, decoded.id, isUserEmpathy, decoded.Administrator);
            } catch (e) {
                console.log(e);
                return this.getArticlePrevious(req, res);
            }
        } else {
            return this.getArticlePrevious(req, res);
        }
    }


    getArticlePrevious = async (req, res, user_id?, isUserEmpathy?: boolean | number, isAdmin?) => {
        let empathyCount = await this.graphDAO.getEmpathyCountOfArticle(req.params.id);
        return this.articleDAO
            .getArticle(req.params.id)
            .then(r => {
                if (!r) {
                    res.status(404).send('not found article')
                    return
                }
                if (r.status_code && r.status_code < 999) {
                    res.status(406).send({ status_code: r.status_code })
                    return
                }

                if (req.header("x-hit-read") == 'yes') {
                    this.articleDAO.updateHitOfArticle(req.params.id);
                }
                (r as any).dataValues.empathyCount = empathyCount.count;
                (r as any).dataValues.isUserEmpathy = isUserEmpathy;
                if (user_id && user_id == r.user_id) {
                    (r as any).dataValues.isMe = true;
                }
                if (isAdmin) {
                    (r as any).dataValues.isAdmin = true;
                }
                if (r.anonymous) {
                    delete r.UserProfile
                }


                res.send(r)
            }).catch(e => {
                console.error(e)
                res.status(400).send(e)
            })
    }





    @httpPost('/comment/tocomment', passport.authenticate('jwt', { session: false }))
    public async insertArticleCommentToComment(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        req.body.user_id = req.userData.id;

        let user = await this.userDAO.findById(req.body.user_id);
        if (!user) {
            res.status(400).send({ message: 'not founded user' })
            return
        }

        if (user) {
            if (user.status == 'BAN') {
                res.status(400).send({ message: 'banned user' })
                return

            }
            if (user.status != 'ACT') {
                res.status(400).send({ message: 'not good' })
                return
            }

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





        return this.articleDAO
            .insertArticleComment(req.body)
            .then((result) => {
                // this.graphDAO.createGraphObject(result.id, GRAPH_OBJECT_TYPE_COMMENT);
                res.send(result)
            })
            .catch((error) => {
                console.error(error)
                res.status(400).send(error)
            })
    }

    @httpPost('/comment', passport.authenticate('jwt', { session: false }))
    public async insertArticleComment(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        req.body.user_id = req.userData.id;

        let user = await this.userDAO.findById(req.body.user_id);
        if (!user) {
            res.status(400).send({ message: 'not founded user' })
            return
        }

        if (user) {
            if (user.status == 'BAN') {
                res.status(400).send({ message: 'banned user' })
                return

            }
            if (user.status != 'ACT') {
                res.status(400).send({ message: 'not good' })
                return
            }
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





        if (req.header('x-comment-empathy') == 'true' ? true : false) {
            try {

                await this.graphDAO.createEmpathyGraph(req.userData.id, req.body.refuge_article_id, GRAPH_OBJECT_TYPE_ARTICLE);
            } catch (e) {
                console.error(e)
            }
        }
        return this.articleDAO
            .insertArticleComment(req.body)
            .then((result) => {
                // this.graphDAO.createGraphObject(result.id, GRAPH_OBJECT_TYPE_COMMENT);
                if (!req.userData.Administrator) {
                    this.slackAlarmService.sendPostCommentAlarm(req.userData.id, result.refuge_article_id);
                }
                res.send(result)
            })
            .catch((error) => {
                console.error(error)
                res.status(400).send(error)
            })
    }

    @httpPost('/:article_id/empathy', passport.authenticate('jwt', { session: false }))
    public async updateArticleEmpathy(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        const articleId = req.params.article_id;
        return this.graphDAO
            .createEmpathyGraph(req.userData.id, articleId, GRAPH_OBJECT_TYPE_ARTICLE)
            .then((r) => {
                res.send(true)
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

    @httpPost('/:article_id/report', passport.authenticate('jwt', { session: false }))
    public async createArticleReport(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        const articleId = req.params.article_id;
        return this.graphDAO
            .createReportGraph(req.userData.id, articleId, GRAPH_OBJECT_TYPE_ARTICLE)
            .then((r) => {

                if (!req.userData.Administrator) {
                    this.slackAlarmService.sendReport(req.userData.id, articleId, 'article')
                }

                res.send(true)
            })
            .catch(e => {
                console.log(e.message)
                res.status(400).send(e)
            })
    }

    @httpPost('/comment/:comment_id/report', passport.authenticate('jwt', { session: false }))
    public async createCommentReport(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        const commentId = req.params.comment_id;
        return this.graphDAO
            .createReportGraph(req.userData.id, commentId, GRAPH_OBJECT_TYPE_COMMENT)
            .then((r) => {

                if (!req.userData.Administrator) {
                    this.slackAlarmService.sendReport(req.userData.id, commentId, 'comment')
                }

                res.send(true)
            })
            .catch(e => {
                console.log(e.message)
                res.status(400).send(e)
            })
    }






    @httpPatch('/comment/:comment_id', passport.authenticate('jwt', { session: false }))
    public async updateCommentReport(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        const commentId = req.params.comment_id;

        let result = await this.validUserCheckerService.mineCheck(commentId, 'comment', req, res);
        if (!result) {
            return
        }

        return this.articleDAO.updateArticleComment(commentId, req.body.content, req.body.anonymous)
            .then((r) => {
                res.send(true)
            })
            .catch(e => {
                console.log(e.message)
                res.status(400).send(e)
            })
    }



    @httpDelete('/comment/:comment_id', passport.authenticate('jwt', { session: false }))
    public async deleteCommentReport(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        const commentId = req.params.comment_id;

        let result = await this.validUserCheckerService.mineCheck(commentId, 'comment', req, res);
        if (!result) {
            return
        }

        return this.articleDAO.deleteArticleComment(commentId, req.header('x-comment-parent') == 'true')
            .then((r) => {
                res.send(true)
            })
            .catch(e => {
                console.log(e.message)
                res.status(400).send(e)
            })
    }






    @httpPost('/', passport.authenticate('jwt', { session: false }))
    public async insertArticle(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        req.body.user_id = req.userData.id;
        let user = await this.userDAO.findById(req.body.user_id);
        if (!user) {
            res.status(400).send({ message: 'not founded user' })
            return
        }
        if (user) {
            if (user.status == 'BAN') {
                res.status(400).send({ message: 'banned user' })
                return

            }
            if (user.status != 'ACT') {
                res.status(400).send({ message: 'not good' })
                return
            }
        }

        if (!req.userData.Administrator) {
            const latest = await this.articleDAO.getLatestArticleByUserId(req.userData.id);
            if (latest) {
                const nowTime = moment().utc(false).format('x')
                const latestTime = moment(latest.created_at).utc(false).format('x')
                if (parseInt(nowTime) - parseInt(latestTime) < 1000 * 60) {
                    return res.status(400).send({ message: 'Available in 1 minute' })
                }
            }
        }

        return this.articleDAO
            .insertArticle(req.body)
            .then((result) => {
                // this.graphDAO.createGraphObject(result.id, GRAPH_OBJECT_TYPE_ARTICLE);
                if (!req.userData.Administrator) {
                    this.slackAlarmService.sendPostAritlceAlarm(req.userData.id, result.id);
                }
                res.send(result)
            })
            .catch((error) => {
                console.error(error)
                res.status(400).send(error)
            })




    }

    @httpPatch('/', passport.authenticate('jwt', { session: false }))
    public async updateArticle(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        let result = await this.validUserCheckerService.mineCheck(req.body.id, 'article', req, res);
        if (!result) {
            return
        }


        return this.articleDAO
            .updateArticle(req.body)
            .then((result) => {
                res.send(result)
            })
            .catch((error) => {
                console.error(error)
                res.status(400).send(error)
            })
    }


    @httpDelete('/:article_id', passport.authenticate('jwt', { session: false }), (req: BaseRequest, res, next) => {
        next();
    })
    public async deleteArticle(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        const articleId = req.params.article_id;

        let result = await this.validUserCheckerService.mineCheck(articleId, 'article', req, res);
        if (!result) {
            return
        }


        return this.articleDAO
            .deleteArticle(articleId)
            .then((result) => {
                res.send(result)
            })
            .catch((error) => {
                console.error(error)
                res.status(400).send(error)
            })
    }







}