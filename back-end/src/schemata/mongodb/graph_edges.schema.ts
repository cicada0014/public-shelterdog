import { Schema } from 'mongoose';

import { injectable, inject } from 'inversify';
import { MongoDBConnection } from '../../db/mongodb.connection';





@injectable()
export class GraphEdgesSchema {


    static sym = Symbol(GraphEdgesSchema.name);


    private graphEdgesSchema: Schema

    public getSchema() {
        return this.mongoDBCon.getMongoose().model('GraphObject', this.graphEdgesSchema, 'graph_edges');
    }
    constructor(@inject(MongoDBConnection.sym) private mongoDBCon: MongoDBConnection) {

        this.graphEdgesSchema = new (this.mongoDBCon.getMongoose()).Schema({
            type: {
                type: String,
                required: true
            },
            from: {
                type: Schema.Types.ObjectId,
                required: true
            },
            to: {
                type: Schema.Types.ObjectId,
                required: true
            },
        })

    }
}