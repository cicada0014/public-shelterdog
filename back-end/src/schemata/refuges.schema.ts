
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";
import { RefugeArticlesAttribute } from "./refuge_articles.schema";



@injectable()
export class RefugesSchema {


    static sym = Symbol(RefugesSchema.name);
    private RefugesSchema: RefugesModel
    public getSchema() {
        return this.RefugesSchema;
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
            category_id: {
                type: sequelize.BIGINT(20),
                allowNull: false
            },
            name: {
                type: sequelize.STRING(50),
                allowNull: false
            },
            active: {
                type: sequelize.BOOLEAN,
                allowNull: true
            },
            meta: {
                type: sequelize.TEXT,
                allowNull: true
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
        this.RefugesSchema = this.mysqlcon.getSequelize()
            .define<RefugesInstance, RefugesAttribute>('Refuges', _att,
                {
                    tableName: 'refuges',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface RefugesAttribute {
    id?: number;
    name?: string;
    category_id?: number;
    active?: boolean;
    meta?: string;
    created_at?: any;
    updated_at?: any;
    RefugeArticles?: RefugeArticlesAttribute[];
    noticeArticles?: RefugeArticlesAttribute[];
    BestRefugeArticles?: any;
    totalRecords?: number

}
export interface RefugesInstance extends sequelize.Instance<RefugesAttribute>, RefugesAttribute {
}
export interface RefugesModel extends sequelize.Model<RefugesInstance, RefugesAttribute> { }