import { Request } from "express";
import { UsersAttribute } from "../schemata/users.schema";






export interface BaseRequest extends Request {
    userData?: UsersAttribute,
    social?: any,
    failLogin?: { message: string, email?: string },


}


export const GRAPH_OBJECT_TYPE_USER = 'USER';
export const GRAPH_OBJECT_TYPE_ARTICLE = 'ARTICLE';
export const GRAPH_OBJECT_TYPE_COMMENT = 'COMMENT';
export const GRAPH_OBJECT_TYPE_HAEWOOSO_COMMENT = 'HAEWOOSO_C';
export const GRAPH_OBJECT_TYPE_HAEWOOSO_ARTICLE = 'HAEWOOSO_A';
export const GRAPH_OBJECT_TYPE_REFUGE_REQUEST = 'REQUEST';
export const GRAPH_OBJECT_TYPE_VENDING_MACHINE_ITEM = 'VM_ITEM';
export const GRAPH_OBJECT_TYPE_VENDING_MACHINE_ITEM_COMMENT = 'VM_COMMENT';



export const GRAPH_EDGE_TYPE_EMPATHY = 'EMPATHY';
export const GRAPH_EDGE_TYPE_REPORT = 'REPORT';
