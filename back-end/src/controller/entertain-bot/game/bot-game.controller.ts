import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../../types/types";
import { ArticleDAO } from "../../../dao/article/article.dao";
import { createPageTemplate } from "../bot-page.template";


@controller('/game')
export class BotGameController {

    imgRegexp = /<img src\s*=\s*\\*"(.+?)\\*"\s*(\/)?>/;

    constructor(
        @inject(ArticleDAO.sym) private articleDAO: ArticleDAO,
    ) {

    }



    @httpGet('/index')
    public async getLIst(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        if (req.header('x-entertain-bot') == '1') {


            let _result =
                createPageTemplate(
                    `${req.protocol}://${req.host}${req.url}`,
                    `쉘터독 오락실`,
                    `웹게임 커뮤니티 쉘터독 `,
                    `간단한 게임을 통해 짜증을 해소하세요.`,
                    `
                    <br><br>
                    <a href="https://shelterdog.net/game/cider">사이다 톡</a> <br>
                    <br><br>
                    <a href="https://shelterdog.net/game/runner">죄수번호 5275</a> <br>
                    <br><br>
                    <a href="https://shelterdog.net/game/defence">비매너와의 전쟁 (a.k.a - 디펜스 게임)</a> <br>
                    <br><br>
                    `,
                    null);
            res.send(_result)
            return
        }
        next();
    }


    @httpGet('/cider')
    public async getPubLIst(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        if (req.header('x-entertain-bot') == '1') {
            let _result =
                createPageTemplate(
                    `${req.protocol}://${req.host}${req.url}`,
                    `사이다 톡 - 할 말 하고 살자!`,
                    `속 시원한 게임 , 웹게임 `,
                    `평소 암덩어리 같던 존재들에게 톡 쏘는 한마디 해보세요.`,
                    `
                    <br><br>
                    사이다 톡
                    <br><br>
                    평소 암덩어리 같던 존재들에게 톡 쏘는 한마디 해보세요!!!!
                    <br><br>
                    속이 시원해질겁니다. 어서요!
                    <br><br>
            
                    `,
                    'https://s3.ap-northeast-2.amazonaws.com/article.images/3e/6a/bc/be/0c/83/f5/09/37/51/8c/24/c9/4a/a0/6b/KakaoTalk_Photo_2018-10-24-18-27-05.jpeg');

            res.send(_result)
            return
        }
        next();
    }
    @httpGet('/runner')
    public async getRunnerInfo(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        if (req.header('x-entertain-bot') == '1') {


            let _result =
                createPageTemplate(
                    `${req.protocol}://${req.host}${req.url}`,
                    `죄수번호 5275 - 세상의 편견에 맞선 이야기`,
                    `세상에의 편견에 맞선 이야기,웹 게임`,
                    `싫어하는 것도 마음대로 못하나? 라는 질문을 던진 한 청년의 이야기`,
                    `
                    <br><br>
                    죄수번호 5275
                    싫어하는 것도 마음대로 못하나? 라는 질문을 던진 한 청년의 이야기
                    오이를 싫어하는 한 청년이 있었다. 친구들이 핀잔을 주자 
                    그는 스스로에게 죄수번호를 붙이고 달리기 시작했다. 
                    오이를 싫어하는게 잘못은 아니건만....
            
                    `,
                    'https://s3.ap-northeast-2.amazonaws.com/article.images/01/70/17/d1/4c/d4/66/71/a5/10/31/60/84/f7/27/37/k-vs-villain.jpeg');


            res.send(_result)
            return
        }
        next();
    }
    @httpGet('/defence')
    public async getDefenceInfo(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        if (req.header('x-entertain-bot') == '1') {


            let _result =
                createPageTemplate(
                    `${req.protocol}://${req.host}${req.url}`,
                    `비매너와의 전쟁 - 비호감 전성시대 (a.k.a 디펜스 게임)`,
                    `비매너 비호감 디펜스 타워디펜스 게임`,
                    `다양한 비매너들을 혼내주도록 하자!`,
                    `
                    <br><br>
                비매너와의 전쟁 - 비호감 전성시대 (a.k.a 디펜스 게임)
                매너가 사람을 만든다...
                하지만 세상에는 매너 없는 인간들이 너무 많다.
                지금 비매너인 사람들이 당신에게 몰려 오고 있다! 
                다양한 비매너들을 혼내주도록 하자!
            
                    `,
                    'https://s3.ap-northeast-2.amazonaws.com/article.images/af/64/c4/b5/5c/bd/f4/85/41/13/c6/3d/8b/e6/26/4d/defence-tumbnail.png');

            res.send(_result)
            return
        }
        next();
    }
}