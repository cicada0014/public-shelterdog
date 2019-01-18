import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../types/types";
import { NoticeDAO } from "../../dao/notice/notice.dao";


@controller('/api/notice')
export class NoticeController {
    constructor(
        @inject(NoticeDAO.sym) private noticeDAO: NoticeDAO
    ) {
    }



    @httpGet('/list')
    public async getPubLIst(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        return this.noticeDAO
            .getList()
            .then(r => {
                res.send(r)
            })
            .catch(e => {
                console.log(e);
                res.status(400).send(e)
            })
    }


    @httpGet('/:id')
    public async getNotice(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        return this.noticeDAO
            .getNotice(req.params.id)
            .then(r => {
                res.send(r)
            })
            .catch(e => {
                console.log(e);
                res.status(400).send(e)
            })
    }








}