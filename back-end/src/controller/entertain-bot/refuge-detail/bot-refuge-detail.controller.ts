import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../../types/types";
import { ArticleDAO } from "../../../dao/article/article.dao";
import { RefugesDAO } from "../../../dao/refuges/refuges.dao";
import { createPageTemplate } from "../bot-page.template";


@controller('/refuge-detail')
export class BotRefugeDetailController {

    imgRegexp = /<img src\s*=\s*\\*"(.+?)\\*"\s*(\/)?>/;

    constructor(
        @inject(ArticleDAO.sym) private articleDAO: ArticleDAO,
        @inject(RefugesDAO.sym) private refugesDAO: RefugesDAO,
    ) {

    }




    @httpGet('/:id')
    public async getPubLIst(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        try {
            let result = await this.refugesDAO.getRefuge(req.params.id);
            if (result) {
                let RefugeArticles = await this.refugesDAO.getArticlesOfRefuge(req.params.id, '0', '10000')
                if (req.header('x-entertain-bot') == '1') {



                    let _content = '';
                    for (let article of RefugeArticles) {
                        _content += `<br><br><a href="https://shelterdog.net/refuge-article/${article.id}">${article.title}</a> <br> `
                    }



                    let _result =
                        createPageTemplate(
                            `${req.protocol}://${req.host}${req.url}`,
                            `${result.name} 도피처`, `${result.name}`, `${result.name} 도피처 - ${result.name}... 싫어하시나요?`, _content, null);



                    res.send(_result)
                    return
                }
                next()
            } else {
                res.status(400).send({ message: 'deactive refuge' })
            }
        } catch (e) {
            console.error(e)
            res.status(400).send(e)
        }


    }
}