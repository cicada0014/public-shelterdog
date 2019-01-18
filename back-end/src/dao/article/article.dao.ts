import { injectable, inject } from "inversify";
import { RefugesSchema } from "../../schemata/refuges.schema";
import { RefugeArticlesSchema } from "../../schemata/refuge_articles.schema";
import { RefugeArticleCommentsSchema, RefugeArticleCommentsAttribute } from "../../schemata/refuge_article_comments.schema";
import { MysqlConnection } from "../../db/mysql.connection";
import { UserProfilesSchema } from "../../schemata/user_profile.shcema";
import { GRAPH_OBJECT_TYPE_ARTICLE, GRAPH_EDGE_TYPE_EMPATHY, GRAPH_EDGE_TYPE_REPORT, GRAPH_OBJECT_TYPE_COMMENT } from "../../types/types";
import { GraphDAO } from "../graph/graph.dao";
import { GraphObjectsSchema } from "../../schemata/graph_objects.schema";
import { GraphEdgesSchema } from "../../schemata/graph_edges.schema";







@injectable()
export class ArticleDAO {

    public static sym = Symbol(ArticleDAO.name);


    bestScore = 6;

    constructor(
        @inject(RefugesSchema.sym) private refugesSchema: RefugesSchema,
        @inject(RefugeArticlesSchema.sym) private refugeArticlesSchema: RefugeArticlesSchema,
        @inject(RefugeArticleCommentsSchema.sym) private refugeArticleCommentsSchema: RefugeArticleCommentsSchema,
        @inject(UserProfilesSchema.sym) private userProfileSchema: UserProfilesSchema,
        @inject(MysqlConnection.sym) private mysqlCon: MysqlConnection,
        @inject(GraphObjectsSchema.sym) private graphObjectsSchema: GraphObjectsSchema,
        @inject(GraphEdgesSchema.sym) private graphEdgesSchema: GraphEdgesSchema,
        @inject(GraphDAO.sym) private graphDAO: GraphDAO,
    ) {
        this.refugeArticlesSchema.getSchema().hasMany(this.refugeArticleCommentsSchema.getSchema(), { foreignKey: 'refuge_article_id' });
        this.refugeArticlesSchema.getSchema().belongsTo(this.refugesSchema.getSchema(), { foreignKey: 'refuge_id' });
        this.refugeArticleCommentsSchema.getSchema().belongsTo(this.userProfileSchema.getSchema(), { foreignKey: 'user_id' })
        this.refugeArticleCommentsSchema.getSchema().belongsTo(this.userProfileSchema.getSchemaOfMention(), { foreignKey: 'mention_id' })

        this.graphObjectsSchema.getSchema().hasMany(this.graphEdgesSchema.getSchema(), { foreignKey: 'to' })

    }

    public insertArticle({ title, content, user_id, anonymous, refuge_id, header_id, status_code }) {
        return this.refugeArticlesSchema.getSchema().create({ title, content, user_id, refuge_id, header_id, anonymous: anonymous ? 1 : null, status_code: status_code ? status_code : null });
    }


    public getListByStatusCode(status_code) {
        return this.refugeArticlesSchema.getSchema().findAll({ where: { status_code } });
    }

    public updateArticleStatus(id, status_code: number) {
        return this.refugeArticlesSchema.getSchema().update({ status_code }, { where: { id } })
    }


    public updateArticleHit(id, hit) {
        return this.refugeArticlesSchema.getSchema().update({ hit }, { where: { id } })
    }



    public updateArticle({ id, title, content, anonymous, header_id }) {
        return this.refugeArticlesSchema.getSchema().update({ title, content, anonymous: anonymous ? 1 : null, header_id }, { where: { id: id } })
    }

