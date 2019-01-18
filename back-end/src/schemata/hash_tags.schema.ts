
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class HashTagsSchema {


    static sym = Symbol(HashTagsSchema.name);
    private HashTagsSchema: HashTagsModel
    public getSchema() {
        return this.HashTagsSchema;
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
                type: sequelize.STRING(25),
                unique: true

            }
        }
        this.HashTagsSchema = this.mysqlcon.getSequelize()
            .define<HashTagsInstance, HashTagsAttribute>('HashTags', _att,
                {
                    tableName: 'hash_tags',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface HashTagsAttribute {
    id?: number;
    name: string
}
export interface HashTagsInstance extends sequelize.Instance<HashTagsAttribute>, HashTagsAttribute {
}
export interface HashTagsModel extends sequelize.Model<HashTagsInstance, HashTagsAttribute> { }