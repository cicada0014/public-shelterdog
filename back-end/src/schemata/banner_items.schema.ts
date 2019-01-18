
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";



@injectable()
export class BannerItemsSchema {


    static sym = Symbol(BannerItemsSchema.name);
    private BannerItemsSchema: BannerItemsModel
    public getSchema() {
        return this.BannerItemsSchema;
    }
    constructor(
        @inject((MysqlConnection.sym)) protected mysqlcon: MysqlConnection
    ) {

        const _att =
        {
            id: {
                type: sequelize.BIGINT(20),
                primaryKey: true,
            },
            area_id: {
                type: sequelize.BIGINT(20),
                allowNull: false
            },
            image_url: {
                type: sequelize.STRING(300),
                allowNull: false
            },
            active: {
                type: sequelize.TINYINT(1),
                allowNull: true
            },
            priority: {
                type: sequelize.INTEGER(11),
                allowNull: true,
                default: 999
            },
            target: {
                type: sequelize.STRING(2000),
                allowNull: true
            },
        }
        this.BannerItemsSchema = this.mysqlcon.getSequelize()
            .define<BannerItemsInstance, BannerItemsAttribute>('BannerItems', _att,
                {
                    tableName: 'banner_items',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface BannerItemsAttribute {
    id?: number;
    area_id?: number;
    image_url?: string;
    active?: boolean;
    target?: string;
    priority?: number;
}
export interface BannerItemsInstance extends sequelize.Instance<BannerItemsAttribute>, BannerItemsAttribute {
}
export interface BannerItemsModel extends sequelize.Model<BannerItemsInstance, BannerItemsAttribute> { }