    public async deleteArticle(article_id) {
        try {
            await this.refugeArticlesSchema.getSchema().destroy({ where: { id: article_id } });
            await this.refugeArticleCommentsSchema.getSchema().destroy({ where: { refuge_article_id: article_id } });
            await this.graphDAO.deleteGraphObject(article_id, GRAPH_OBJECT_TYPE_ARTICLE)
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }



    public insertArticleComment({ refuge_article_id, user_id, content, parent, mention_id, status_code, anonymous, created_at }: RefugeArticleCommentsAttribute) {

        return this.refugeArticleCommentsSchema.getSchema().create({ refuge_article_id, user_id, content, parent, mention_id, status_code, anonymous: anonymous ? 1 : null, created_at })
    }

    public updateArticleComment(id, content, anonymous) {
        return this.refugeArticleCommentsSchema.getSchema().update({ content, anonymous: anonymous ? 1 : null }, { where: { id } })
    }


    public async deleteArticleComment(id, isParent) {
        try {
            if (isParent) {
                // ctc is Comment to Comment 대댓글이라는 뜻.
                // 대댓글은 어떤 댓글의 자식객체라고 보면된다. 
                // 따라서 대댓글이 아닌 부모댓글객체를 삭제 할 경우 자식객체들의 graph object까지 삭제를 해주어야 한다. 
                let ctcs = await this.refugeArticleCommentsSchema.getSchema().findAll({ where: { parent: id } });
                if (ctcs.length > 0) {
                    await this.graphDAO.deleteGraphObjectsMulti(
                        ctcs.map(ctc => ctc.id),
                        GRAPH_OBJECT_TYPE_COMMENT)
                }
            }
            await this.refugeArticleCommentsSchema.getSchema().destroy({ where: { $or: { id: id, parent: id } } });
            await this.graphDAO.deleteGraphObject(id, GRAPH_OBJECT_TYPE_COMMENT)
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }



    public updateHitOfArticle(article_id) {
        return this.mysqlCon.getSequelize().query(`
        UPDATE refuge_articles  SET hit = hit+1  WHERE id = ?
        `,{replacements:[article_id]})
    }


    // count(distinct(rac.id)) comment_count,
    //sum(CASE WHEN e.type = '${GRAPH_EDGE_TYPE_EMPATHY}' THEN 1 WHEN e.type = '${GRAPH_EDGE_TYPE_REPORT}' THEN -5  end ) score ,  


    public getMyArticles(user_id, rows, first) {
        return this.refugeArticlesSchema.getSchema().findAll({
            where: {
                user_id
            },
            include: [
                // 댓글 수를 얻기 위해
                {
                    model: this.refugeArticleCommentsSchema.getSchema(),
                    attributes: ['id']
                },
                // 공감수를 얻기 위해
                {
                    required: false,
                    model: this.graphObjectsSchema.getSchema(),
                    where: { type: GRAPH_OBJECT_TYPE_ARTICLE },
                    include: [
                        {
                            required: false,
                            model: this.graphEdgesSchema.getSchema(),
                            where: {
                                type: GRAPH_EDGE_TYPE_EMPATHY
                            }
                        }
                    ]
                }
            ],
            order: [
                ['id', 'desc']
            ],
            limit: parseInt(rows),
            offset: parseInt(first)
        })
    }


    // 베스트 도피처는 이녀석을 보고 있는 거였나?
    public async getBestArticlesInGlobal(first, rows) {

        // 나중에 데이터가 많이 쌓이면 그냥 토탈은 박아두고 시작하면 될듯
        let totalCount = await this.mysqlCon.getSequelize().query(`
        SELECT count(*) value FROM
        (
            SELECT
            sum(CASE WHEN e.type = '${GRAPH_EDGE_TYPE_EMPATHY}' THEN 1 WHEN e.type = '${GRAPH_EDGE_TYPE_REPORT}' THEN -5  end ) / IF(count(distinct(rac.id)) = 0 , 1, count(distinct(rac.id)) )   score  
            FROM graph_objects  o  
            INNER JOIN graph_edges e
            ON o.id = e.to AND o.type = '${GRAPH_OBJECT_TYPE_ARTICLE}' AND  (e.type = '${GRAPH_EDGE_TYPE_EMPATHY}' OR e.type='${GRAPH_EDGE_TYPE_REPORT}') 
            INNER JOIN refuge_articles ra
            ON o.ref_id = ra.id AND ra.status_code IS NULL
			INNER JOIN refuges rf
			ON ra.refuge_id = rf.id AND rf.active IS NOT NULL
            LEFT JOIN refuge_article_comments rac
			ON ra.id = rac.refuge_article_id
            GROUP BY ref_id 
            HAVING score > ?
        ) as target
        `,{replacements:[this.bestScore]});


        let result = await this.mysqlCon.getSequelize().query(`
        SELECT 
         sum((e.type = '${GRAPH_EDGE_TYPE_EMPATHY}')  ) / IF(count(distinct(rac.id)) = 0 , 1, count(distinct(rac.id)) ) empathy_count, 
         sum(CASE WHEN e.type = '${GRAPH_EDGE_TYPE_EMPATHY}' THEN 1 WHEN e.type = '${GRAPH_EDGE_TYPE_REPORT}' THEN -5  end ) / IF(count(distinct(rac.id)) = 0 , 1, count(distinct(rac.id)) )   score  ,  
         count(distinct(rac.id)) comment_count ,
         ref_id id ,  
         ra.created_at created_at  ,
         ra.title title,
         ra.anonymous anonymous,
         ra.content content,
         ra.user_id user_id, 
         ra.hit hit  ,
         rf.name refuge_name,
         up.nickname
        FROM graph_objects  o  
        INNER JOIN graph_edges e
        ON o.id = e.to AND o.type = '${GRAPH_OBJECT_TYPE_ARTICLE}' AND  (e.type = '${GRAPH_EDGE_TYPE_EMPATHY}' OR e.type='${GRAPH_EDGE_TYPE_REPORT}') 
        INNER JOIN refuge_articles ra 
        ON o.ref_id = ra.id AND ra.status_code IS NULL
        INNER JOIN refuges rf 
        ON ra.refuge_id = rf.id AND rf.active IS NOT NULL
        INNER JOIN user_profiles up 
        ON ra.user_id = up.id
        LEFT JOIN refuge_article_comments rac 
        ON ra.id = rac.refuge_article_id
        GROUP BY ref_id 
        HAVING score > ?
        ORDER BY ra.created_at DESC
        LIMIT ${parseInt(rows)}
        OFFSET ${parseInt(first)};
        `,{replacements:[this.bestScore]})

        return {
            result,
            totalCount
        }
    }




    public getArticleCreatedAt(id) {
        return this.refugeArticlesSchema.getSchema().findById(id, {
            attributes: ['created_at']
        })
    }

    public getLastArticleComment(refuge_article_id) {
        return this.refugeArticleCommentsSchema.getSchema().findAll({
            where: { refuge_article_id },
            order: [['id', 'desc']],
            limit: 1
        })
    }


    public getCommentSimple(id) {
        return this.refugeArticleCommentsSchema.getSchema().findById(id);
    }

    public getArticleSimple(id) {
        return this.refugeArticlesSchema.getSchema().findById(id);
    }

    public getArticle(id) {
        return this.refugeArticlesSchema.getSchema().findById(id, {
            include: [
                { model: this.userProfileSchema.getSchema() },
                { model: this.refugesSchema.getSchema() },
                {
                    model: this.refugeArticleCommentsSchema.getSchema(),
                    include: [
                        { model: this.userProfileSchema.getSchema(), attributes: ['nickname'], required: false },
                        { model: this.userProfileSchema.getSchemaOfMention(), attributes: ['nickname'], required: false },
                    ]
                }
            ],
            // order: [['`RefugeArticleComments`.`parent`', 'asc'], ['`RefugeArticleComments`.`created_at`', 'asc']]
            order: [
                this.mysqlCon.getSequelize().literal('IF(ISNULL(`RefugeArticleComments`.`parent`),`RefugeArticleComments`.`id`,`RefugeArticleComments`.`parent`)'),
                this.mysqlCon.getSequelize().literal('`RefugeArticleComments`.`created_at`')
            ]
        });
    }

    public getMyArticlesCount(user_id) {
        return this.refugeArticlesSchema.getSchema().count({
            where: {
                user_id
            }
        })
    }



    public getLatestArticleByUserId(user_id) {
        return this.refugeArticlesSchema.getSchema().findOne({
            where: {
                user_id
            },
            order: [['created_at', 'desc']]
        })
    }

    public getLastestArticleCommentByUserId(user_id) {
        return this.refugeArticleCommentsSchema.getSchema().findOne({
            where: {
                user_id
            },
            order: [['created_at', 'desc']]
        })
    }



}

