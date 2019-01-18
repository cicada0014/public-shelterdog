import { injectable, inject } from "inversify";
import { MysqlConnection } from "../../db/mysql.connection";
import { PodcastsSchema } from "../../schemata/podcasts.schema";







@injectable()
export class PodcastDAO {

    public static sym = Symbol(PodcastDAO.name);

    constructor(
        @inject(MysqlConnection.sym) private mysqlCon: MysqlConnection,
        @inject(PodcastsSchema.sym) private podcastSchema: PodcastsSchema,


    ) {

    }
    public getList() {
        return this.podcastSchema.getSchema().findAll({
            order: [['id', 'desc']]
        })
    }

    public getLatest() {
        return this.podcastSchema.getSchema().findOne({ order: [['id', 'desc']] });
    }




    // public createPodcast(Podcast: PodcastsAttribute) {
    //     delete Podcast.id
    //     return this.PodcastSchema.getSchema().create(Podcast)
    // }

    // public updatePodcast(Podcast: PodcastsAttribute) {
    //     delete Podcast.created_at
    //     delete Podcast.updated_at
    //     return this.PodcastSchema.getSchema().update(Podcast, { where: { id: Podcast.id } })
    // }


}