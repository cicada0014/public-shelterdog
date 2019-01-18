import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import { inject } from "inversify";
import { Request, Response, NextFunction } from 'express'
import { BaseRequest } from "../../types/types";
import { PodcastDAO } from "../../dao/podcast/podcast.dao";


@controller('/api/podcast')
export class PodcastController {


    constructor(
        @inject(PodcastDAO.sym) private podcastDAO: PodcastDAO

    ) {



    }
    @httpGet('/latest')
    public async getLatest(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {

        return this.podcastDAO
            .getLatest()
            .then(r => {
                res.send(r)
            })
            .catch(e => {
                console.log(e)
            })


    }
    @httpGet('/list')
    public async getList(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {

        return this.podcastDAO
            .getList()
            .then(r => {
                res.send(r)
            })
            .catch(e => {
                console.log(e)
            })

    }




}