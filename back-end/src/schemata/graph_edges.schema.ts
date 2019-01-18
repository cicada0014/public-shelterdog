
import { injectable, inject } from "inversify";



import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class GraphEdgesSchema {


    static sym = Symbol(GraphEdgesSchema.name);
    private GraphEdgesSchema: GraphEdgesModel
    public getSchema() {
        return this.GraphEdgesSchema;
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
            from: {
                type: sequelize.BIGINT(20),
                allowNull: false
            },
            to: {
                type: sequelize.BIGINT(20),
                allowNull: false
            },
        }
        this.GraphEdgesSchema = this.mysqlcon.getSequelize()
            .define<GraphEdgesInstance, GraphEdgesAttribute>('GraphEdges', _att,
                {
                    tableName: 'graph_edges',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface GraphEdgesAttribute {
    id?: number;
    type?: string;
    from?: number;
    to?: number;

}
export interface GraphEdgesInstance extends sequelize.Instance<GraphEdgesAttribute>, GraphEdgesAttribute {
}
export interface GraphEdgesModel extends sequelize.Model<GraphEdgesInstance, GraphEdgesAttribute> { }