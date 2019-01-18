import { injectable, inject } from "inversify";
import { MysqlConnection } from "../../db/mysql.connection";
import { GraphEdgesSchema } from "../../schemata/graph_edges.schema";
import { GraphEdgesSchema as MongoDBGraphEdgesSchema } from "../../schemata/mongodb/graph_edges.schema";
import { GraphObjectsSchema } from "../../schemata/graph_objects.schema";
import { Op } from 'sequelize'
import { GraphObjectsSchema as MongoDBGraphObjectsSchema } from "../../schemata/mongodb/graph_objects.schema";
import { GRAPH_OBJECT_TYPE_USER, GRAPH_OBJECT_TYPE_ARTICLE, GRAPH_EDGE_TYPE_EMPATHY, GRAPH_EDGE_TYPE_REPORT, GRAPH_OBJECT_TYPE_REFUGE_REQUEST, GRAPH_OBJECT_TYPE_COMMENT } from "../../types/types";







@injectable()
export class GraphDAO {

    public static sym = Symbol(GraphDAO.name);

    constructor(
        @inject(MysqlConnection.sym) private mysqlCon: MysqlConnection,
        @inject(GraphEdgesSchema.sym) private graphEdgesSchema: GraphEdgesSchema,
        @inject(GraphObjectsSchema.sym) private graphObjectsSchema: GraphObjectsSchema,
        // @inject(MongoDBGraphObjectsSchema.sym) private mongoGraphObjectsSchema: MongoDBGraphObjectsSchema,
        // @inject(MongoDBGraphEdgesSchema.sym) private mongoGraphEdgesSchema: MongoDBGraphEdgesSchema,


    ) {



        // 그래프 오브젝트와 엣지간의 연관성 정리 
        // edge의 from (통상적으로 이 그래프를 생성한 사람)은 object에 속한다.  1 :1 
        // object는 수많은 edge to 가 된다. 1: N 적절히씁시당
        // this.graphObjectsSchema.getSchema().hasMany(this.graphEdgesSchema.getSchema(), { foreignKey: 'to' })
        this.graphEdgesSchema.getSchema().belongsTo(this.graphObjectsSchema.getSchema(), { foreignKey: 'from', targetKey: 'id' })
    }





    // public readGraphObjectInMongo() {
    //     return this.mongoGraphObjectsSchema.getSchema().find({ type: 'USER', ref_id: 1 })
    // }


    public async deleteGraphObject(ref_id, type) {
        try {
            const founded = await this.graphObjectsSchema.getSchema().find({ where: { ref_id, type } });

            if (founded) {
                await this.graphObjectsSchema.getSchema().destroy({ where: { id: founded.id } });
                await this.graphEdgesSchema.getSchema().destroy({ where: { [Op.or]: { to: founded.id, from: founded.id } } })
                return true
            } else {
                return false
            }
        } catch (e) {
            console.error(e)
            return
        }
    }

    public async deleteGraphObjectsMulti(targetRefIdArray: Array<any>, type) {
        try {
            const founded = await this.graphObjectsSchema.getSchema().findAll({
                where: {
                    ref_id: {
                        $in: targetRefIdArray
                    },
                    type
                }
            });
            let promises: any[] = [];

            if (founded) {
                founded.forEach(target => {
                    promises.push(this.graphObjectsSchema.getSchema().destroy({ where: { id: target.id } }));
                    promises.push(this.graphEdgesSchema.getSchema().destroy({ where: { [Op.or]: { to: target.id, from: target.id } } }));
                })
                return Promise.all(promises)
            } else {
                return false
            }
        } catch (e) {
            console.error(e)
            return
        }
    }









    public createGraphObject(ref_id, type) {
        return this.graphObjectsSchema.getSchema().create({ type, ref_id });
    }



    public async checkUserEmpathizeArticle(user_id, article_id) {
        try {
            let userObject = await this.graphObjectsSchema.getSchema().find({
                where: {
                    type: GRAPH_OBJECT_TYPE_USER,
                    ref_id: user_id
                }
            })
            if (!userObject) {
                userObject = await this.graphObjectsSchema.getSchema().create({
                    type: GRAPH_OBJECT_TYPE_USER,
                    ref_id: user_id
                })
            }
            let articleObject = await this.graphObjectsSchema.getSchema().find({
                where: {
                    type: GRAPH_OBJECT_TYPE_ARTICLE,
                    ref_id: article_id
                }
            })
            if (!articleObject) {
                articleObject = await this.graphObjectsSchema.getSchema().create({
                    type: GRAPH_OBJECT_TYPE_ARTICLE,
                    ref_id: article_id
                })
            }

            const result = await this.graphEdgesSchema.getSchema().find({
                where: {
                    type: GRAPH_EDGE_TYPE_EMPATHY,
                    from: userObject.id,
                    to: articleObject.id
                }
            })

            return result ? result.id : false;

        } catch (e) {
            console.error(e);
            throw new Error(e);
        }

    }


