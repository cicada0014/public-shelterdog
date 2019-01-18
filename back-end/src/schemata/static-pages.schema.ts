
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class StaticPagesSchema {


    static sym = Symbol(StaticPagesSchema.name);
    private StaticPagesSchema: StaticPagesModel
    public getSchema() {
        return this.StaticPagesSchema;
    }
    constructor(
        @inject((MysqlConnection.sym)) protected mysqlcon: MysqlConnection
    ) {

        const _att =
        {
            id: {
                type: sequelize.BIGINT(20),
                primaryKey: true,
            },
            content: {
                type: sequelize.TEXT,
                allowNull: false
            },
            status: {
                type: sequelize.STRING(3),
                allowNull: true
            },
            category: {
                type: sequelize.STRING(10),
                allowNull: false,
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
        this.StaticPagesSchema = this.mysqlcon.getSequelize()
            .define<StaticPagesInstance, StaticPagesAttribute>('StaticPages', _att,
                {
                    tableName: 'static_pages',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface StaticPagesAttribute {
    id?: number;
    content?: string;
    category?: string;
    status?: string;
    meta?: string;
    created_at?: any;
    updated_at?: any;

}
export interface StaticPagesInstance extends sequelize.Instance<StaticPagesAttribute>, StaticPagesAttribute {
}
export interface StaticPagesModel extends sequelize.Model<StaticPagesInstance, StaticPagesAttribute> { }