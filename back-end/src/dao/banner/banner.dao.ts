import { injectable, inject } from "inversify";
import { MysqlConnection } from "../../db/mysql.connection";
import { BannerAreasSchema, BannerAreasAttribute } from "../../schemata/banner_areas.schema";
import { BannerItemsSchema } from "../../schemata/banner_items.schema";
import { model } from "mongoose";







@injectable()
export class BannerDAO {

    public static sym = Symbol(BannerDAO.name);

    constructor(
        @inject(MysqlConnection.sym) private mysqlCon: MysqlConnection,
        @inject(BannerAreasSchema.sym) private areaSchema: BannerAreasSchema,
        @inject(BannerItemsSchema.sym) private itemSchema: BannerItemsSchema,


    ) {
        this.areaSchema.getSchema().hasMany(this.itemSchema.getSchema(), { foreignKey: 'area_id' });
    }






    public async getAreaList() {
        return this.areaSchema.getSchema().findAll({ include: [this.itemSchema.getSchema()] });
    }

    public getArea(akey) {
        return this.areaSchema
            .getSchema()
            .find({
                where: {
                    akey
                },
                include: [
                    { model: this.itemSchema.getSchema(), required: true, where: { active: true } }
                ]
            })
    }

    public createArea(area: BannerAreasAttribute) {
        delete area.id;
        return this.areaSchema.getSchema().create(area);
    }
    public updateArea(area: BannerAreasAttribute) {
        return this.mysqlCon.getSequelize().transaction((t) => {
            let promoises: any[] = [];
            promoises.push(this.areaSchema.getSchema().update(area, { where: { id: area.id } }));
            area.BannerItems.forEach((bItem) => {
                promoises.push(this.itemSchema.getSchema().upsert(bItem));
            })
            return Promise.all(promoises);
        })



    }







}