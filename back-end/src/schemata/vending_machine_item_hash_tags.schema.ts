
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";
import { HashTagsAttribute } from "./hash_tags.schema";



@injectable()
export class VendingMachineItemHashTagsSchema {


    static sym = Symbol(VendingMachineItemHashTagsSchema.name);
    private VendingMachineItemHashTagsSchema: VendingMachineItemHashTagsModel
    public getSchema() {
        return this.VendingMachineItemHashTagsSchema;
    }
    constructor(
        @inject((MysqlConnection.sym)) protected mysqlcon: MysqlConnection
    ) {

        const _att =
        {
            item_id: {
                type: sequelize.BIGINT(20),
                primaryKey: true,
            },
            tag_id: {
                type: sequelize.BIGINT(20),
                primaryKey: true,
            },
            representation: {
                type: sequelize.TINYINT(1),
                allowNull: true
            }
        }
        this.VendingMachineItemHashTagsSchema = this.mysqlcon.getSequelize()
            .define<VendingMachineItemHashTagsInstance, VendingMachineItemHashTagsAttribute>('VendingMachineItemHashTags', _att,
                {
                    tableName: 'vending_machine_item_hash_tags',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface VendingMachineItemHashTagsAttribute {
    item_id: number;
    tag_id: number;
    representation?: number
    HashTag?: HashTagsAttribute
}
export interface VendingMachineItemHashTagsInstance extends sequelize.Instance<VendingMachineItemHashTagsAttribute>, VendingMachineItemHashTagsAttribute {
}
export interface VendingMachineItemHashTagsModel extends sequelize.Model<VendingMachineItemHashTagsInstance, VendingMachineItemHashTagsAttribute> { }