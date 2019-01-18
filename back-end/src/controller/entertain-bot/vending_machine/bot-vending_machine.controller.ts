import { controller, httpGet, httpPatch, httpPost, request, response, next } from "inversify-express-utils";
import { Request, Response, NextFunction } from 'express'
import { inject } from "inversify";
import { BaseRequest } from "../../../types/types";
import { createPageTemplate } from "../bot-page.template";
import { VendingMachineDAO } from "../../../dao/vending_machine/vending_machine.dao";


@controller('/vending_machine')
export class BotVendingMachineController {

    imgRegexp = /<img src\s*=\s*\\*"(.+?)\\*"\s*(\/)?>/;

    constructor(
        @inject(VendingMachineDAO.sym) private vendingMachineDAO: VendingMachineDAO,
    ) {

    }


    @httpGet('/test')
    public async getLIs(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        `${req.protocol}://${req.host}${req.url}`

    }


    @httpGet('/cider/list')
    public async getLIst(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        if (req.header('x-entertain-bot') == '1') {
            let items = await this.vendingMachineDAO.getListByCategory(1, 20 + '', 0 + '');
            let _content = '';
            for (let item of items) {
                _content = `<a href="https://shelterdog.net/cider/${item.id}"> ${item.title} </a> `
            }
            let _result =
                createPageTemplate(
                    `${req.protocol}://${req.host}${req.url}`,
                    `쉘터독 자판기`,
                    `자판기 사이다 썰 해소 공간 `,
                    `속이 답답해? 원하는 사이다 썰을 자유롭게 뽑아 마셔봐~! `,
                    _content,
                    null);

            res.send(_result)
            return
        }
        next();
    }
    @httpGet('/cider/:id')
    public async getItem(@request() req: BaseRequest, @response() res: Response, @next() next: NextFunction) {
        if (req.header('x-entertain-bot') == '1') {
            let item = await this.vendingMachineDAO.getItem(req.params.id);
            let refs = await this.vendingMachineDAO.getSimpleList();
            for (let i = 0; i < ((item.VendingMachineItemComments.length > 50) ? 50 : item.VendingMachineItemComments.length); i++) {
                item.script += `<span> ${item.VendingMachineItemComments[i].content} </span>`
            }

            refs.forEach(ref => {
                item.script += `<a href="https://shelterdog.net/vending_machine/cider/${ref.id}"  > ${ref.title}   </a>`
            })

            let _result =
                createPageTemplate(
                    `${req.protocol}://${req.host}${req.url}`,
                    `${item.title} - 쉘터독 자판기`,
                    `${item.VendingMachineItemHashTags.map(itemTag => itemTag.HashTag.name)}`,
                    `속이 답답해? 원하는 사이다 썰을 자유롭게 뽑아 마셔봐~! `,
                    item.script,
                    item.thumbnail);
            res.send(_result)
            return
        }
        next();
    }
}