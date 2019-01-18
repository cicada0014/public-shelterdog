
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class VendingMachineItemCommentsSchema {


    static sym = Symbol(VendingMachineItemCommentsSchema.name);
    private VendingMachineItemCommentsSchema: VendingMachineItemCommentsModel
    public getSchema() {
        return this.VendingMachineItemCommentsSchema;
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
                allowNull: false
            },
            user_id: {
                type: sequelize.BIGINT(20),
                allowNull: false
            },
            content: {
                type: sequelize.TEXT,
                allowNull: true
            },
            parent: {
                type: sequelize.INTEGER(11),
                allowNull: true,
            },
            mention_id: {
                type: sequelize.BIGINT(20),
                allowNull: true,
            },
            status_code: {
                type: sequelize.SMALLINT(4),
                allowNull: true,
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
        this.VendingMachineItemCommentsSchema = this.mysqlcon.getSequelize()
            .define<VendingMachineItemCommentsInstance, VendingMachineItemCommentsAttribute>('VendingMachineItemComments', _att,
                {
                    tableName: 'vending_machine_item_comments',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface VendingMachineItemCommentsAttribute {
    id?: number;
    item_id?: number;
    user_id?: number;
    content?: string;
    parent?: number;
    mention_id?: number;
    status_code?:number;
    created_at?: any;
    updated_at?: any;

}
export interface VendingMachineItemCommentsInstance extends sequelize.Instance<VendingMachineItemCommentsAttribute>, VendingMachineItemCommentsAttribute {
}
export interface VendingMachineItemCommentsModel extends sequelize.Model<VendingMachineItemCommentsInstance, VendingMachineItemCommentsAttribute> { }