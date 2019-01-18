
import { injectable, inject } from "inversify";
import * as sequelize from 'sequelize';
import { MysqlConnection } from "../db/mysql.connection";
import { BannerItemsAttribute } from "./banner_items.schema";



@injectable()
export class BannerAreasSchema {


    static sym = Symbol(BannerAreasSchema.name);
    private BannerAreasSchema: BannerAreasModel
    public getSchema() {
        return this.BannerAreasSchema;
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
            name: {
                type: sequelize.STRING(50),
                allowNull: false
            },
            width: {
                type: sequelize.INTEGER(11),
                allowNull: true
            },
            height: {
                type: sequelize.INTEGER(11),
                allowNull: true
            },
            akey: {
                type: sequelize.STRING(20),
                allowNull: false,
                unique: true
            },
        }
        this.BannerAreasSchema = this.mysqlcon.getSequelize()
            .define<BannerAreasInstance, BannerAreasAttribute>('BannerAreas', _att,
                {
                    tableName: 'banner_areas',
                    timestamps: false,
                })

        // sync는 기존 데이터에 지대한 영향을 끼칠수 있으므로 사용하지 않는다.
    }
}

export interface BannerAreasAttribute {
    id?: number;
    width?: number;
    height?: number;
    name?: string;
    akey?: string;
    BannerItems?: BannerItemsAttribute[]
}
export interface BannerAreasInstance extends sequelize.Instance<BannerAreasAttribute>, BannerAreasAttribute {
}
export interface BannerAreasModel extends sequelize.Model<BannerAreasInstance, BannerAreasAttribute> { }