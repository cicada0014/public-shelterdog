
import { injectable, inject } from "inversify";



import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class GraphObjectsSchema {


    static sym = Symbol(GraphObjectsSchema.name);
    private GraphObjectsSchema: GraphObjectsModel
    public getSchema() {
        return this.GraphObjectsSchema;
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
                allowNull: false,
            },
            ref_id: {
                type: sequelize.BIGINT(20),
                allowNull: false
            }
        }
        this.GraphObjectsSchema = this.mysqlcon.getSequelize()
            .define<GraphObjectsInstance, GraphObjectsAttribute>('GraphObjects', _att,
                {
                    tableName: 'graph_objects',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface GraphObjectsAttribute {
    id?: number;
    type?: string;
    ref_id?: number;

}
export interface GraphObjectsInstance extends sequelize.Instance<GraphObjectsAttribute>, GraphObjectsAttribute {
}
export interface GraphObjectsModel extends sequelize.Model<GraphObjectsInstance, GraphObjectsAttribute> { }