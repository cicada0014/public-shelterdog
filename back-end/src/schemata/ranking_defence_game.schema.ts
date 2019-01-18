
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class RankingDefenceGameSchema {




    static sym = Symbol(RankingDefenceGameSchema.name);
    private RankingDefenceGameSchema: RankingDefenceGameModel
    public getSchema() {
        return this.RankingDefenceGameSchema;
    }
    constructor(
        @inject((MysqlConnection.sym)) protected mysqlcon: MysqlConnection
    ) {

        const _att =
        {
            user_id: {
                type: sequelize.BIGINT(20),
                primaryKey: true,
                allowNull: false
            },
            life: {
                type: sequelize.INTEGER,
                allowNull: false
            },
            deposit: {
                type: sequelize.INTEGER,
                allowNull: false
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
        this.RankingDefenceGameSchema = this.mysqlcon.getSequelize()
            .define<RankingDefenceGameInstance, RankingDefenceGameAttribute>('RankingDefenceGame', _att,
                {
                    tableName: 'ranking_defence_game',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface RankingDefenceGameAttribute {
    user_id?: number;
    life?: number;
    deposit?: number;
    created_at?: string;
    updated_at?: string;
}
export interface RankingDefenceGameInstance extends sequelize.Instance<RankingDefenceGameAttribute>, RankingDefenceGameAttribute {
}
export interface RankingDefenceGameModel extends sequelize.Model<RankingDefenceGameInstance, RankingDefenceGameAttribute> { }