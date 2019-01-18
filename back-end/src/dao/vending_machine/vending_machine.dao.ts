import { injectable, inject } from "inversify";
import { MysqlConnection } from "../../db/mysql.connection";
import { NoticesSchema, NoticesAttribute } from "../../schemata/notices.schema";
import { VendingMachineItemHashTagsSchema, VendingMachineItemHashTagsAttribute } from "../../schemata/vending_machine_item_hash_tags.schema";
import { VendingMachineItemsSchema, VendingMachineItemsAttribute } from "../../schemata/vending_machine_items.schema";
import { VendingMachineItemPagesSchema, VendingMachineItemPagesAttribute } from "../../schemata/vending_machine_item_pages.schema";
import { HashTagsSchema } from "../../schemata/hash_tags.schema";
import { VendingMachineItemCommentsSchema, VendingMachineItemCommentsAttribute } from "../../schemata/vending_machine_item_comments.schema";
import { GRAPH_OBJECT_TYPE_USER, GRAPH_OBJECT_TYPE_VENDING_MACHINE_ITEM, GRAPH_EDGE_TYPE_EMPATHY, GRAPH_OBJECT_TYPE_COMMENT, GRAPH_OBJECT_TYPE_VENDING_MACHINE_ITEM_COMMENT } from "../../types/types";

import { GraphEdgesSchema } from "../../schemata/graph_edges.schema";
import { GraphObjectsSchema } from "../../schemata/graph_objects.schema";
import { UserProfilesSchema } from "../../schemata/user_profile.shcema";
import { GraphDAO } from "../graph/graph.dao";







@injectable()
export class VendingMachineDAO {

    public static sym = Symbol(VendingMachineDAO.name);

    constructor(
        @inject(MysqlConnection.sym) private mysqlCon: MysqlConnection,
        @inject(VendingMachineItemHashTagsSchema.sym) private vendingMachineItemHashTagsSchema: VendingMachineItemHashTagsSchema,
        @inject(VendingMachineItemsSchema.sym) private vendingMachineItemsSchema: VendingMachineItemsSchema,
        @inject(VendingMachineItemPagesSchema.sym) private vendingMachineItemPagesSchema: VendingMachineItemPagesSchema,
        @inject(VendingMachineItemCommentsSchema.sym) private vendingMachineItemCommentsSchema: VendingMachineItemCommentsSchema,
        @inject(HashTagsSchema.sym) private hashTagsSchema: HashTagsSchema,
        @inject(GraphObjectsSchema.sym) private graphObjectsSchema: GraphObjectsSchema,
        @inject(GraphEdgesSchema.sym) private graphEdgesSchema: GraphEdgesSchema,
        @inject(UserProfilesSchema.sym) private userProfilesSchema: UserProfilesSchema,
        @inject(GraphDAO.sym) private graphDAO: GraphDAO,
    ) {




        this.vendingMachineItemsSchema.getSchema().hasMany(this.vendingMachineItemPagesSchema.getSchema(), { foreignKey: 'item_id' });
        this.vendingMachineItemsSchema.getSchema().hasMany(this.vendingMachineItemHashTagsSchema.getSchema(), { foreignKey: 'item_id' });
        this.vendingMachineItemHashTagsSchema.getSchema().belongsTo(this.vendingMachineItemsSchema.getSchema(), { foreignKey: 'item_id', targetKey: 'id' })

        this.hashTagsSchema.getSchema().hasMany(this.vendingMachineItemHashTagsSchema.getSchema(), { foreignKey: 'tag_id' });
        this.vendingMachineItemHashTagsSchema.getSchema().belongsTo(this.hashTagsSchema.getSchema(), { foreignKey: 'tag_id', targetKey: 'id' });


        this.vendingMachineItemsSchema.getSchema().hasMany(this.vendingMachineItemCommentsSchema.getSchema(), { foreignKey: 'item_id' });

        this.vendingMachineItemsSchema.getSchema().belongsTo(this.graphObjectsSchema.getSchema(), { foreignKey: 'id', targetKey: 'ref_id' })


        this.vendingMachineItemCommentsSchema.getSchema().belongsTo(this.userProfilesSchema.getSchema(), { foreignKey: 'user_id' })
        this.vendingMachineItemCommentsSchema.getSchema().belongsTo(this.userProfilesSchema.getSchemaOfMention(), { foreignKey: 'mention_id' })


    }







