
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";
import { RefugeArticlesAttribute } from "./refuge_articles.schema";



@injectable()
export class HaewoosoArticleCommentsSchema {


    static sym = Symbol(HaewoosoArticleCommentsSchema.name);
    private HaewoosoArticleCommentsSchema: HaewoosoArticleCommentsModel
    public getSchema() {
        return this.HaewoosoArticleCommentsSchema;
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
            user_id: {
                type: sequelize.BIGINT(20),
                allowNull: false
            },
            haewooso_article_id: {
                type: sequelize.BIGINT(20),
                allowNull: false
            },
            content: {
                type: sequelize.STRING(2000),
                allowNull: false
            },
            created_at: {
                type: sequelize.TIME,
                allowNull: true
            },

        }
        this.HaewoosoArticleCommentsSchema = this.mysqlcon.getSequelize()
            .define<HaewoosoArticleCommentsInstance, HaewoosoArticleCommentsAttribute>('HaewoosoArticleComments', _att,
                {
                    tableName: 'haewooso_article_comments',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface HaewoosoArticleCommentsAttribute {
    id?: number;
    user_id?: number;
    haewooso_article_id?: number;
    content?: string;
    created_at?: any;

}
export interface HaewoosoArticleCommentsInstance extends sequelize.Instance<HaewoosoArticleCommentsAttribute>, HaewoosoArticleCommentsAttribute {
}
export interface HaewoosoArticleCommentsModel extends sequelize.Model<HaewoosoArticleCommentsInstance, HaewoosoArticleCommentsAttribute> { }