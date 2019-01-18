
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class RefugeArticleCommentsSchema {


    static sym = Symbol(RefugeArticleCommentsSchema.name);
    private RefugeArticleCommentsSchema: RefugeArticleCommentsModel
    public getSchema() {
        return this.RefugeArticleCommentsSchema;
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
            refuge_article_id: {
                type: sequelize.BIGINT(20),
                allowNull: false
            },
            user_id: {
                type: sequelize.BIGINT(20),
                allowNull: false
            },
            content: {
                type: sequelize.TEXT,
                allowNull: true
            },
            parent: {
                type: sequelize.INTEGER(11),
                allowNull: true,
            },
            mention_id: {
                type: sequelize.BIGINT(20),
                allowNull: true,
            },
            status_code: {
                type: sequelize.SMALLINT(4),
                allowNull: true,
            },
            anonymous: {
                type: sequelize.TINYINT(1),
                defaultValue: null
            },
            created_at: {
                type: sequelize.TIME,
                allowNull: true
            },
            updated_at: {
                type: sequelize.TIME,
                allowNull: true
            },
        }
        this.RefugeArticleCommentsSchema = this.mysqlcon.getSequelize()
            .define<RefugeArticleCommentsInstance, RefugeArticleCommentsAttribute>('RefugeArticleComments', _att,
                {
                    tableName: 'refuge_article_comments',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface RefugeArticleCommentsAttribute {
    id?: number;
    refuge_article_id?: number;
    user_id?: number;
    content?: string;
    parent?: number;
    mention_id?: number;
    status_code?: number;
    anonymous?: boolean | number;
    created_at?: any;
    updated_at?: any;

}
export interface RefugeArticleCommentsInstance extends sequelize.Instance<RefugeArticleCommentsAttribute>, RefugeArticleCommentsAttribute {
}
export interface RefugeArticleCommentsModel extends sequelize.Model<RefugeArticleCommentsInstance, RefugeArticleCommentsAttribute> { }