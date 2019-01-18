import { Schema } from 'mongoose';
import { injectable, inject } from 'inversify';
import { MongoDBConnection } from '../../db/mongodb.connection';





@injectable()
export class GraphObjectsSchema {


    static sym = Symbol(GraphObjectsSchema.name);


    private graphObjectsSchema: Schema

    public getSchema() {
        return this.mongoDBCon.getMongoose().model('GraphObject', this.graphObjectsSchema, 'graph_objects');
    }


    constructor(@inject(MongoDBConnection.sym) private mongoDBCon: MongoDBConnection) {


        this.graphObjectsSchema = new (this.mongoDBCon.getMongoose()).Schema({
            type: {
                type: String,
                required: true
            },
            ref_id: {
                type: Number,
                required: true
            },
        })




    }

}