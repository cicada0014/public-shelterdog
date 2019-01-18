import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../../types/types";
import { ArticleDAO } from "../../../dao/article/article.dao";
import { RefugesDAO } from "../../../dao/refuges/refuges.dao";
import { createPageTemplate } from "../bot-page.template";


@controller('/refuge-article')
export class BotRefugeArticleController {

    imgRegexp = /<img src\s*=\s*\\*"(.+?)\\*"\s*(\/)?>/;

    constructor(
        @inject(ArticleDAO.sym) private articleDAO: ArticleDAO,
        @inject(RefugesDAO.sym) private refugesDAO: RefugesDAO,
    ) {

    }




    @httpGet('/:id')
    public async getPubLIst(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        return this.articleDAO
            .getArticle(req.params.id)
            .then(async r => {
                if (!r) {
                    res.status(404).send('not found article')
                    return
                }
                let RefugeArticles = await this.refugesDAO.getArticlesOfRefuge(r.refuge_id, '0', '15')
                if (r.status_code && r.status_code < 999) {
                    // 이용할수 없게된 콘텐츠
                    res.status(406).send({ status_code: r.status_code })
                    return
                }
                let imgs = this.imgRegexp.exec(r.content);
                if (imgs && imgs.length > 0) {
                    let srcs = /src\=\"[^\s]*\"/.exec(imgs[0])
                    if (srcs) {
                        (<any>r).thumbnail = srcs[0].substring(5, srcs[0].length - 1)
                    }
                }


                if (req.header('x-entertain-bot') == '1') {



                    let _content = `
                    <section>
                    ${r.content}
                    </section>
                    
                    `
                    r.RefugeArticleComments.forEach((rac => {
                        _content += `<br> <div style="width:100%; word-break: break-all" >${rac.content}</div> <br>`
                    }))
                    if (RefugeArticles && RefugeArticles.length > 0) {
                        for (let article of RefugeArticles) {
                            _content += `<br><br><a style="margin-top:50px" href="https://shelterdog.net/refuge-article/${article.id}">${article.title}</a> <br><br> `
                        }
                    }

                    let _result =
                        createPageTemplate(`${req.protocol}://${req.host}${req.url}`,`${r.title} - Shelter Dog(쉘터 독)`, `${(<any>r).Refuge.name} ${r.title}`, `${r.content.replace(/<(.|\n)*?>/g, '')}`, _content, (<any>r).thumbnail);
                    res.send(_result)
                    return
                }
                next()
            }).catch(e => {
                console.error(e)
                res.status(400).send(e)
            })









    }
    @httpGet('/:id/best')
    public async getBest(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        return this.articleDAO
            .getArticle(req.params.id)
            .then(r => {
                if (!r) {
                    res.status(404).send('not found article')
                    return
                }
                if (r.status_code) {
                    // 이용할수 없게된 콘텐츠
                    res.status(406).send({ status_code: r.status_code })
                    return
                }
                let imgs = this.imgRegexp.exec(r.content);
                if (imgs && imgs.length > 0) {
                    let srcs = /src\=\"[^\s]*\"/.exec(imgs[0])
                    if (srcs) {
                        (<any>r).thumbnail = srcs[0].substring(5, srcs[0].length - 1)
                    }
                }


                if (req.header('x-entertain-bot') == '1') {
                    let result = `
                    <!DOCTYPE html>
                    <html>
                        <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no">
                        <title>${r.title} - Shelter Dog(쉘터 독)</title>
                        <meta name="keywords" content="${(<any>r).Refuge.name} ${r.title}">
                        <meta name="description" content="${r.content.replace(/<(.|\n)*?>/g, '')}">
                            <meta property="og:title" content="${r.title}">
                            <meta property="og:description" content="커뮤니티 쉘터 독">
                            <meta property="og:image" content="${ (<any>r).thumbnail ? (<any>r).thumbnail : 'https://s3.ap-northeast-2.amazonaws.com/article.images/0c/94/93/5d/4c/48/d9/a9/55/d9/c6/54/d0/f3/84/8f'}">
                        </head>
                        <body>


                            ${r.content}
                        </body>
                    
                    </html>
                    `
                    res.send(result)
                    return
                }
                next()
            }).catch(e => {
                console.error(e)
                res.status(400).send(e)
            })









    }
}