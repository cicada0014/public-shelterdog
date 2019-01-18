
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";
import { UserProfilesAttribute } from "./user_profile.shcema";
import { RefugeArticleCommentsAttribute } from "./refuge_article_comments.schema";



@injectable()
export class RefugeArticlesSchema {


    static sym = Symbol(RefugeArticlesSchema.name);
    private RefugeArticlesSchema: RefugeArticlesModel
    public getSchema() {
        return this.RefugeArticlesSchema;
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
            refuge_id: {
                type: sequelize.BIGINT(20),
                allowNull: false
            },
            header_id: {
                type: sequelize.BIGINT(20),
                allowNull: true
            },
            status_code: {
                type: sequelize.SMALLINT(6),
                allowNull: true
            },
            title: {
                type: sequelize.STRING(255),
                allowNull: false
            },
            content: {
                type: sequelize.TEXT,
                allowNull: true
            },
            user_id: {
                type: sequelize.BIGINT(20),
                allowNull: false
            },
            hit: {
                type: sequelize.BIGINT(20),
                allowNull: false,
                defaultValue: 0
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
        this.RefugeArticlesSchema = this.mysqlcon.getSequelize()
            .define<RefugeArticlesInstance, RefugeArticlesAttribute>('RefugeArticles', _att,
                {
                    tableName: 'refuge_articles',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface RefugeArticlesAttribute {
    id?: number;
    user_id?: number;
    refuge_id?: number;
    title?: string;
    hit?: number;
    content?: string;
    header_id?: number;
    status_code?: number;
    UserProfile?: UserProfilesAttribute
    anonymous?: boolean | number;
    created_at?: any;
    updated_at?: any;
    RefugeArticleComments?: RefugeArticleCommentsAttribute[]

}
export interface RefugeArticlesInstance extends sequelize.Instance<RefugeArticlesAttribute>, RefugeArticlesAttribute {
}
export interface RefugeArticlesModel extends sequelize.Model<RefugeArticlesInstance, RefugeArticlesAttribute> { }