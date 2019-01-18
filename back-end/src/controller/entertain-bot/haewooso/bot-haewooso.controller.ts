import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../../types/types";
import { ArticleDAO } from "../../../dao/article/article.dao";
import { createPageTemplate } from "../bot-page.template";


@controller('/haewooso')
export class BotHaewoosoController {

    imgRegexp = /<img src\s*=\s*\\*"(.+?)\\*"\s*(\/)?>/;

    constructor(
        @inject(ArticleDAO.sym) private articleDAO: ArticleDAO,
    ) {

    }



    @httpGet('/')
    public async getLIst(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        if (req.header('x-entertain-bot') == '1') {


            let _result =
                createPageTemplate(
                    `${req.protocol}://${req.host}${req.url}`,
                    `쉘터독 해우소`,
                    `해우소 공감 해소 `,
                    `쉘터독 해우소는 여러분들의 오늘 하루 있었던 이야기가 궁금해요.`,
                    `
                    <br><br>

                    마음속 응어리를 풀어내는 공간

                    일을 떠넘기는 상사 , 필요할 때만 연락하는 친구 , 취향을 존중해주지 않는 주위의 시선, 끔찍한 출퇴근길, 야속하기만한 전 애인, 불쾌한 담배냄새 등...
                    살아가다보면 싫어하는 것들은 매우 많습니다. 

                    하지만 우리는 직장이나 관계 등 여러 상황들 때문에 불합리한 상황에서도 말하고 싶은 말을 못하기도 하며 ,
                    이런 상황을 주변 지인들에게 매번 하소연하기 어렵습니다.
                    우리는 이렇게 짜증나는 상황들을 해소하지 못한 채 혼자 마음속으로만 끙끙 앓으며 살아갑니다. 

                    Shelter Dog는 싫어하는 주제들을 다루며 마음속 응어리들을 풀어 낼 수 있는 공간을 만들고자 합니다. 

                    속 시원히 말하고, 하소연을 하며 해소하고 풍자와 해학을 통해 웃음짓고 소통하며 공감할 수 있도록 만들 것입니다.

                    무언가를 싫어하는 것은 자연스러운 것이고
                    이에 대해 이야기하며 해소하는 것 역시 자연스러운 것입니다. 
                    같이 싫어하고 공감하며 해소해보세요!

                    더 이상 마음속으로 혼자 끙끙 앓지 마세요.
                    같이 싫어해줄 사람들이 있어요


                    당신의 말에 공감하고 웃고
                    당신을 위로해줄 사람들과 편하게 이야기해보세요


                    `,
                    null);

            res.send(_result)
            return
        }
        next();
    }



}