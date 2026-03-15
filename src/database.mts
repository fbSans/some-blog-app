//// node:sqlite is a experimental module
//// This file is here just to test some ideas

//All functions here may be cleaned to make a specific project
import { DatabaseSync } from "node:sqlite";
import { DB_PATH, DB_DIR, NR_ROUTE_ITEM } from "./common.mjs";


export function get_db(){
   return  new DatabaseSync(DB_PATH)
}






