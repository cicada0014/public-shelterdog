
import { injectable, inject } from "inversify";



import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class GameEvaluationsSchema {


    static sym = Symbol(GameEvaluationsSchema.name);
    private GameEvaluationsSchema: GameEvaluationsModel
    public getSchema() {
        return this.GameEvaluationsSchema;
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
            game_id: {
                type: sequelize.BIGINT(20),
                allowNull: false,
            },
            user_id: {
                type: sequelize.BIGINT(20),
                allowNull: true
            },
            ip: {
                type: sequelize.STRING(40),
                allowNull: true
            },
            nickname: {
                type: sequelize.STRING(10),
                allowNull: true
            },
            content: {
                type: sequelize.STRING(200),
                allowNull: false
            },
            created_at: {
                type: sequelize.TIME,
                allowNull: true
            },
        }
        this.GameEvaluationsSchema = this.mysqlcon.getSequelize()
            .define<GameEvaluationsInstance, GameEvaluationsAttribute>('GameEvaluations', _att,
                {
                    tableName: 'game_evaluations',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface GameEvaluationsAttribute {
    id?: number
    game_id?: number
    user_id?: number
    ip?: string
    nickname?: string
    content?: string
    created_at?: any

}
export interface GameEvaluationsInstance extends sequelize.Instance<GameEvaluationsAttribute>, GameEvaluationsAttribute {
}
export interface GameEvaluationsModel extends sequelize.Model<GameEvaluationsInstance, GameEvaluationsAttribute> { }