
import { injectable, inject } from "inversify";



import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class GamesSchema {


    static sym = Symbol(GamesSchema.name);
    private GamesSchema: GamesModel
    public getSchema() {
        return this.GamesSchema;
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
            title: {
                type: sequelize.STRING(30),
                allowNull: false,
            },
            subtitle: {
                type: sequelize.STRING(30),
                allowNull: true
            },
            description: {
                type: sequelize.STRING(100),
                allowNull: false
            },
            created_at: {
                type: sequelize.TIME,
                allowNull: true
            },
        }
        this.GamesSchema = this.mysqlcon.getSequelize()
            .define<GamesInstance, GamesAttribute>('Games', _att,
                {
                    tableName: 'games',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface GamesAttribute {
    id?: number;
    title?: string;
    subtitle?: string;
    description?: string;
    created_at?: any;

}
export interface GamesInstance extends sequelize.Instance<GamesAttribute>, GamesAttribute {
}
export interface GamesModel extends sequelize.Model<GamesInstance, GamesAttribute> { }