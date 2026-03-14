//// node:sqlite is a experimental module
//// This file is here just to test some ideas

//All functions here may be cleaned to make a specific project
import { DatabaseSync } from "node:sqlite";
import { DB_PATH, DB_DIR, NR_ROUTE_ITEM } from "./common.mjs";
import * as fs from "fs"

export function get_db(){
   return  new DatabaseSync(DB_PATH)
}
export function migrate(){
   const path = fs.mkdirSync(DB_DIR, {recursive: true});
   const db = get_db();
   console.log(`Running migrations on ${DB_PATH}`);
   db.exec(`
      CREATE TABLE IF NOT EXISTS counts (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         item TEXT UNIQUE,
         value INTEGER DEFAULT 0
      );
   `);

   new_item(db, NR_ROUTE_ITEM);
}

export function incr_item_count(db: DatabaseSync, item: string){
   const prepared = db.prepare(`update counts set value = value + 1 where item=:item`)
   const result = prepared.run({item})
   return result
}

export function get_item_count(db: DatabaseSync, item: string){
   const prepared = db.prepare(`select value from counts where item = :item`)
   const  result = prepared.get({item})
   return result ? Number(result.value) : 0; 
}

export function new_item(db: DatabaseSync, item: string){
   const prepared = db.prepare(`insert or ignore into counts (item) values (:item)`);
   const result = prepared.run({item})
}