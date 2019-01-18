import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import passport from 'passport';
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { RefugesDAO } from "../../dao/refuges/refuges.dao";
import { BaseRequest } from "../../types/types";
import { GraphDAO } from "../../dao/graph/graph.dao";
import { StaticPagesDAO } from "../../dao/static-pages/static-pages.dao";


@controller('/api/static-pages')
export class StaticPagesController {
    constructor(
        @inject(StaticPagesDAO.sym) private staticPagesDAO: StaticPagesDAO
    ) {
    }


    @httpGet('/:category')
    public async getPage(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        const catgory = req.params.category;
        let _cat;
        switch (catgory) {
            case 'term':
                _cat = 'USE_TERM'
                break;
            case 'private':
                _cat = 'PRIVATE'
                break;
            case 'strategy':
                _cat = 'STRATEGY'
                break;
        }
        return this.staticPagesDAO
            .getActPage(_cat)
            .then(r => {
                res.send(r)
            })
            .catch(e => {
                res.status(400).send(e)
            })
    }






}