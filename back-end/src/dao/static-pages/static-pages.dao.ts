import { injectable, inject } from "inversify";
import { MysqlConnection } from "../../db/mysql.connection";
import { NoticesSchema, NoticesAttribute } from "../../schemata/notices.schema";
import { StaticPagesSchema, StaticPagesAttribute } from "../../schemata/static-pages.schema";







@injectable()
export class StaticPagesDAO {

    public static sym = Symbol(StaticPagesDAO.name);

    constructor(
        @inject(MysqlConnection.sym) private mysqlCon: MysqlConnection,
        @inject(StaticPagesSchema.sym) private staticPagesSchema: StaticPagesSchema,
    ) {
    }



    public getActPage(category) {
        return this.staticPagesSchema.getSchema().find({
            where: {
                category,
                status: 'ACT'
            }
        })
    }

    public getList() {
        return this.staticPagesSchema.getSchema().findAll({
            order: [['id', 'desc']]
        })
    }
    public createPage(page: StaticPagesAttribute) {
        console.log(page)
        delete page.id
        return this.staticPagesSchema.getSchema().create(page)
    }

    public updatePage(page: StaticPagesAttribute) {
        delete page.created_at
        delete page.updated_at
        return this.staticPagesSchema.getSchema().update(page, { where: { id: page.id } })
    }


}