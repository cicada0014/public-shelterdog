import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import passport from 'passport';
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../../types/types";
import { SlackAlarmService } from "../../../lib/slack/alarm.service";
import { GameEvaluationsSchema } from "../../../schemata/game_evaluations.schema";
import { GameDAO } from "../../../dao/game/game.dao";
import { FeedbackDAO } from "../../../dao/feedback/feedback.dao";


@controller('/api/game/runner')
export class GameRunnerController {
    constructor(
        @inject(SlackAlarmService.sym) private slackService: SlackAlarmService,
        @inject(GameDAO.sym) private gameDAO: GameDAO,
        @inject(FeedbackDAO.sym) private feedbackDAO: FeedbackDAO,
    ) {
    }

    @httpPost('/try')
    public messageArchiveToSlack(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        let msg: { type, step, text, name }
            = {
            type: 'runner', step: req.body.count + '번째 도전', text: '', name: req.body.ip
        }
        this.slackService.sendCiderGameAlarm(msg)
        return

    }

    @httpPost('/ending')
    public async createRefuge(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {

        let { step, text } = req.body;
        let msg: { type, step, text, name }
            = {
            type: 'runner', step: 'ending', text: '', name: req.body.ip
        }
        this.slackService.sendCiderGameAlarm(msg)
        return
    }

    @httpGet('/endingcount')
    public async getEndingCount(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        return this.feedbackDAO
            .getRunnerGameEndingCount()
            .then(r => { res.send({ count: r }) })
            .catch(e => res.status(500).send(e))

    }


    @httpPost('/survey')
    public async survey(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {

        return this.feedbackDAO
            .createFeedback({
                type: 'g-runner',
                data: req.body.data
            })
            .then(r => {
                res.send({ message: 'ok' })
            })
            .catch(e => {
                res.status(500).send(e)
            })


    }
}