
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";
import { VendingMachineItemHashTagsAttribute } from "./vending_machine_item_hash_tags.schema";
import { VendingMachineItemCommentsAttribute } from "./vending_machine_item_comments.schema";



@injectable()
export class VendingMachineItemsSchema {


    static sym = Symbol(VendingMachineItemsSchema.name);
    private VendingMachineItemsSchema: VendingMachineItemsModel
    public getSchema() {
        return this.VendingMachineItemsSchema;
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
            category_id: {
                type: sequelize.BIGINT(20),
                allowNull: false,
            },
            title: {
                type: sequelize.STRING(50),
                allowNull: false,
            },
            thumbnail: {
                type: sequelize.STRING(500),
                allowNull: false,
            },
            script: {
                type: sequelize.TEXT,
                allowNull: false,
            },
            meta: {
                type: sequelize.STRING(2000),
                allowNull: true,
            },
            hit: {
                type: sequelize.BIGINT(20),
                allowNull: true,
                default: 0
            },
            active: {
                type: sequelize.TINYINT(1),
                allowNull: true,
                default: null
            },
            created_at: {
                type: sequelize.TIME,
                allowNull: true,
            },
            updated_at: {
                type: sequelize.TIME,
                allowNull: true,
            }
        }
        this.VendingMachineItemsSchema = this.mysqlcon.getSequelize()
            .define<VendingMachineItemsInstance, VendingMachineItemsAttribute>('VendingMachineItems', _att,
                {
                    tableName: 'vending_machine_items',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface VendingMachineItemsAttribute {
    id?: number;
    category_id: number;
    title: string;
    thumbnail: string;
    script: string;
    meta?: string;
    hit?: number;
    active?: number;
    created_at?: any;
    updated_at?: any;
    VendingMachineItemComments?: VendingMachineItemCommentsAttribute[];
    VendingMachineItemHashTags?: VendingMachineItemHashTagsAttribute[];
}
export interface VendingMachineItemsInstance extends sequelize.Instance<VendingMachineItemsAttribute>, VendingMachineItemsAttribute {
}
export interface VendingMachineItemsModel extends sequelize.Model<VendingMachineItemsInstance, VendingMachineItemsAttribute> { }