    updateItemHit(item_id) {
        return this.mysqlCon.getSequelize().query(`
        UPDATE vending_machine_items  SET hit = hit+1  WHERE id = ?
        `, { replacements: [item_id + ''] })
    }


    getItem(item_id, user_id?: any) {

        let findOption = {
            where: {
                id: item_id
            },
            include: [
                // 댓글 수를 얻기 위해
                {
                    model: this.vendingMachineItemCommentsSchema.getSchema(),
                    include: [
                        { model: this.userProfilesSchema.getSchema(), attributes: ['nickname'], required: false },
                        { model: this.userProfilesSchema.getSchemaOfMention(), attributes: ['nickname'], required: false },
                    ]
                    // attributes: ['id',]
                },
                // 공감수를 얻기 위해
                {
                    required: false,
                    model: this.graphObjectsSchema.getSchema(),
                    where: { type: GRAPH_OBJECT_TYPE_VENDING_MACHINE_ITEM },
                    include: [
                        {
                            required: false,
                            model: this.graphEdgesSchema.getSchema(),
                            where: {
                                type: GRAPH_EDGE_TYPE_EMPATHY
                            },
                        }
                    ]
                },
                { model: this.vendingMachineItemPagesSchema.getSchema() },
                { model: this.vendingMachineItemHashTagsSchema.getSchema(), include: [{ model: this.hashTagsSchema.getSchema(), required: true }] }
            ],
            order: [
                this.mysqlCon.getSequelize().literal('IF(ISNULL(`VendingMachineItemComments`.`parent`),`VendingMachineItemComments`.`id`,`VendingMachineItemComments`.`parent`)'),
                this.mysqlCon.getSequelize().literal('`VendingMachineItemComments`.`created_at`')
            ]

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
        };




        return this.vendingMachineItemsSchema.getSchema().find(findOption);
    }


    public updateItemComment(id, content) {
        return this.vendingMachineItemCommentsSchema.getSchema().update({ content }, { where: { id } })
    }



    async getRecommendatonList(item_id, tag_id, limit: number, excluded?: number[]) {
        // 일단은 랜덤으로 뽑은 태그 하나를 던져서 그 태그를 가지고 있는 리스트만 뽑아내볼까?

        let _excluded = excluded ? excluded : [];
        let targetItems = await this.vendingMachineItemsSchema.getSchema().findAll({
            attributes: ['id'],
            where: {
                active: 1,
                id: {
                    $notIn: [parseInt(item_id), ..._excluded]
                },
            },
            include: [
                {
                    model: this.vendingMachineItemHashTagsSchema.getSchema(),
                    // required:,
                    where: {
                        tag_id: tag_id
                    },
                },
                // 공감수를 얻기 위해
                {
                    required: false,
                    model: this.graphObjectsSchema.getSchema(),
                    where: { type: GRAPH_OBJECT_TYPE_VENDING_MACHINE_ITEM },
                    include: [
                        {
                            required: false,
                            model: this.graphEdgesSchema.getSchema(),
                            where: {
                                type: GRAPH_EDGE_TYPE_EMPATHY
                            },
                        }
                    ]
                },
            ],
            order: [this.mysqlCon.getSequelize().literal('RAND()')],
            limit,
            // offset: parseInt(offset)

        });


        return this.vendingMachineItemsSchema.getSchema().findAll({
            where: {
                id: {
                    $in: targetItems.map(item => item.id)
                },
            },
            include: [
                {
                    model: this.vendingMachineItemHashTagsSchema.getSchema(),
                    // required:,
                    include: [
                        {
                            model: this.hashTagsSchema.getSchema(),
                            // required: true
                        }
                    ]
                },
                { model: this.vendingMachineItemPagesSchema.getSchema() },
            ],
            // order: [this.mysqlCon.getSequelize().literal('RAND()')],
            // limit: 3,
            // offset: parseInt(offset)

        })

    }



