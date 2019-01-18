import { injectable, inject } from "inversify";
import { MysqlConnection } from "../../db/mysql.connection";
import { CategoriesSchema } from "../../schemata/categories.schema";







@injectable()
export class CategoryDAO {

    public static sym = Symbol(CategoryDAO.name);

    constructor(
        @inject(MysqlConnection.sym) private mysqlCon: MysqlConnection,
        @inject(CategoriesSchema.sym) private categorySchema: CategoriesSchema,


    ) {
    }






    public async createCategory(ct) {
        delete ct.id;
        return this.categorySchema.getSchema().create(ct)
    }
    public async updateCategory(ct) {
        return this.categorySchema.getSchema().update(ct, { where: { id: ct.id } })
    }






}