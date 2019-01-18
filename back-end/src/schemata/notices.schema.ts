
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class NoticesSchema {


    static sym = Symbol(NoticesSchema.name);
    private NoticesSchema: NoticesModel
    public getSchema() {
        return this.NoticesSchema;
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
            title: {
                type: sequelize.STRING(100),
                allowNull: false
            },
            content: {
                type: sequelize.TEXT,
                allowNull: false
            },
            status: {
                type: sequelize.STRING(3),
                allowNull: false
            },
            priority: {
                type: sequelize.INTEGER(11),
                allowNull: true,
                default: 999
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
        this.NoticesSchema = this.mysqlcon.getSequelize()
            .define<NoticesInstance, NoticesAttribute>('Notices', _att,
                {
                    tableName: 'notices',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface NoticesAttribute {
    id?: number;
    title?: string;
    content?: string;
    status?: string;
    priority?: number;
    meta?: string;
    created_at?: any;
    updated_at?: any;

}
export interface NoticesInstance extends sequelize.Instance<NoticesAttribute>, NoticesAttribute {
}
export interface NoticesModel extends sequelize.Model<NoticesInstance, NoticesAttribute> { }