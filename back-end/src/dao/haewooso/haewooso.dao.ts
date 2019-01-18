import { injectable, inject } from "inversify";
import { MysqlConnection } from "../../db/mysql.connection";
import { HaewoosoArticlesSchema, HaewoosoArticlesAttribute } from "../../schemata/haewooso_articles.schema";
import { HaewoosoArticleCommentsSchema, HaewoosoArticleCommentsAttribute } from "../../schemata/haewooso_article_comments.schema";

import moment from 'moment';
import { GraphObjectsSchema } from "../../schemata/graph_objects.schema";
import { GRAPH_OBJECT_TYPE_HAEWOOSO_ARTICLE, GRAPH_EDGE_TYPE_EMPATHY, GRAPH_OBJECT_TYPE_USER } from "../../types/types";
import { GraphEdgesSchema } from "../../schemata/graph_edges.schema";
import { UsersSchema } from "../../schemata/users.schema";
import { GraphDAO } from "../graph/graph.dao";





@injectable()
export class HaewoosoDAO {

    public static sym = Symbol(HaewoosoDAO.name);

    constructor(
        @inject(MysqlConnection.sym) private mysqlCon: MysqlConnection,
        @inject(HaewoosoArticlesSchema.sym) private articleSchema: HaewoosoArticlesSchema,
        @inject(HaewoosoArticleCommentsSchema.sym) private commentsSchema: HaewoosoArticleCommentsSchema,
        @inject(GraphObjectsSchema.sym) private graphObjectsSchema: GraphObjectsSchema,
        @inject(GraphEdgesSchema.sym) private graphEdgesSchema: GraphEdgesSchema,
        @inject(GraphDAO.sym) private graphDAO: GraphDAO,


    ) {

        this.articleSchema.getSchema().hasMany(this.commentsSchema.getSchema(), { foreignKey: 'haewooso_article_id' });

        this.articleSchema.getSchema().belongsTo(this.graphObjectsSchema.getSchema(), { foreignKey: 'id', targetKey: 'ref_id' });
    }



    public insertArticle(article: HaewoosoArticlesAttribute) {
        return this.articleSchema.getSchema().create(article)
    }


    public insertArticleComment(comment: HaewoosoArticleCommentsAttribute) {
        return this.commentsSchema.getSchema().create(comment);
    }



    public getDelTargetArticles() {
        return this.articleSchema.getSchema().findAll({
            where: {
                created_at: {
                    $lte: moment().subtract(1, 'd').format('YYYY-MM-DD HH:mm:ss')
                }
            }
        });
    }


    public async deleteHaewoosoArticleBySchduler(targets: HaewoosoArticlesAttribute[]) {
        try {
            await this.articleSchema.getSchema().destroy({ where: { id: { $in: targets.map(target => target.id) } } });
            await this.commentsSchema.getSchema().destroy({ where: { haewooso_article_id: { $in: targets.map(target => target.id) } } });
            await this.graphDAO.deleteGraphObjectsMulti(targets.map(target => target.id), GRAPH_OBJECT_TYPE_HAEWOOSO_ARTICLE)
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }




    public getArtcile(id) {
        return this.articleSchema.getSchema().findById(id);
    }

    public getArticles(rows: string, first: string, user_id?) {

        let findOption = {
            include: [
                // 댓글 수를 얻기 위해
                {
                    model: this.commentsSchema.getSchema(),
                    // attributes: ['id',]
                },
                // 공감수를 얻기 위해
                {
                    required: false,
                    model: this.graphObjectsSchema.getSchema(),
                    where: { type: GRAPH_OBJECT_TYPE_HAEWOOSO_ARTICLE },
                    include: [
                        {
                            required: false,
                            model: this.graphEdgesSchema.getSchema(),
                            where: {
                                type: GRAPH_EDGE_TYPE_EMPATHY
                            },
                        }
                    ]
                }
            ],
            order: [
                ['id', 'desc']
            ],
            limit: parseInt(rows),
            offset: parseInt(first)
        }




        if (user_id) {
            (findOption.include[1].include[0] as any).include = [
                {
                    required: false,
                    model: this.graphObjectsSchema.getSchema(),
                    where: {
                        type: GRAPH_OBJECT_TYPE_USER,
                        ref_id: user_id

                    },
                }
            ]
        }
        return this.articleSchema.getSchema().findAll(findOption)


    }



    public async deleteArticle(article_id) {
        try {
            await this.articleSchema.getSchema().destroy({ where: { id: article_id } });
            await this.commentsSchema.getSchema().destroy({ where: { haewooso_article_id: article_id } });
            await this.graphDAO.deleteGraphObject(article_id, GRAPH_OBJECT_TYPE_HAEWOOSO_ARTICLE)
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }


    public deleteComment(comment_id) {
        return this.commentsSchema.getSchema().destroy({ where: { id: comment_id } });
    }



}