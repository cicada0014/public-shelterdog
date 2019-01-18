
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class FeedbacksSchema {


    static sym = Symbol(FeedbacksSchema.name);
    private FeedbacksSchema: FeedbacksModel
    public getSchema() {
        return this.FeedbacksSchema;
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
            type: {
                type: sequelize.STRING(10),
                allowNull: false
            },
            user_id: {
                type: sequelize.BIGINT(20),
                allowNull: true
            },
            data: {
                type: sequelize.TEXT,
                allowNull: false
            },
            created_at: {
                type: sequelize.TIME,
                allowNull: true
            },
        }
        this.FeedbacksSchema = this.mysqlcon.getSequelize()
            .define<FeedbacksInstance, FeedbacksAttribute>('Feedbacks', _att,
                {
                    tableName: 'feedbacks',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface FeedbacksAttribute {
    id?: number;
    type?: string;
    user_id?: number;
    data?: string
    created_at?: any;
    $or?:any
}
export interface FeedbacksInstance extends sequelize.Instance<FeedbacksAttribute>, FeedbacksAttribute {
}
export interface FeedbacksModel extends sequelize.Model<FeedbacksInstance, FeedbacksAttribute> { }