    public async deleteEmpathyGraph(empathyEdgeId) {
        return this.graphEdgesSchema.getSchema().destroy({
            where: {
                id: empathyEdgeId
            }
        })
    }




    public async createReportGraph(user_id, target_id, targetType) {
        try {
            let userObject = await this.graphObjectsSchema.getSchema().find({
                where: {
                    type: GRAPH_OBJECT_TYPE_USER,
                    ref_id: user_id
                }
            })
            if (!userObject) {
                userObject = await this.graphObjectsSchema.getSchema().create({
                    type: GRAPH_OBJECT_TYPE_USER,
                    ref_id: user_id
                })
            }
            let targetObject;
            targetObject = await this.graphObjectsSchema.getSchema().find({
                where: {
                    type: targetType,
                    ref_id: target_id
                }
            })
            if (!targetObject) {
                targetObject = await this.graphObjectsSchema.getSchema().create({
                    type: targetType,
                    ref_id: target_id
                })
            }


            return this.graphEdgesSchema.getSchema().create({
                type: GRAPH_EDGE_TYPE_REPORT,
                from: userObject.id,
                to: targetObject.id
            })

        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }



    public async createRequestEmpathyGraph(user_id, request_id) {
        try {
            let userObject = await this.graphObjectsSchema.getSchema().find({
                where: {
                    type: GRAPH_OBJECT_TYPE_USER,
                    ref_id: user_id
                }
            })
            if (!userObject) {
                userObject = await this.graphObjectsSchema.getSchema().create({
                    type: GRAPH_OBJECT_TYPE_USER,
                    ref_id: user_id
                })
            }
            let requestObject = await this.graphObjectsSchema.getSchema().find({
                where: {
                    type: GRAPH_OBJECT_TYPE_REFUGE_REQUEST,
                    ref_id: request_id
                }
            })
            if (!requestObject) {
                requestObject = await this.graphObjectsSchema.getSchema().create({
                    type: GRAPH_OBJECT_TYPE_REFUGE_REQUEST,
                    ref_id: request_id
                })
            }

            return this.graphEdgesSchema.getSchema().create({
                type: GRAPH_EDGE_TYPE_EMPATHY,
                from: userObject.id,
                to: requestObject.id
            })

        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }






    public async createEmpathyGraph(user_id, target_id, targetType: string) {
        try {
            let userObject = await this.graphObjectsSchema.getSchema().find({
                where: {
                    type: GRAPH_OBJECT_TYPE_USER,
                    ref_id: user_id
                }
            })
            if (!userObject) {
                userObject = await this.graphObjectsSchema.getSchema().create({
                    type: GRAPH_OBJECT_TYPE_USER,
                    ref_id: user_id
                })
            }
            let targetObject = await this.graphObjectsSchema.getSchema().find({
                where: {
                    type: targetType,
                    ref_id: target_id
                }
            })
            if (!targetObject) {
                targetObject = await this.graphObjectsSchema.getSchema().create({
                    type: targetType,
                    ref_id: target_id
                })
            }

            return this.graphEdgesSchema.getSchema().create({
                type: GRAPH_EDGE_TYPE_EMPATHY,
                from: userObject.id,
                to: targetObject.id
            })

        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }


    public async getEdgeUser(edgeId) {
        let target = await this.graphEdgesSchema.getSchema().findById(edgeId);
        return this.graphObjectsSchema.getSchema().findById(target.from);

    }

    public async getEmpathyCountOfArticle(article_id) {
        let articleObject = await this.graphObjectsSchema.getSchema().find({
            where: {
                type: GRAPH_OBJECT_TYPE_ARTICLE,
                ref_id: article_id
            }
        })
        if (!articleObject) {
            articleObject = await this.graphObjectsSchema.getSchema().create({
                type: GRAPH_OBJECT_TYPE_ARTICLE,
                ref_id: article_id
            })
        }
        return this.graphEdgesSchema.getSchema().findAndCountAll({
            where: {
                type: GRAPH_EDGE_TYPE_EMPATHY,
                to: articleObject.id
            }
        })
    }






}