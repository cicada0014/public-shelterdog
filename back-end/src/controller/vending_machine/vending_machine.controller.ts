import { controller, httpGet, httpPatch, httpPost, request, response, next, httpDelete } from "inversify-express-utils";
import passport from 'passport';
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest, GRAPH_OBJECT_TYPE_VENDING_MACHINE_ITEM, GRAPH_OBJECT_TYPE_VENDING_MACHINE_ITEM_COMMENT } from "../../types/types";
import { BannerDAO } from "../../dao/banner/banner.dao";
import { VendingMachineDAO } from "../../dao/vending_machine/vending_machine.dao";
import { GraphDAO } from "../../dao/graph/graph.dao";
import { ValidUserCheckerService } from "../../lib/auth/valid-user.checker.service";
import { TokenGenerator } from "../../lib/auth/token.generator";
import { SlackAlarmService } from "../../lib/slack/alarm.service";


@controller('/api/vendingmachine')
export class VendingMachineController {
    constructor(
        @inject(VendingMachineDAO.sym) private vendingMachineDAO: VendingMachineDAO,
        @inject(GraphDAO.sym) private graphDAO: GraphDAO,
        @inject(ValidUserCheckerService.sym) private validUserCheckerService: ValidUserCheckerService,
        @inject(TokenGenerator.sym) private tokenGenerator: TokenGenerator,
        @inject(SlackAlarmService.sym) private slackAlarmService: SlackAlarmService,


    ) {
    }






    @httpGet('/item/:item_id')
    public async getItem(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        try {
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

            if (req.header("x-hit-read") == 'yes') {
                await this.vendingMachineDAO.updateItemHit(req.params.item_id);
            }

            return this.vendingMachineDAO
                .getItem(req.params.item_id, user_id)
                .then(r => {
                    res.send(r)
                })
                .catch(e => {
                    res.status(500).send(e)
                    console.error(e)
                })


        } catch (e) {
            res.status(500).send(e)
            console.log(e)
        }
    }


    @httpPost('/like/:item_id', passport.authenticate('jwt', { session: false }))
    public async likeThisItem(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        try {
            return this.graphDAO
                .createEmpathyGraph(req.userData.id, req.params.item_id, GRAPH_OBJECT_TYPE_VENDING_MACHINE_ITEM)
                .then((r) => {
                    res.send(r)
                })
                .catch(e => {
                    console.log(e.message)
                    console.log(e.name)
                    res.status(400).send(e)
                })


        } catch (e) {
            res.status(500).send(e)
            console.log(e)
        }
    }
    @httpDelete('/like/:empathy_edge_id', passport.authenticate('jwt', { session: false }))
    public async dislikeThisItem(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        try {
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


        } catch (e) {
            res.status(500).send(e)
            console.log(e)
        }
    }



    @httpPost('/comment/:comment_id/report', passport.authenticate('jwt', { session: false }))
    public async createCommentReport(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        const commentId = req.params.comment_id;
        return this.graphDAO
            .createReportGraph(req.userData.id, commentId, GRAPH_OBJECT_TYPE_VENDING_MACHINE_ITEM_COMMENT)
            .then((r) => {
                if (!req.userData.Administrator) {
                    this.slackAlarmService.sendReport(req.userData.id, commentId, 'vending_machine_comment')
                }
                res.send(true)
            })

            .catch(e => {
                console.log(e.message)
                res.status(400).send(e)
            })
    }
    @httpPost('/comment/tocomment', passport.authenticate('jwt', { session: false }))
    public async insertArticleCommentToComment(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        req.body.user_id = req.userData.id;

        let result = await this.validUserCheckerService.validUserCheck(req.userData.id, res);
        if (!result) {
            return
        }


        return this.vendingMachineDAO
            .insertItemComment(req.body)
            .then((result) => {
                // this.graphDAO.createGraphObject(result.id, GRAPH_OBJECT_TYPE_COMMENT);
                if (!req.userData.Administrator) {
                    this.slackAlarmService.sendPostCommentAlarmForVendingMachine(req.userData.id, result.item_id);
                }
                res.send(result)
            })
            .catch((error) => {
                console.error(error)
                res.status(400).send(error)
            })
    }