    getHashTagListByCategory(category_id, limit: string, offset: string) {

        return this.vendingMachineItemHashTagsSchema.getSchema().findAll({
            attributes: ['tag_id', this.mysqlCon.getSequelize().literal('count(*) count')],
            where: {
                representation: 1
            },
            include: [

                { model: this.hashTagsSchema.getSchema(), required: true, attributes: ['name'] },
                { model: this.vendingMachineItemsSchema.getSchema(), required: true, attributes: [], where: { category_id, active: 1 } }
            ],
            group: ['tag_id'],
            order: [this.mysqlCon.getSequelize().literal('count desc')],
            limit: parseInt(limit),

            offset: parseInt(offset)

        })






    }


    async getTargetItemsWithTagClass(tag_id) {
        return this.vendingMachineItemHashTagsSchema.getSchema().findAll({ where: { tag_id } });
    }



    async getTotalCountByCategory(category_id, targetItems?: VendingMachineItemHashTagsAttribute[]) {


        let findOption = {
            where: {
                category_id,
                active: 1
            }
        }

        if (targetItems) {
            (findOption.where as any).id = {
                $in: targetItems.map(itemTag => itemTag.item_id)
            }
        }

        return this.vendingMachineItemsSchema.getSchema().count(findOption);
    }

    public insertItemComment(item: VendingMachineItemCommentsAttribute) {
        return this.vendingMachineItemCommentsSchema.getSchema().create(item);
    }


    getSimpleList() {
        return this.vendingMachineItemsSchema.getSchema().findAll({
            order: [['id', 'desc']]
        })
    }


    async getListByCategory(category_id, limit, offset, targetItems?: VendingMachineItemHashTagsAttribute[]) {



        let findOption =
        {
            where: {
                category_id,
                active: 1,
            },
            include: [
                {
                    model: this.vendingMachineItemHashTagsSchema.getSchema(), required: false,
                    include: [
                        { model: this.hashTagsSchema.getSchema(), required: true }
                    ]
                },
                { model: this.vendingMachineItemPagesSchema.getSchema() },
                // 공감수를 얻기 위해
                {
                    required: false,
                    model: this.graphObjectsSchema.getSchema(),
                    where: { type: GRAPH_OBJECT_TYPE_VENDING_MACHINE_ITEM },
                    include: [
                        {
                            required: false,
                            model: this.graphEdgesSchema.getSchema(),
                            where: {
                                type: GRAPH_EDGE_TYPE_EMPATHY
                            },
                        }
                    ]
                },
            ],
            order: [['id', 'desc']],
            limit: parseInt(limit),
            offset: parseInt(offset)

        };

        if (targetItems) {
            (findOption.where as any).id = {
                $in: targetItems.map(itemTag => itemTag.item_id)
            }
        }


        return this.vendingMachineItemsSchema.getSchema().findAll(findOption)
    }


    async insertVendingMachineItem(item: VendingMachineItemsAttribute, pages: VendingMachineItemPagesAttribute[], representationTags: string[], hiddenTags: string[]) {
        delete item.id;
        item.active = item.active ? 1 : null;
        return this.mysqlCon.getSequelize().transaction(async t => {
            let promises: any[] = [];
            let newItem = await this.vendingMachineItemsSchema.getSchema().create(item, { transaction: t });
            pages.forEach(page => {
                page.item_id = newItem.id
                promises.push(this.vendingMachineItemPagesSchema.getSchema().create(page, { transaction: t }));
            })
            for (const tag of representationTags) {
                let targetTag = await this.hashTagsSchema.getSchema().find({
                    where: {
                        name: tag
                    }
                })
                if (!targetTag) {
                    targetTag = await this.hashTagsSchema.getSchema().create({ name: tag }, { transaction: t });
                }
                promises.push(this.vendingMachineItemHashTagsSchema.getSchema().create({ item_id: newItem.id, tag_id: targetTag.id, representation: 1 }, { transaction: t }))
            }
            for (const tag of hiddenTags) {
                let targetTag = await this.hashTagsSchema.getSchema().find({
                    where: {
                        name: tag
                    }
                })
                if (!targetTag) {
                    targetTag = await this.hashTagsSchema.getSchema().create({ name: tag }, { transaction: t });
                }
                promises.push(this.vendingMachineItemHashTagsSchema.getSchema().create({ item_id: newItem.id, tag_id: targetTag.id }, { transaction: t }))
            }
            return Promise.all(promises)
        })
    }


