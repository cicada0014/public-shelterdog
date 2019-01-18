
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class VendingMachineItemPagesSchema {


    static sym = Symbol(VendingMachineItemPagesSchema.name);
    private VendingMachineItemPagesSchema: VendingMachineItemPagesModel
    public getSchema() {
        return this.VendingMachineItemPagesSchema;
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
            item_id: {
                type: sequelize.BIGINT(20),
                allowNull: false,
            },
            url: {
                type: sequelize.STRING(500),
                allowNull: false,
            },
            meta: {
                type: sequelize.TEXT,
                allowNull: true,
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
        this.VendingMachineItemPagesSchema = this.mysqlcon.getSequelize()
            .define<VendingMachineItemPagesInstance, VendingMachineItemPagesAttribute>('VendingMachineItemPages', _att,
                {
                    tableName: 'vending_machine_item_pages',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface VendingMachineItemPagesAttribute {
    id?: number;
    item_id: number;
    url: string;
    meta?: string;
    created_at?: any;
    updated_at?: any;
}
export interface VendingMachineItemPagesInstance extends sequelize.Instance<VendingMachineItemPagesAttribute>, VendingMachineItemPagesAttribute {
}
export interface VendingMachineItemPagesModel extends sequelize.Model<VendingMachineItemPagesInstance, VendingMachineItemPagesAttribute> { }