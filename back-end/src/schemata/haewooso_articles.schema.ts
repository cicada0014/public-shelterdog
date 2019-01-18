
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";
import { RefugeArticlesAttribute } from "./refuge_articles.schema";



@injectable()
export class HaewoosoArticlesSchema {


    static sym = Symbol(HaewoosoArticlesSchema.name);
    private HaewoosoArticlesSchema: HaewoosoArticlesModel
    public getSchema() {
        return this.HaewoosoArticlesSchema;
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
            content: {
                type: sequelize.STRING(2000),
                allowNull: false
            },
            created_at: {
                type: sequelize.TIME,
                allowNull: true
            },

        }
        this.HaewoosoArticlesSchema = this.mysqlcon.getSequelize()
            .define<HaewoosoArticlesInstance, HaewoosoArticlesAttribute>('HaewoosoArticles', _att,
                {
                    tableName: 'haewooso_articles',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface HaewoosoArticlesAttribute {
    id?: number;
    user_id?: number;
    content?: string;
    created_at?: any;
    isMe?: boolean;
    $lte?: any;

}
export interface HaewoosoArticlesInstance extends sequelize.Instance<HaewoosoArticlesAttribute>, HaewoosoArticlesAttribute {
}
export interface HaewoosoArticlesModel extends sequelize.Model<HaewoosoArticlesInstance, HaewoosoArticlesAttribute> { }