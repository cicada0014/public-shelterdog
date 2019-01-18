import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../types/types";
import { NoticeDAO } from "../../dao/notice/notice.dao";
import { PushService } from "../../lib/push/push.service";


@controller('/api/push')
export class PushController {

    savedSub;

    constructor(
        @inject(PushService.sym) private pushService: PushService
    ) {
    }
    @httpPost('/subscription')
    public async subscribeThisSite(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        this.savedSub = req.body;

        return this.pushService
            .sendNotification(req.body)
            .then(r => {
                res.send(this.savedSub)
            })
            .catch(e => {
                console.log(e)
                res.status(400).send(e)
            })
    }








}