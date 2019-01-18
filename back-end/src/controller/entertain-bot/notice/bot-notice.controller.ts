import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../../types/types";
import { NoticeDAO } from "../../../dao/notice/notice.dao";
import { createPageTemplate } from "../bot-page.template";


@controller('/notice')
export class BotNoticeController {

    imgRegexp = /<img src\s*=\s*\\*"(.+?)\\*"\s*(\/)?>/;

    constructor(
        @inject(NoticeDAO.sym) private noticeDAO: NoticeDAO,
    ) {

    }




    @httpGet('/list')
    public async getPubLIst(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        try {
            let notices = await this.noticeDAO.getList();
            if (req.header('x-entertain-bot') == '1') {


                let _content = '';
                for (let notice of notices) {
                    _content += `<br><br>  <a href="https://shelterdog.net/notice/${notice.id}">${notice.title} </a>  <br> `
                }
                _content += `<br><br><a href="https://shelterdog.net/game/index">오락실</a> <br> `
                _content += `<br><br> <a href="https://shelterdog.net/about">About</a> <br> `
                _content += `<br><br> <a href="https://shelterdog.net/haewooso">해우소</a> <br> `
                // _result += `<a href="https://shelterdog.net/notice/list">쉘터독 공지사항</a> <br> `
                // _result += `<a href="https://shelterdog.net/refuge-request">도피처 요청</a> <br> `
                _content += `<br><br> <a href="https://shelterdog.net/podcast/list">라디오</a> <br> `


                let _result =
                    createPageTemplate(`${req.protocol}://${req.host}${req.url}`,`쉘터독 공지사항`, `커뮤니티 쉘터독 공지사항`, `싫어하는 것을 자유롭게 소통하는 커뮤니티`, _content, null);



                res.send(_result)
                return
            }
            next()
        } catch (e) {
            console.error(e)
            res.status(400).send(e)
        }


    }


    @httpGet('/:id')
    public async getNotice(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        try {
            let notice = await this.noticeDAO.getNotice(req.params.id);
            if (req.header('x-entertain-bot') == '1') {


                let _result =
                    createPageTemplate(`${notice.title}`, `커뮤니티 쉘터독 공지사항 ${notice.title}`, `싫어하는 것을 자유롭게 소통하는 커뮤니티`, notice.content + `<a href="https://shelterdog.net/notice/list">쉘터독 공지사항</a> <br> `, null);

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