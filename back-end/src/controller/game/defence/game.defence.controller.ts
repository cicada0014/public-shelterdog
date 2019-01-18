import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import passport from 'passport';
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../../types/types";
import { SlackAlarmService } from "../../../lib/slack/alarm.service";
import { GameEvaluationsSchema } from "../../../schemata/game_evaluations.schema";
import { GameDAO } from "../../../dao/game/game.dao";
import { FeedbackDAO } from "../../../dao/feedback/feedback.dao";


@controller('/api/game/defence')
export class GameDefenceController {
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
            type: 'defence', step: `웨이브-${req.body.waveStep} / ${req.body.count} 번째 시도`,
            text: `${req.body.data.life} life / ${req.body.data.deposit} deposit / `,
            name: req.body.ip
        }
        this.slackService.sendCiderGameAlarm(msg)
        // this.feedbackDAO.createFeedback({ type: 'defencemap', data: JSON.stringify(req.body.data.map) })
        return

    }

    @httpPost('/ending')
    public async createRefuge(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {

        let { step, text } = req.body;
        let msg: { type, step, text, name }
            = {
            type: 'defence', step: 'ending', text: '', name: req.body.ip
        }
        this.slackService.sendCiderGameAlarm(msg)
        return
    }


    @httpGet('/ranking')
    public async getRankingList(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {

        // let { life, deposit } = req.body;
        return this.gameDAO
            .getRankingList()
            .then((r) => {
                res.send(r)
            })
            .catch(e => {
                console.error(e);
                res.status(500).send(e)
            })

    }


    @httpPost('/ranking', passport.authenticate('jwt', { session: false }))
    public async upsertRanking(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {

        // let { life, deposit } = req.body;
        req.body.user_id = req.userData.id;
        return this.gameDAO
            .upsertRankingDefenceGame(req.body)
            .then((r) => {
                console.log(r)
                if (r == 'tai') {
                    res.send({ message: 'tai' });
                    return
                } else if (r == 'life more') {
                    res.send({ message: 'life more' });
                    return
                } else if (r == 'deposit more') {
                    res.send({ message: 'deposit more' });
                    return
                } else {
                    res.send({ message: 'ok' });
                    return
                }
            })
            .catch(e => {
                console.error(e);
                res.status(500).send(e)
            })

    }



    @httpPost('/data', passport.authenticate('jwt', { session: false }))
    public async saveData(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        req.body.user_id = req.userData.id
        return this.gameDAO
            .saveUserData(req.body)
            .then(r => {
                res.send({ message: 'ok' })
            })
            .catch(e => {
                console.log(e)
                res.status(500).send(e)
            })
    }

    @httpGet('/data', passport.authenticate('jwt', { session: false }))
    public async loadData(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        return this.gameDAO
            .loadUserData(req.query.game_id, req.userData.id)
            .then(r => {
                res.send(r)
            })
            .catch(e => {
                console.log(e)
                res.status(500).send(e)
            })
    }

    @httpPatch('/data', passport.authenticate('jwt', { session: false }))
    public async updataData(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        return this.gameDAO
            .updateUserData(req.body)
            .then(r => {
                res.send({ message: 'ok' })
            })
            .catch(e => {
                console.log(e)
                res.status(500).send(e)
            })
    }


    @httpPost('/survey')
    public async survey(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        return this.feedbackDAO
            .createFeedback({
                type: 'g-defence',
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