
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class CategoriesSchema {


    static sym = Symbol(CategoriesSchema.name);
    private CategoriesSchema: CategoriesModel
    public getSchema() {
        return this.CategoriesSchema;
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
            name: {
                type: sequelize.STRING(100),
                allowNull: false
            },
        }
        this.CategoriesSchema = this.mysqlcon.getSequelize()
            .define<CategoriesInstance, CategoriesAttribute>('Categories', _att,
                {
                    tableName: 'categories',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface CategoriesAttribute {
    id?: number;
    name?: string;
}
export interface CategoriesInstance extends sequelize.Instance<CategoriesAttribute>, CategoriesAttribute {
}
export interface CategoriesModel extends sequelize.Model<CategoriesInstance, CategoriesAttribute> { }