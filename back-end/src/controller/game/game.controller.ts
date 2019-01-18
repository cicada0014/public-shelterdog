import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import passport from 'passport';
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../types/types";
import { SlackAlarmService } from "../../lib/slack/alarm.service";
import { GameDAO } from "../../dao/game/game.dao";


@controller('/api/game')
export class GameController {
    constructor(
        @inject(SlackAlarmService.sym) private slackService: SlackAlarmService,
        @inject(GameDAO.sym) private gameDAO: GameDAO
    ) {
    }
    @httpPost('/evaluation')
    public async  postEvaluation(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        let { ip, content, nickname, game_id } = req.body
        let check = await this.gameDAO.checkPaperingUser(ip);
        console.log(check)
        if (check > 10) {
            res.status(400).send('papering')
            return
        }
        return this.gameDAO
            .insertEvaluaion(ip, content, nickname, game_id)
            .then(r => {
                res.send(r)
            })
            .catch(e => {
                console.log(e)
                res.status(500).send(e);
            })
    }
    @httpGet('/evaluation/list')
    public evaluationList(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        return this.gameDAO
            .getEvaluationList(req.query.game_id)
            .then(r => {
                res.send(r)
            })
            .catch(e => {
                console.log(e)
                res.status(500).send(e);
            })
    }
}