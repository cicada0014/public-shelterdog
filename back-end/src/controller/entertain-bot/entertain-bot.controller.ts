import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../types/types";
import { NoticeDAO } from "../../dao/notice/notice.dao";


@controller('/entertain')
export class EntertainBotController {
    constructor(
    ) {
    }



    @httpGet('/bot')
    public async getPubLIst(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        if (req.header('x-entertain-bot') == '1') {
            return `
        
            <html>
            
            <head></head>
            <body>
                안녕
            </body>
            
            </html>
    
    
            `
        }
        next()
    }
}