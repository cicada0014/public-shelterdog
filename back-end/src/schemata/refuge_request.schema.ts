
import { injectable, inject } from "inversify";



import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class RefugeRequestsSchema {


    static sym = Symbol(RefugeRequestsSchema.name);
    private RefugeRequestsSchema: RefugeRequestsModel
    public getSchema() {
        return this.RefugeRequestsSchema;
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
            content: {
                type: sequelize.STRING(40),
                allowNull: false,
            },
            user_id: {
                type: sequelize.BIGINT(20),
                allowNull: false
            },
            status: {
                type: sequelize.STRING(3),
                allowNull: false,
            },
            created_at: {
                type: sequelize.TIME,
                allowNull: true,
            },
        }
        this.RefugeRequestsSchema = this.mysqlcon.getSequelize()
            .define<RefugeRequestsInstance, RefugeRequestsAttribute>('RefugeRequests', _att,
                {
                    tableName: 'refuge_requests',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface RefugeRequestsAttribute {
    id?: number;
    user_id?: number;
    content?: string;
    status?: string;
    created_at?: any;

}
export interface RefugeRequestsInstance extends sequelize.Instance<RefugeRequestsAttribute>, RefugeRequestsAttribute {
}
export interface RefugeRequestsModel extends sequelize.Model<RefugeRequestsInstance, RefugeRequestsAttribute> { }