    @httpDelete('/comment/:comment_id', passport.authenticate('jwt', { session: false }))
    public async deleteCommentReport(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        const commentId = req.params.comment_id;

        let result = await this.validUserCheckerService.mineCheck(commentId, 'comment', req, res);
        if (!result) {
            return
        }

        return this.vendingMachineDAO.deleteArticleComment(commentId, req.header('x-comment-parent') == 'true')
            .then((r) => {
                res.send(true)
            })
            .catch(e => {
                console.log(e.message)
                res.status(400).send(e)
            })
    }



    @httpPost('/comment', passport.authenticate('jwt', { session: false }))
    public async insertItemComment(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {

        try {
            req.body.user_id = req.userData.id;
            let isValid = await this.validUserCheckerService.validUserCheck(req.body.user_id, res);
            if (!isValid) {
                return
            }
            return this.vendingMachineDAO
                .insertItemComment(req.body)
                .then((result) => {
                    // this.graphDAO.createGraphObject(result.id, GRAPH_OBJECT_TYPE_COMMENT);
                    if (!req.userData.Administrator) {
                        this.slackAlarmService.sendPostCommentAlarmForVendingMachine(req.userData.id, result.item_id);
                    }
                    res.send(result)
                })
                .catch((error) => {
                    console.error(error)
                    res.status(400).send(error)
                })
        } catch (e) {
            console.error(e);
            res.status(500).send(e)
        }









        // if (req.header('x-comment-empathy') == 'true' ? true : false) {
        //     try {

        //         await this.graphDAO.createEmpathyGraph(req.userData.id, req.body.refuge_article_id, GRAPH_OBJECT_TYPE_ARTICLE);
        //     } catch (e) {
        //         console.error(e)
        //     }
        // }

    }











    @httpPatch('/comment/:comment_id', passport.authenticate('jwt', { session: false }))
    public async updateCommentReport(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        const commentId = req.params.comment_id;
        let result = await this.validUserCheckerService.mineCheck(commentId, 'comment', req, res);
        if (!result) {
            return
        }
        return this.vendingMachineDAO.updateItemComment(commentId, req.body.content)
            .then((r) => {
                res.send(true)
            })
            .catch(e => {
                console.log(e.message)
                res.status(400).send(e)
            })
    }



    @httpGet('/items/:category_id')
    public async getList(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        try {
            let targetItems;

            if (req.query.tag_id != 'no') {
                targetItems = await this.vendingMachineDAO.getTargetItemsWithTagClass(req.query.tag_id)
            }
            let totalRecords = await this.vendingMachineDAO.getTotalCountByCategory(req.params.category_id, targetItems);
            return this.vendingMachineDAO
                .getListByCategory(req.params.category_id, req.query.limit, req.query.offset, targetItems)
                .then(r => {
                    res.send({
                        items: r,
                        totalRecords
                    })
                })
                .catch(e => {
                    res.status(500).send(e)
                    console.error(e);
                })
        } catch (e) {
            res.status(500).send(e)
            console.log(e)
        }
    }


    @httpGet('/hashtag/list/:category_id')
    public async getHashTagListByCategory(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {

        return this.vendingMachineDAO
            .getHashTagListByCategory(req.params.category_id, req.query.limit, req.query.offset)
            .then(r => {
                res.send(r)
            })
            .catch(e => {
                res.status(500).send(e);
                console.error(e)
            })


    }


    @httpGet('/recommendation/list')
    public async getRecommendationList(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        return this.vendingMachineDAO
            .getRecommendatonList(req.query.item_id, req.query.tag_id, req.query.mobile ? 2 : 3)
            .then(async r => {

                let _originLimit = req.query.mobile ? 2 : 3;

                if (r.length < _originLimit) {
                    let _exclueded = r.map(item => item.id)
                    let supplements = await this.vendingMachineDAO
                        .getRecommendatonList(req.query.item_id, req.query.tag_id_two, _originLimit - r.length, _exclueded);
                    r = r.concat(supplements);

                }


                res.send(r)
            })
            .catch(e => {
                res.status(500).send(e);
                console.error(e)
            })


    }









}