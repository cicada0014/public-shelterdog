import { injectable, inject } from "inversify";
import { MysqlConnection } from "../../db/mysql.connection";
import { GamesSchema, GamesAttribute } from "../../schemata/games.schema";
import { GameEvaluationsSchema } from "../../schemata/game_evaluations.schema";
import moment = require("moment");
import { UserGameDatasSchema, UserGameDatasAttribute } from "../../schemata/user_game_datas.schema";
import { RankingDefenceGameSchema } from "../../schemata/ranking_defence_game.schema";
import { UserProfilesSchema } from "../../schemata/user_profile.shcema";







@injectable()
export class GameDAO {

    public static sym = Symbol(GameDAO.name);

    constructor(
        @inject(MysqlConnection.sym) private mysqlCon: MysqlConnection,
        @inject(GamesSchema.sym) private gameSchema: GamesSchema,
        @inject(UserProfilesSchema.sym) private userProfileSchemaSchema: UserProfilesSchema,
        @inject(GameEvaluationsSchema.sym) private gameEvaluationSchema: GameEvaluationsSchema,
        @inject(UserGameDatasSchema.sym) private gameDatasSchema: UserGameDatasSchema,




        @inject(RankingDefenceGameSchema.sym) private rankingDefenceGameSchema: RankingDefenceGameSchema,




    ) {

        this.rankingDefenceGameSchema.getSchema().hasOne(this.userProfileSchemaSchema.getSchema(), { foreignKey: 'id' })

    }

    public saveUserData(data: UserGameDatasAttribute) {
        return this.gameDatasSchema.getSchema().create(data)
    }

    public loadUserData(game_id, user_id) {
        return this.gameDatasSchema.getSchema().findAll({ where: { game_id, user_id } })
    }

    public updateUserData(data: UserGameDatasAttribute) {
        data.save_count = data.save_count ? data.save_count + 1 : 1;
        return this.gameDatasSchema.getSchema().update(data, { where: { id: data.id } })
    }



    public checkPaperingUser(ip) {

        return this.gameEvaluationSchema.getSchema().count({
            where: {
                ip,
                created_at: {
                    $gt: moment().subtract('10', 'minutes').format('YYYY-MM-DD HH:mm:ss'),

                }
            }
        })
    }


    public getEvaluationList(game_id) {
        return this.gameEvaluationSchema.getSchema().findAll({ where: { game_id }, order: [['id', 'desc']], limit: 20 })
    }

    public insertEvaluaion(ip, content, nickname, game_id) {
        return this.gameEvaluationSchema.getSchema().create({
            ip,
            content,
            game_id,
            nickname
        })
    }

    public getRankingList() {
        return this.rankingDefenceGameSchema.getSchema().findAll({
            include: [{
                model: this.userProfileSchemaSchema.getSchema(),
                required: true
            }],
            order: [['life', 'desc'], ['deposit', 'desc']],
            limit: 100
        })
    }

    public async upsertRankingDefenceGame(data: { user_id, life, deposit }) {
        let existingData = await this.rankingDefenceGameSchema.getSchema().findById(data.user_id);
        if (existingData) {

            if (existingData.life == data.life && existingData.deposit == data.deposit) {
                return 'tai'
            }

            if (existingData.life > data.life) {
                return 'life more'
            }
            if (existingData.deposit > data.deposit) {
                return 'deposit more'
            }
        }

        return this.rankingDefenceGameSchema.getSchema().upsert(data);
    }

    public getRankingDefeneGame(user_id) {
        return this.rankingDefenceGameSchema.getSchema().findById(user_id);
    }



}