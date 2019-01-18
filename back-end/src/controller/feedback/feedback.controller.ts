import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import passport from 'passport';
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../types/types";
import { FeedbackDAO } from "../../dao/feedback/feedback.dao";


@controller('/api/feedback')
export class FeedbackController {
    constructor(
        @inject(FeedbackDAO.sym) private feedbackDAO: FeedbackDAO
    ) {
    }
    @httpPost('/')
    public async createFeedback(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        let data = req.body;
        return this.feedbackDAO
            .createFeedback(data)
            .then(r => {
                res.send(r)
            })
            .catch(e => {
                console.log(e);
                res.status(400).send(e)
            })
    }
}