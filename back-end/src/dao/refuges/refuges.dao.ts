import { injectable, inject } from "inversify";
import { RefugesSchema } from "../../schemata/refuges.schema";
import { RefugeArticlesSchema } from "../../schemata/refuge_articles.schema";
import { RefugeArticleCommentsSchema } from "../../schemata/refuge_article_comments.schema";
import { RefugeRequestsSchema } from "../../schemata/refuge_request.schema";
import { CategoriesSchema } from "../../schemata/categories.schema";
import { Op } from "sequelize";
import { UserProfilesSchema } from "../../schemata/user_profile.shcema";
import { GraphObjectsSchema } from "../../schemata/graph_objects.schema";
import { GraphEdgesSchema } from "../../schemata/graph_edges.schema";
import { GRAPH_OBJECT_TYPE_ARTICLE, GRAPH_EDGE_TYPE_EMPATHY, GRAPH_OBJECT_TYPE_REFUGE_REQUEST, GRAPH_EDGE_TYPE_REPORT } from "../../types/types";
import { MysqlConnection } from "../../db/mysql.connection";







@injectable()
export class RefugesDAO {

    public static sym = Symbol(RefugesDAO.name);

    constructor(
        @inject(RefugesSchema.sym) private refugesSchema: RefugesSchema,
        @inject(RefugeArticlesSchema.sym) private refugeArticlesSchema: RefugeArticlesSchema,
        @inject(RefugeArticleCommentsSchema.sym) private refugeArticleCommentsSchema: RefugeArticleCommentsSchema,
        @inject(RefugeRequestsSchema.sym) private refugeRequestsSchema: RefugeRequestsSchema,
        @inject(CategoriesSchema.sym) private categoriesSchema: CategoriesSchema,
        @inject(UserProfilesSchema.sym) private userProfilesSchema: UserProfilesSchema,
        @inject(GraphObjectsSchema.sym) private graphObjectsSchema: GraphObjectsSchema,
        @inject(GraphEdgesSchema.sym) private graphEdgesSchema: GraphEdgesSchema,
        @inject(MysqlConnection.sym) private mysqlCon: MysqlConnection,
    ) {

        this.categoriesSchema.getSchema().hasMany(this.refugesSchema.getSchema(), { foreignKey: 'category_id' });
        this.refugesSchema.getSchema().hasMany(this.refugeArticlesSchema.getSchema(), { foreignKey: 'refuge_id' })
        this.refugeArticlesSchema.getSchema().hasMany(this.refugeArticleCommentsSchema.getSchema(), { foreignKey: 'refuge_article_id' })
        this.refugeArticlesSchema.getSchema().belongsTo(this.userProfilesSchema.getSchema(), { foreignKey: 'user_id' });
        this.refugeArticlesSchema.getSchema().belongsTo(this.graphObjectsSchema.getSchema(), { foreignKey: 'id', targetKey: 'ref_id' });

        this.graphObjectsSchema.getSchema().hasMany(this.graphEdgesSchema.getSchema(), { foreignKey: 'to' })
        this.refugeArticlesSchema.getSchema().hasMany(this.refugeArticleCommentsSchema.getSchema(), { foreignKey: 'refuge_article_id' });


        this.refugeRequestsSchema.getSchema().belongsTo(this.userProfilesSchema.getSchema(), { foreignKey: 'user_id' });
        this.refugeRequestsSchema.getSchema().belongsTo(this.graphObjectsSchema.getSchema(), { foreignKey: 'id', targetKey: 'ref_id' });
    }



    public getList() {
        return this.refugesSchema.getSchema().findAll({ where: { active: { $ne: null } } });
    }


    public getCategoires() {
        return this.categoriesSchema.getSchema().findAll();
    }

    public getListByCategory() {
        return this.categoriesSchema.getSchema().findAll({
            include: [
                { required: false, model: this.refugesSchema.getSchema(), where: { active: { [Op.ne]: null } } }
            ]
        })
    }




    public createRequest(user_id, content, status) {
        return this.refugeRequestsSchema.getSchema().create({
            user_id,
            content,
            status
        });
    }
    public getTotalRequestCount() {
        return this.refugeRequestsSchema.getSchema().findAndCountAll()
    }

    public getRequestByUserIdOne(user_id) {
        return this.refugeRequestsSchema.getSchema().findOne({
            where: {
                user_id
            },
            order: [['created_at', 'desc']]
        })
    }

