import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import passport from 'passport';
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../types/types";
import { adminChecker } from "../../lib/auth/admin.checker";
import { BannerDAO } from "../../dao/banner/banner.dao";


@controller('/api/banner')
export class BannerController {
    constructor(
        @inject(BannerDAO.sym) private bannerDAO: BannerDAO,

    ) {
    }

    @httpGet('/area')
    public async getList(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        return this.bannerDAO
            .getArea(req.query.areaKey)
            .then(r => {
                res.send(r)
            })
            .catch(e => {
                console.log(e)
                res.status(400).send(e)
            })
    }






}