    async updateVendingMachineItem(item: VendingMachineItemsAttribute, pages: VendingMachineItemPagesAttribute[], representationTags: string[], hiddenTags: string[]) {
        item.active = item.active ? 1 : null;
        delete item.created_at;
        delete item.updated_at;
        return this.mysqlCon.getSequelize().transaction(async t => {
            let promises: any[] = [];
            promises.push(this.vendingMachineItemsSchema.getSchema().update(item, { where: { id: item.id }, transaction: t }));



            let existingPages = await this.vendingMachineItemPagesSchema.getSchema().findAll({ where: { item_id: item.id } });


            // 기존 페이지들을 가져와서 새로 넣을 페이지들과 비교해본다
            // 만약 기존 페이지가 새로 들어온 페이지들에 들어있지 않다면 삭제할 페이지들이다. 
            for (let i = 0; i < existingPages.length; i++) {
                let found = pages.findIndex(page => page.id == existingPages[i].id);
                if (found < 0) {
                    promises.push(this.vendingMachineItemPagesSchema.getSchema().destroy({ where: { id: existingPages[i].id }, transaction: t }))
                }
            }


            pages.forEach(page => {
                if (page.item_id < 0) {
                    page.item_id = item.id;
                    promises.push(this.vendingMachineItemPagesSchema.getSchema().create(page, { transaction: t }));
                } else {
                    delete page.created_at;
                    delete page.updated_at;

                    promises.push(this.vendingMachineItemPagesSchema.getSchema().update(page, { where: { id: page.id }, transaction: t }));
                }

            })




            await this.vendingMachineItemHashTagsSchema.getSchema().destroy({ where: { item_id: item.id }, transaction: t })
            for (const tag of representationTags) {
                let targetTag = await this.hashTagsSchema.getSchema().find({
                    where: {
                        name: tag
                    }
                })
                if (!targetTag) {
                    targetTag = await this.hashTagsSchema.getSchema().create({ name: tag }, { transaction: t });
                }
                promises.push(this.vendingMachineItemHashTagsSchema.getSchema().create({ item_id: item.id, tag_id: targetTag.id, representation: 1 }, { transaction: t }))
            }
            for (const tag of hiddenTags) {
                let targetTag = await this.hashTagsSchema.getSchema().find({
                    where: {
                        name: tag
                    }
                })
                if (!targetTag) {
                    targetTag = await this.hashTagsSchema.getSchema().create({ name: tag }, { transaction: t });
                }
                promises.push(this.vendingMachineItemHashTagsSchema.getSchema().create({ item_id: item.id, tag_id: targetTag.id }, { transaction: t }))
            }
            return Promise.all(promises)
        })
    }



    public async deleteArticleComment(id, isParent) {
        try {
            if (isParent) {
                // ctc is Comment to Comment 대댓글이라는 뜻.
                // 대댓글은 어떤 댓글의 자식객체라고 보면된다. 
                // 따라서 대댓글이 아닌 부모댓글객체를 삭제 할 경우 자식객체들의 graph object까지 삭제를 해주어야 한다. 
                let ctcs = await this.vendingMachineItemCommentsSchema.getSchema().findAll({ where: { parent: id } });
                if (ctcs.length > 0) {
                    await this.graphDAO.deleteGraphObjectsMulti(
                        ctcs.map(ctc => ctc.id),
                        GRAPH_OBJECT_TYPE_VENDING_MACHINE_ITEM_COMMENT)
                }
            }
            await this.vendingMachineItemCommentsSchema.getSchema().destroy({ where: { $or: { id: id, parent: id } } });
            await this.graphDAO.deleteGraphObject(id, GRAPH_OBJECT_TYPE_VENDING_MACHINE_ITEM_COMMENT)
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }




}