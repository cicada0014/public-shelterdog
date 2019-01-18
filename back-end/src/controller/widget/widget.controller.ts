import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../types/types";
import { GoogleAnalyticsAPIservice } from "../../lib/google/google.analytics.api.service";


@controller('/api/widget')
export class WidgetController {
    constructor(
        @inject(GoogleAnalyticsAPIservice.sym) private googleAnalyticsAPIservice: GoogleAnalyticsAPIservice
    ) {
    }


    @httpGet('/sessions')
    public async getSession(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        let todaySession = this.googleAnalyticsAPIservice.getTodaySession();
        let totalSession = this.googleAnalyticsAPIservice.getTotalSession();
        res.send({
            todaySession,
            totalSession
        })
    }


}