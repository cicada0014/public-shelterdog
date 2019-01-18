import { injectable, inject } from "inversify";
import { MysqlConnection } from "../../db/mysql.connection";
import { NoticesSchema, NoticesAttribute } from "../../schemata/notices.schema";







@injectable()
export class NoticeDAO {

    public static sym = Symbol(NoticeDAO.name);

    constructor(
        @inject(MysqlConnection.sym) private mysqlCon: MysqlConnection,
        @inject(NoticesSchema.sym) private noticeSchema: NoticesSchema,


    ) {

    }
    public getList() {
        return this.noticeSchema.getSchema().findAll({
            where: { status: 'PUB' },
            order: [['id', 'desc']]
        })
    }

    public getNotice(id) {
        return this.noticeSchema.getSchema().findById(id);
    }


    public getPUBList() {
        return this.noticeSchema.getSchema().findAll({
            where: { status: 'PUB' },
            order: [['id', 'desc']]
        })
    }


    public createNotice(notice: NoticesAttribute) {
        delete notice.id
        return this.noticeSchema.getSchema().create(notice)
    }

    public updateNotice(notice: NoticesAttribute) {
        delete notice.created_at
        delete notice.updated_at
        return this.noticeSchema.getSchema().update(notice, { where: { id: notice.id } })
    }


}