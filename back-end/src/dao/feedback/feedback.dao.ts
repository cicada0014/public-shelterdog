import { injectable, inject } from "inversify";
import { MysqlConnection } from "../../db/mysql.connection";
import { FeedbacksSchema, FeedbacksAttribute } from "../../schemata/feedbacks.schema";







@injectable()
export class FeedbackDAO {

    public static sym = Symbol(FeedbackDAO.name);

    constructor(
        @inject(MysqlConnection.sym) private mysqlCon: MysqlConnection,
        @inject(FeedbacksSchema.sym) private feedbackSchema: FeedbacksSchema,


    ) {
    }


    public getRunnerGameEndingCount() {
        return this.feedbackSchema.getSchema().count({ where: { type: 'g-runner' } })
    }

    public async createFeedback(item: FeedbacksAttribute) {
        return this.feedbackSchema.getSchema().upsert(item)
    }


    public getStatisticsDaily(startDate, endDate, type) {
        return this.feedbackSchema.getSchema().findAll({
            where: {
                type,
                created_at: {
                    $and: {
                        $gt: startDate,
                        $lt: endDate
                    }
                }
            }
        })

    }


}