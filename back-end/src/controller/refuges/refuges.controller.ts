import { controller, httpGet, httpPost, request, response, next } from "inversify-express-utils";
import passport from 'passport';
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { RefugesDAO } from "../../dao/refuges/refuges.dao";
import { BaseRequest } from "../../types/types";
import { GraphDAO } from "../../dao/graph/graph.dao";
import moment from 'moment';
import { SlackAlarmService } from "../../lib/slack/alarm.service";
import { UsersDAO } from "../../dao/user/users.dao";


@controller('/api/refuges')
export class RefugesController {
    constructor(
        @inject(RefugesDAO.sym) private refugesDAO: RefugesDAO,
        @inject(GraphDAO.sym) private graphDAO: GraphDAO,
        @inject(UsersDAO.sym) private userDAO: UsersDAO,
        @inject(SlackAlarmService.sym) private slackAlarmService: SlackAlarmService,

    ) {



    }
    @httpGet('/list')
    public async getList(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        return this.refugesDAO
            .getList()
            .then((result) => {
                res.send(result)
            })
            .catch((error) => {
                console.error(error)
                res.status(400).send(error)
            })
    }



    @httpGet('/categories/list')
    public async getListByCategory(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        return this.refugesDAO
            .getListByCategory()
            .then((result) => {
                res.send(result)
            })
            .catch((error) => {
                console.error(error)
                res.status(400).send(error)
            })
    }


    @httpPost('/request', passport.authenticate('jwt', { session: false }))
    public async createRequest(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {


        let user = await this.userDAO.findById(req.userData.id);
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



        const latestRequest = await this.refugesDAO.getRequestByUserIdOne(req.userData.id);
        if (latestRequest) {
            const nowTime = moment().utc(false).format('x')
            const latestTime = moment(latestRequest.created_at).utc(false).format('x')
            if (parseInt(nowTime) - parseInt(latestTime) < 1000 * 60 * 60 * 24) {
                return res.status(400).send({ message: 'Available in 24 hours' })
            }
        }

        return this.refugesDAO
            .createRequest(req.userData.id, req.body.content, 'PRE')
            .then((result) => {

                if (!req.userData.Administrator) {
                    this.slackAlarmService.sendPostRequestAlarm(req.userData.id, req.body.content);
                }
                res.send(result)
            })
            .catch((error) => {
                console.error(error)
                res.status(400).send(error)
            })
    }
    @httpGet('/requests')
    public async getRequests(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        const totalRecords = await this.refugesDAO.getTotalRequestCount()
        return this.refugesDAO
            .getRequests(req.query.first, req.query.rows)
            .then((requests) => {
                res.send(
                    {
                        requests,
                        totalRecords
                    })
            })
            .catch((error) => {
                console.error(error)
                res.status(400).send(error)
            })
    }

    @httpPost('/request/:request_id/empathy', passport.authenticate('jwt', { session: false }))
    public async updateRequestEmpathy(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        const requestId = req.params.request_id;
        return this.graphDAO
            .createRequestEmpathyGraph(req.userData.id, requestId)
            .then((r) => {
                res.send(true)
            })
            .catch(e => {
                console.log(e.message)
                console.log(e.name)
                res.status(400).send(e)
            })
    }




    @httpGet('/popular')
    public async getPopularRefuges(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        return this.refugesDAO
            .getBestArticlesInPopularRefuges(req.query.first, req.query.rows)
            .then(r => {
                res.send(r)
            }).catch(e => {
                console.error(e)
                res.status(400).send(e)
            })
    }




    @httpGet('/:id')
    public async getRefuge(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {

        try {
            let result = await this.refugesDAO.getRefuge(req.params.id);
            if (result) {
                if (req.query.popular && req.query.popular == 'true') {
                    let BestRefugeArticles = await this.refugesDAO.getBestArticlesOfRefuge(req.params.id, req.query.first, req.query.rows);
                    let _BestRefugeArticles = BestRefugeArticles[0].map(article => {
                        if (article.anonymous) {
                            delete article.user_id;
                            delete article.nickname;
                        }
                        return article
                    })
                    result.setDataValue('BestRefugeArticles', _BestRefugeArticles);
                } else {
                    result.setDataValue('totalRecords', result.RefugeArticles.length);
                    let RefugeArticles = await this.refugesDAO.getArticlesOfRefuge(req.params.id, req.query.first, req.query.rows)
                    RefugeArticles = RefugeArticles.map(article => {
                        if (article.anonymous) {
                            article.setDataValue('UserProfile', null);
                        }
                        return article
                    })



                    let noticeArticles = await this.refugesDAO.getNoticeOfRefuge(req.params.id)
                    // noticeArticles = noticeArticles.map((n: any) => { n.notice = true; return n });
                    result.setDataValue('noticeArticles', noticeArticles);

                    result.setDataValue('RefugeArticles', RefugeArticles);
                }



                res.send(result);
            } else {

                res.status(400).send({ message: 'deactive refuge' })
            }
        } catch (e) {
            console.error(e)
            res.status(400).send(e)
        }



    }



}