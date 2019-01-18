
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class RefugeArticleHeadersSchema {


    static sym = Symbol(RefugeArticleHeadersSchema.name);
    private RefugeArticleHeadersSchema: RefugeArticleHeadersModel
    public getSchema() {
        return this.RefugeArticleHeadersSchema;
    }
    constructor(
        @inject((MysqlConnection.sym)) protected mysqlcon: MysqlConnection
    ) {

        const _att =
        {
            id: {
                type: sequelize.BIGINT(20),
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: sequelize.STRING(10),
                allowNull: true
            },

        }
        this.RefugeArticleHeadersSchema = this.mysqlcon.getSequelize()
            .define<RefugeArticleHeadersInstance, RefugeArticleHeadersAttribute>('RefugeArticleHeaders', _att,
                {
                    tableName: 'refuge_article_headers',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface RefugeArticleHeadersAttribute {
    id?: number;
    name?: string;
}
export interface RefugeArticleHeadersInstance extends sequelize.Instance<RefugeArticleHeadersAttribute>, RefugeArticleHeadersAttribute {
}
export interface RefugeArticleHeadersModel extends sequelize.Model<RefugeArticleHeadersInstance, RefugeArticleHeadersAttribute> { }