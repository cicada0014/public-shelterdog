import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import passport from 'passport';
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../../types/types";
import { SlackAlarmService } from "../../../lib/slack/alarm.service";


@controller('/api/game/cider')
export class GameCiderController {
    constructor(
        @inject(SlackAlarmService.sym) private slackService: SlackAlarmService
    ) {
    }

    @httpPost('/msg')
    public messageArchiveToSlack(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        let msg: { type, step, text, name } = req.body
        this.slackService.sendCiderGameAlarm(msg)
        return

    }

    @httpPost('/text')
    public async createRefuge(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {

        let { step, text } = req.body;
        switch (step) {
            case 0:
                res.send({ msg: '뭐라고?' })
                break;
            case 1:
                res.send({ msg: '미안해...' })
                break;
            case 2:
                res.send({ msg: 'ㅋㅋㅋㅋㅋ 어쩔' })
                break;
            case 3:
                res.send({ msg: 'not found' })
                break;
            default:
                res.send({ msg: 'not found' })
                break;
        }


    }




}