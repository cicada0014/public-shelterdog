import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../../types/types";
import { ArticleDAO } from "../../../dao/article/article.dao";
import { RefugesDAO } from "../../../dao/refuges/refuges.dao";
import { createPageTemplate } from "../bot-page.template";


@controller('/refuges')
export class BotRefugesController {

    imgRegexp = /<img src\s*=\s*\\*"(.+?)\\*"\s*(\/)?>/;

    constructor(
        @inject(ArticleDAO.sym) private articleDAO: ArticleDAO,
        @inject(RefugesDAO.sym) private refugesDAO: RefugesDAO,
    ) {

    }




    @httpGet('/')
    public async getPubLIst(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        try {
            let refuges = await this.refugesDAO.getList();
            if (req.header('x-entertain-bot') == '1') {

                let _content = ''
                for (let refuge of refuges) {
                    _content += `<br><br>  <a href="https://shelterdog.net/refuge-detail/${refuge.id}">${refuge.name} 도피처</a>  <br> `
                }
                _content += `<br><br><a href="https://shelterdog.net/game/index">오락실</a> <br> `
                _content += `<br><br> <a href="https://shelterdog.net/about">About</a> <br> `
                _content += `<br><br> <a href="https://shelterdog.net/haewooso">해우소</a> <br> `
                _content += `<a href="https://shelterdog.net/notice/list">쉘터독 공지사항</a> <br> `
                _content += `<a href="https://shelterdog.net/vending_machine/cider/list">쉘터독 자판기</a> <br> `
                // _result += `<a href="https://shelterdog.net/refuge-request">도피처 요청</a> <br> `
                _content += `<br><br> <a href="https://shelterdog.net/podcast/list">라디오</a> <br> `

                let _result =
                    createPageTemplate(
                        `${req.protocol}://${req.host}${req.url}`,
                        'Shelter Dog (쉘터독)', '커뮤니티 쉘터독 싫어하는 것', '싫어하는 것을 자유롭게 소통하는 커뮤니티', _content, null);

                res.send(_result)
                return
            }
            next()
        } catch (e) {
            console.error(e)
            res.status(400).send(e)
        }


    }
}