    public getRequests(first, rows) {
        return this.refugeRequestsSchema.getSchema().findAll({
            include: [
                // 닉네임을 얻기위해서
                { required: true, model: this.userProfilesSchema.getSchema(), attributes: ['nickname'] },
                // 공감수를 얻기 위해
                {
                    required: false,
                    model: this.graphObjectsSchema.getSchema(),
                    where: { type: GRAPH_OBJECT_TYPE_REFUGE_REQUEST },
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
            order: [['id', 'desc']],
            limit: parseInt(rows),
            offset: parseInt(first)
        });
    }





    // 인기 도피처를 찾고 거기에서 인기있는 게시글을 보냅니다.
    public async getBestArticlesInPopularRefuges(first, rows) {

        const rank = await this.mysqlCon.getSequelize().query(`
        SELECT count(*) count, refuge_id , rf.name refuge_name ,rf.meta meta  FROM refuge_articles ra INNER JOIN refuges rf ON ra.refuge_id = rf.id AND rf.active IS NOT NULL GROUP BY refuge_id ORDER BY count desc LIMIT 4 ;
        `)
        let popularRefugesInfo: { count: number, refuge_id: number, articles: any[] }[] = rank[0];
        for (let info of popularRefugesInfo) {
            let result = await this.mysqlCon.getSequelize().query(`
                SELECT 
                 sum(CASE WHEN e.type = '${GRAPH_EDGE_TYPE_EMPATHY}' THEN 1 WHEN e.type = '${GRAPH_EDGE_TYPE_REPORT}' THEN -5  end ) score ,  
                 ref_id id ,  
                 ra.created_at created_at  ,
                 ra.title title,
                 ra.anonymous anonymous,
                 ra.content content,
                 ra.user_id user_id, 
                 ra.hit hit  ,
                 count(distinct(rac.id) ) comment_count,
                 rf.name refuge_name
                FROM graph_objects  o  
                INNER JOIN graph_edges e
                ON o.id = e.to AND o.type = '${GRAPH_OBJECT_TYPE_ARTICLE}' AND  (e.type = '${GRAPH_EDGE_TYPE_EMPATHY}' OR e.type='${GRAPH_EDGE_TYPE_REPORT}') 
                INNER JOIN refuge_articles ra 
                ON o.ref_id = ra.id AND ra.status_code IS NULL
                INNER JOIN refuge_article_comments rac
                ON ra.id = rac.refuge_article_id
                INNER JOIN refuges rf 
                ON ra.refuge_id = rf.id AND refuge_id = ?
                GROUP BY ref_id 
                HAVING score > 6
                ORDER BY ra.created_at DESC
                LIMIT ${parseInt(rows)}
                OFFSET ${parseInt(first)};
                `,{replacements:[info.refuge_id]})

            info.articles = result[0]
        }
        return popularRefugesInfo






        // return this.refugesSchema.getSchema().findAll({
        //     where: {
        //         id: { [Op.in]: [popularRefugesInfo.map(info => info.refuge_id)] }
        //     },
        //     include: [
        //         { model: this.refugeArticlesSchema.getSchema() }
        //     ]
        // });
    }

    // 도피처에서 베스트인녀석들을 골라 보내줍니다.
    public async getBestArticlesOfRefuge(refuge_id, first, rows) {
        return this.mysqlCon.getSequelize().query(`
                SELECT 
                sum((e.type = '${GRAPH_EDGE_TYPE_EMPATHY}')  ) / IF(count(distinct(rac.id)) = 0 , 1, count(distinct(rac.id)) ) empathy_count, 
                 sum(CASE WHEN e.type = '${GRAPH_EDGE_TYPE_EMPATHY}' THEN 1 end ) / IF(count(distinct(rac.id)) = 0 , 1, count(distinct(rac.id)) )  score ,  
                 count(distinct(rac.id)) comment_count ,
                 ref_id id ,  
                 ra.created_at created_at  ,
                 ra.anonymous anonymous,
                 ra.title title,
                 ra.content content,
                 ra.user_id user_id, 
                 ra.hit hit  ,
                 rf.name refuge_name,
                 up.nickname
                FROM graph_objects  o  
                INNER JOIN graph_edges e
                ON o.id = e.to AND o.type = '${GRAPH_OBJECT_TYPE_ARTICLE}' AND  (e.type = '${GRAPH_EDGE_TYPE_EMPATHY}') 
                INNER JOIN refuge_articles ra 
                ON o.ref_id = ra.id AND ra.status_code IS NULL
                INNER JOIN refuges rf 
                ON ra.refuge_id = rf.id AND refuge_id = ?
                INNER JOIN user_profiles up 
                ON ra.user_id = up.id
                LEFT JOIN refuge_article_comments rac 
                ON ra.id = rac.refuge_article_id
                GROUP BY ref_id 
                ORDER BY score DESC , ra.created_at DESC
                LIMIT ${parseInt(rows)}
                OFFSET ${parseInt(first)};
                `,{replacements:[refuge_id]})

    }



    public getNoticeOfRefuge(refuge_id) {
        return this.refugeArticlesSchema.getSchema().findAll({
            where: {
                refuge_id,
                status_code: 999
            },
            include: [
                // 닉네임을 얻기위해서
                { required: true, model: this.userProfilesSchema.getSchema() },
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
            // offset: parseInt(first)
        })
    }


    public getArticlesOfRefuge(refuge_id, first: string, rows: string) {
        return this.refugeArticlesSchema.getSchema().findAll({
            where: {
                refuge_id,
                status_code: null
            },
            include: [
                // 닉네임을 얻기위해서
                { required: true, model: this.userProfilesSchema.getSchema() },
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


    public getRefuge(id) {
        return this.refugesSchema.getSchema().find({
            where: { id, active: { $ne: null } },
            include: [
                {
                    model: this.refugeArticlesSchema.getSchema(),
                    attributes: ['id'],
                    required: false
                },
            ]
        });
    }

    ////////////////////////////// admin //////////////////////////////

    public createRefuge({ name, meta, category_id, active }) {
        return this.refugesSchema.getSchema().create({ name, meta, category_id, active: active ? active : null })
    }

    public updateRefuge({ name, meta, id, category_id, active }) {
        return this.refugesSchema.getSchema().update({ name, meta, category_id, active: active ? active : null }, { where: { id } })
    }







}